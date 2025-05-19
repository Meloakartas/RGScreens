import os
import sys
import re
import json
import pytz
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
import time
import uuid

load_dotenv()

class DateTimeEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime):
      return obj.isoformat()
    return super().default(obj)

def log(msg):
  print(msg, file=sys.stderr)

def get_mongo_client():
  node_env = os.getenv("NODE_ENV")

  db_name = os.getenv("MONGO_DB_NAME")

  if node_env == "production":
    user = os.getenv("MONGO_ROOT_USERNAME")
    password = os.getenv("MONGO_ROOT_PASSWORD")
    uri = f"mongodb://{user}:{password}@mongo:27017/{db_name}?authSource=admin"
  else:
    uri = f"mongodb://mongo:27017/{db_name}"

  return MongoClient(uri)

# Scrape Tennis Over data from TennisBrain
# Background task
def scrapeTennisOver():
  log(f"Connecting to MongoDB...")
  client = get_mongo_client()
  db = client["melobet"]
  log(f"Connected to MongoDB !")

  runDb = db["runs"]
  currentRunId = str(uuid.uuid4())

  runDb.insert_one({
    "uuid": currentRunId,
    "date": datetime.now(),
    "status": "STARTED"
  })

  try:
    log('Starting scraping...')

    tennisBrainPage = loginAndGetSetsPage(db["tennisBrainConfig"])
    runDb.update_one({ "uuid": currentRunId }, {
      "$set": {
        "status": "LOGGED_IN"
      }
    })
    log('Successfully logged in !')

    scrapedMatches = scrapeAndParseSetsPage(tennisBrainPage)
    runDb.update_one({ "uuid": currentRunId }, {
      "$set": {
        "status": "SCRAPED"
      }
    })
    log('Successfully scraped !')

    filteredMatches = filterMatchesToSave(scrapedMatches)
    log(f'Found {len(filteredMatches)} predictions to consider.')

    runDb.update_one({ "uuid": currentRunId }, {
      "$set": {
        "status": "FINISHED",
        "filtered": len(filteredMatches),
        "scraped": len(scrapedMatches)
      }
    })

    log(f'Successfully scraped {len(scrapedMatches)} predictions and filtered {len(filteredMatches)} predictions.')
    print(json.dumps(filteredMatches, cls=DateTimeEncoder))
    sys.exit(0)
  except Exception as e:
    runDb.update_one({ "uuid": currentRunId }, {
      "$set": {
        "status": "FAILED"
      }
    })
    log(f"Error: {e}")
    sys.exit(1)

# Filter scraped matches to get only unique matches to save
def filterMatchesToSave(scrapedMatches):
  # Filtered matches to save in our ScrapedMatches database
  matchesToSave = []

  # For each ScrapedMatch in our scraped matches
  for scrapedMatch in scrapedMatches:
    if scrapedMatch is None or scrapedMatch["player1Odd"] is None or scrapedMatch["player2Odd"] is None or scrapedMatch["player1Percent"] is None or scrapedMatch["player2Percent"] is None:
      continue

    matchesToSave.append(scrapedMatch)

    # evPlayer1 = scrapedMatch["player1Odd"] * scrapedMatch["player1Percent"]
    # evPlayer2 = scrapedMatch["player2Odd"] * scrapedMatch["player2Percent"]

    # if (evPlayer1 > 100 and scrapedMatch["player1Percent"] >= 30):
    #   scrapedMatch["betType"] = 1
    #   scrapedMatch["minOdd"] = round(100/scrapedMatch["player1Percent"], 2)
    #   scrapedMatch["result"] = None
    #   matchesToSave.append(scrapedMatch)

    # if (evPlayer2 > 100 and scrapedMatch["player2Percent"] >= 30):
    #   scrapedMatch["betType"] = 2
    #   scrapedMatch["minOdd"] = round(100/scrapedMatch["player2Percent"], 2)
    #   scrapedMatch["result"] = None
    #   matchesToSave.append(scrapedMatch)

  return matchesToSave

# Scrape and parse sets page from TennisBrain
def scrapeAndParseSetsPage(html_content):
  from bs4 import BeautifulSoup

  soup = BeautifulSoup(html_content, "html.parser")
  tab_panes = soup.select("div.tab-pane.fade")

  results = []  # Store results in a list

  for tab_pane in tab_panes:
    # Get title
    title_cell = tab_pane.select_one("td.title_head")
    if not title_cell:
      continue

    leagueName = re.sub(
      r"\s+",
      " ",
      title_cell.text.replace(" - Set Predictions", "")
      .replace("Mens - ", "ATP - ")
      .replace("Womens - ", "WTA - ")
      .strip(),
    )

    # Filter out leagues we are not interested in
    if leagueName.startswith(
      (
        "WTA - W100",
        "WTA - W75",
        "WTA - W50",
        "WTA - W35",
        "WTA - W15",
        "ATP - M15",
        "ATP - M25",
      )
    ):
      continue

    # Extract city name before surface type in parentheses
    match = re.search(r"^(ATP|WTA)\s*-\s*.*?[-]?\s*([\w\s]+)\s*\([^)]*\)$", leagueName)

    if match:
      cityName = (
        f"{match.group(1)} - {match.group(2).strip()}"  # Keep ATP/WTA and city name
      )
    else:
      cityName = leagueName  # Fallback to full name if no match

    # Get matches
    progress_containers = tab_pane.select("div.progress-bar-container")

    # For each match
    for container in progress_containers:
      bars = container.find_all("div")
      # Get the widths and get the percentages out of it
      widths = [parseAndRoundPercentage(bar.get("style")) for bar in bars]
      player1Percent = widths[0]
      player2Percent = widths[1]

      results.append(parseMatchDetails(results, container, cityName, player1Percent, player2Percent))
  return results  # Return results

# Parse match details from page
def parseMatchDetails(results, container, cityName, player1Percent, player2Percent):
  players = getPreviousElement(container)  # Get the players names
  if players:  # If we find them
    betfairId = None
    tennisbrainId = None
    date = players.select_one("td:nth-child(1)").text.strip()  # Get date
    if date == "Completed":  # Do not take the ones that are completed
      return
    date = pytz.utc.localize(datetime.strptime(date, "%Y-%m-%d %H:%M"))
    player1Element = players.select_one("td:nth-child(2)")  # Get Player1
    tennisbrainId = player1Element["id"]
    player1 = player1Element.text.strip()  # Get Player1
    player1OddElement = players.select_one("td:nth-child(3)")  # Get Player1 Odd
    player1OddString = player1OddElement.text.strip()
    if player1OddString == 'In Play':
      return
    if player1OddString == '':
      player1Odd = None
    else:
      betfairId = player1OddElement.find("a")["href"].split("/")[-1]
      # Format is : 1.243125530, but I think they actually parse it as number, and trailing zeros are therefore removed, we need to add them back
      while len(betfairId) < 11:
        betfairId += "0"
      player1Odd = float(player1OddString)
    player2 = players.select_one("td:nth-child(5)").text.strip()  # Get Player2
    player2OddElement = players.select_one("td:nth-child(4)")  # Get Player1 Odd
    player2OddString = player2OddElement.text.strip()
    if player2OddString == 'In Play':
      return
    if player2OddString == '':
      player2Odd = None
    else:
      player2Odd = float(player2OddString)
    return { "tennisBrainId": tennisbrainId, "tennisBrainDateTime": date, "tennisBrainTournament": cityName, "tennisBrainPlayer1": player1, "tennisBrainPlayer2": player2, "player1Odd": player1Odd, "player2Odd": player2Odd, "player1Percent": player1Percent, "player2Percent": player2Percent, "betfairMarketId": betfairId }

# Login and get sets page
def loginAndGetSetsPage(tennisBrainConfig):
  from bs4 import BeautifulSoup
  import requests

  # Create a session to manage cookies
  tennisBrainDetails = tennisBrainConfig.find_one({ "_id": "main" })

  if tennisBrainDetails is None:
    tennisBrainDetails = {
      "_id": "main",
      "Session": None
    }
    tennisBrainConfig.insert_one(tennisBrainDetails)

  session = (
    requests.Session()
    if tennisBrainDetails["Session"] is None
    else readSessionFromDatabase(tennisBrainDetails["Session"])
  )
  sessionCookieIsValid = checkValidityOfSessionCookie(session)

  if sessionCookieIsValid is False:
    # Step 1: Get the CSRF token
    loginUrl = "https://www.tennisbrain.com/accounts/signin/"
    response = session.get(loginUrl)

    # Parse the CSRF token
    soup = BeautifulSoup(response.text, "html.parser")
    csrfToken = soup.find("input", {"name": "csrfmiddlewaretoken"})["value"]

    # Step 2: Send the login request with the CSRF token
    email = os.getenv("TENNIS_BRAIN_EMAIL")
    password = os.getenv("TENNIS_BRAIN_PASSWORD")
    loginPayload = {
      "csrfmiddlewaretoken": csrfToken,
      "email": email,
      "password": password,
    }

    headers = {"Referer": loginUrl, "Cache-Control": "no-cache", "Pragma": "no-cache"}

    session.post(loginUrl, data=loginPayload, headers=headers)
    cookies_data = [
      {"name": cookie.name, "value": cookie.value, "expires": cookie.expires}
      for cookie in session.cookies
    ]
    tennisBrainConfig.update_one(
      {"_id": "main"},
      {"$set": {"Session": json.dumps({"headers": dict(session.headers), "cookies": cookies_data})}}
    )

  tableUrl = "https://www.tennisbrain.com/outright_table"
  response = session.get(
    tableUrl, headers={"Cache-Control": "no-cache", "Pragma": "no-cache"}
  )

  return response.text

# Read a session object from database
def readSessionFromDatabase(session):
  import requests

  session_data = json.loads(session)
  session = requests.Session()
  session.headers.update(session_data["headers"])
  # Restore cookies properly
  for cookie in session_data["cookies"]:
    session.cookies.set(
      name=cookie["name"], value=cookie["value"], expires=cookie["expires"]
    )

  return session

def checkValidityOfSessionCookie(session):
  valid = False
  cookies = session.cookies
  for cookie in cookies:
    if cookie.name == "sessionid":
      timeExpire = timestampToUtc(cookie.expires)
      return datetime.now(timezone.utc) < (timeExpire - timedelta(days=1))

  return valid

def timestampToUtc(timestamp):
  return datetime.fromtimestamp(timestamp, timezone.utc)

# Parse and round Percentage from progress bar width text
def parseAndRoundPercentage(width):
  try:
    width = re.sub(r"width:\s*", "", width)  # Remove 'width:' prefix
    percentage = float(re.sub("%", "", width))  # Remove '%' and convert to float
    return round(percentage, 2)
  except ValueError:
    return 0.0  # Default to 0 if parsing fails

# Get previous element
def getPreviousElement(container):
  grandparent = container.find_parent("tr")  # Assuming it's inside a table row
  if not grandparent:
    return None

  table_body = grandparent.find_parent("tbody")
  if not table_body:
    return None

  all_trs = table_body.find_all("tr")
  current_index = all_trs.index(grandparent) if grandparent in all_trs else -1

  return all_trs[current_index - 1] if current_index > 0 else None

scrapeTennisOver()