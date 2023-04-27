FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV SECRET = "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o"

RUN npm run build