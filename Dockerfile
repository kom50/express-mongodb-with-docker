FROM node:lts

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN ls -la  
# Add this line for debugging

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# CMD to run your application
# CMD ["node", "index.js"]
CMD ["./node_modules/.bin/nodemon", "start"]
