from pymongo import MongoClient
from settings import config

# import certifi 
#MONGO_URI = "pymongo.MongoClient("mongodb+srv://<username>:<password>@cluster0.kzfpgmi.mongodb.net/?retryWrites=true&w=majority")"

### ###
def dbConnection():
    try:
        cliente = MongoClient(config.MONGOURI)
        db = cliente.Nodens_Organizers
    except ConnectionError:
        print("error de conexion con la bdd")
    return db       
###