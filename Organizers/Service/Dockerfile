FROM ubuntu:20.04

RUN apt update
RUN apt install python3-pip -y

WORKDIR /app

COPY requeriments.txt requeriments.txt

RUN pip3 install -r requeriments.txt

COPY . .

CMD ["python3", "src/app.py"]