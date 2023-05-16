FROM node:slim

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV EMAIL "nodems@outlook.es" 
ENV PASSWORD "eufycabpdtlvntas"
ENV HOST 0.0.0.0
ENV PORT 80

CMD [ "npm", "start" ]