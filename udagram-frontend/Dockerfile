## Build
FROM node:20 AS build
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
RUN npm run build

## Run 
FROM nginx:alpine
COPY --from=build /usr/src/app/www /usr/share/nginx/html
