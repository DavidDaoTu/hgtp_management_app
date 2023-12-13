### Build Front-End
### E.g.: $ docker build -t frontend:latest .

## Create an image based on the official Node image from dockerhub
FROM node:18 as development

## Create app directory
WORKDIR /usr/src/app

## A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
## Clean & install app dependencies
RUN npm ci

## Bundle app source
## Get all the code needed to run the app
COPY . .

## React buid for production environment (smaller size)
RUN npm run build

## Create an HTTP server based on nginx image; 
## default nginx server's port is 80
### E.g.: $ docker run -d -p 3000:80 frontend:latest
FROM nginx:alpine

## Copy frontend's build folder to nginx server's default folder
COPY --from=development /usr/src/app/build /usr/share/nginx/html