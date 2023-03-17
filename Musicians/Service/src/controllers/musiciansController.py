from flask import jsonify, request, url_for,redirect
from Database import db as Database
from validations.MusicianInfo import musicianinfo as infoMusician



# Musician
def getMusician(email):
    db = Database.dbConnection()
    musicians = list(db.Musicians.find_one({"correo" : email}))
    return jsonify({musicians})

def prueba():
    Database.dbConnection()
    return Database.dbConnection()

def getInfomusician():
    name = request.form["name"]
    email = request.form["email"]
    years = request.form["years"]
    if name and email and years:
        MusicianInfo = infoMusician(name,email,years)
        MusicianInfo.insert_one(MusicianInfo.toDBCollection())
        response = jsonify ({
            "name": name,
            "email": email,
            "years": years
        })
        return response
    else:
        return not_Found()
    
def home():
    return jsonify({"message":"Holi"})
    
    




# ERRORES
def not_Found(error=None):
    message = jsonify({
        "message" : "resource not found" + request.url,
        "status": 404
    })


# 400 cuando se hace una mala peti
# 