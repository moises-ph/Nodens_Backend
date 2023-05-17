FROM python:slim

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install nginx \
    && apt-get -y install python3-dev \
    && apt-get -y install build-essential

RUN python -m pip install --upgrade pip

WORKDIR /app

COPY serve.sh ./

RUN chmod +x serve.sh

COPY requeriments.txt requeriments.txt

COPY . .

RUN pip install -r requeriments.txt

ENV SECRET=aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o

EXPOSE 80

CMD ["sh", "/app/serve.sh"]