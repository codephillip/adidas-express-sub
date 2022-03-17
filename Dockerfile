FROM node:16.0-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

# Bundle app source
COPY . .


RUN yarn install
RUN yarn build

EXPOSE 8000


