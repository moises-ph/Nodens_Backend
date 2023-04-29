FROM node:slim

RUN apt clean \ 
    apt update  -y \
    apt upgrade -y

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install

ENV HOST 0.0.0.0

ENV PORT 8000

ENV SECRET "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o"

EXPOSE 8000

CMD ["npm", "start"]