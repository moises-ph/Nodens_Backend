FROM node:slim

RUN apt clean \ 
    apt update  -y

RUN apt install nginx -y

WORKDIR /app

COPY package.json .

COPY . .

COPY nginx.conf /etc/nginx

RUN npm install

RUN chmod +x ./start.sh

ENV SECRET "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o"

EXPOSE 8000

CMD ["sh", "/app/start.sh"]