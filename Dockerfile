# # The first instruction is what image we want to base our container on
# # We Use an official Node version 21 image as a parent image
# FROM node:21-alpine

# # Create an environment variable for MongoDB URI
# # ENV MONGODB_URI='mongodb://localhost:27017/realestate'

# # Copy the contents of the project folder into the working directory of
# # docker image
# #first dot is the current direstory, and the second is the path to the container directory 
# COPY backend usr/src/app/
# COPY frontend usr/src/app/

# # Set working directory for the project to /usr/src/app
# # NOTE: all the directives that follow in the Dockerfile will be executed
# # in working directory.
# WORKDIR /usr/src/app

# RUN npm install


# CMD [ "node", "webApp.js" ]







# # Install any needed packages specified in package.json
# RUN npm install

# EXPOSE 5000

# # Periodically check if the application is running. If not, shutdown the
# # container.
# HEALTHCHECK --interval=2m --timeout=5s --start-period=2m \
#   CMD nc -z -w5 127.0.0.1 5080 || exit 1

# # Wait 5 seconds for the MongoDB connection
# CMD echo "Warming up" && sleep 5 && npm start