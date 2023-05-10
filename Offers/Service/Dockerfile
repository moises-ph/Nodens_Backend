FROM node:slim

RUN apt clean \ 
    apt update  -y \
    apt upgrade -y

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install

ENV HOST 0.0.0.0

ENV PORT 80

ENV SECRET "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o"

EXPOSE 80

CMD ["npm", "start"]