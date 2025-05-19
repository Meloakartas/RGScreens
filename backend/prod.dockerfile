FROM node:18-alpine

ENV TZ=UTC

# Install Python & pip
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code (including scraper)
COPY . .

# Install Python dependencies
RUN pip3 install --no-cache-dir --break-system-packages -r scraper/requirements.txt

# Build and copy scraper.py to dist
RUN npm run build && npm run postbuild

# Remove dev dependencies
RUN npm prune --omit=dev

# Start the app
CMD ["node", "dist/main"]
