from flask import Flask,jsonify 
from pymongo import MongoClient
# import certifi 

#MONGO_URI = "pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.kzfpgmi.mongodb.net/?retryWrites=true&w=majority")"
MONGO_URI = "mongodb://localhost:27017"

def dbConnection():
    try:
        cliente = MongoClient(MONGO_URI)
        return cliente.Nodens_Musicians
    except ConnectionError:
        print("error de conexion con la bdd")
    return jsonify({"message":"error,db"})
