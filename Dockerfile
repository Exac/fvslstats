FROM alpine

# Create app directory
WORKDIR /usr/src/app

# Install npm dependencies from package-lock.json and package.json
COPY package*.json ./
RUN apk add --update nodejs

# Bundle the source code
COPY . .
RUN npm install

# Expose port and run server
EXPOSE 8081
CMD [ "npm", "start" ]
