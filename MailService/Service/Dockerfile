FROM node:slim

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

ENV EMAIL "nodems@outlook.es" 
ENV PASSWORD "eufycabpdtlvntas"
ENV HOST 0.0.0.0
ENV PORT 8000

CMD [ "npm", "start" ]