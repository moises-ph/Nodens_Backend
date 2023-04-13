FROM python:slim

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install nginx \
    && apt-get -y install python3-dev \
    && apt-get -y install build-essential

RUN python -m pip install --upgrade pip

WORKDIR /app

COPY requeriments.txt requeriments.txt

COPY . .

COPY nginx.conf /etc/nginx

RUN pip install -r requeriments.txt

RUN chmod +x ./start.sh

ENV SECRET=aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o

CMD ["sh","/app/start.sh"]