# Use the official lightweight Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Define an argument for the NODE_ENV variable
ARG NODE_ENV

# Install dependencies based on the NODE_ENV value
# - In development mode, install all dependencies (including devDependencies)
# - In production mode, install only production dependencies
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install; \
    else yarn install --production; \
    fi

# Copy the rest of the application code into the container
COPY . .

# Set the PORT environment variable and expose it
ENV PORT=5009
EXPOSE $PORT

# Define the command to run the application
CMD [ "node", "index.js" ]