FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy all app source
COPY . .

# Expose app port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:dev"]
