# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install
RUN npm install pg

# Copy the current directory contents into the container at /app
COPY . .

# Make port 5432 available to the world outside this container
EXPOSE 5432

# Run index.js when the container launches
CMD ["node", "index.js"]