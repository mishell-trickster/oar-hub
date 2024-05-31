# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install Git to pull from GitHub
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/mishell-trickster/oar-hub.git .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3050
EXPOSE 3051

# Command to run the application
CMD ["npm", "run", "start:prod"]
