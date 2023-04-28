FROM node:slim

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

ENV SECRET "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o"

RUN npm run build

CMD ["npm", "start"]