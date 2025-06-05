# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Expose port 5000
EXPOSE 5000

# Define the command to run the application
CMD ["node", "./bin/www"]
