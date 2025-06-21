# create new docker file "Dockerfile"

# Add following properties and define according to your project

# Use an official Node.js runtime as a base image

FROM node:16.20.2-alpine

# Set the working directory in the container

WORKDIR /app

# Copy package.json and package-lock.json to the working directory

COPY package\*.json ./

# Copy the rest of the application code

COPY . .
ENV NODE_ENV=production
# Install dependencies
RUN npm config set proxy http://10.9.46.206:8080
RUN npm config set https-proxy http://10.9.46.206:8080
RUN npm install

# Expose the port your Node.js application will run on

EXPOSE 8011

# Command to run your project

CMD ["node", "server.js"]