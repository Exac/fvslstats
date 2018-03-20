FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install npm dependencies from package-lock.json and package.json
COPY package*.json ./
RUN npm install

# Bundle the source code
COPY . .

# Expose port and run server
EXPOSE 8081
CMD [ "npm", "start" ]
