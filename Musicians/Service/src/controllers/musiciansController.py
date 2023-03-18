from flask import jsonify, request, url_for,redirect,Response
from Database import db as Database
from bson import json_util
from bson.objectid import  ObjectId
from validations.MusicianInfo import musicianinfo as infoMusician
### Home ###
def home():
    return jsonify({"Message":"pong"})
### GET ALL ###
def getAllmusician ():
    db = Database.dbConnection()
    users = list(db.Musicians.find())
    response = json_util.dumps(users)
    return response #Response(response, mimetype="application/json")
### GET ONLY ID ###
def getMusician(id):
    db = Database.dbConnection()
    user = db.Musicians.find_one({"_id" : ObjectId(id)})
    response = json_util.dumps(user)
    return response
### DELETE ###   
def deleteMusician(id):
    db = Database.dbConnection()
    db.Musicians.delete_one({"_id": ObjectId(id)})
    response = jsonify({"message": "user" + id + "was deleted successfully"})
    return response
### POST ###
def postInfomusician():
    # recive datos

    #se mandan los datos

        db = Database.dbConnection()

        id = db.Musicians.insert_one(
            request.json
        )
        response = {
            "id": str(id.inserted_id),
        }
        return response

### PUT ###
def putMusician (id):
    username = request.json["username"]
    years = request.json["years"]
    email = request.json["email"]
    
    # if !MusicianValidator.validate(request.json):
    #   return BadRequest()    
    
    if username and years and email:
        db = Database.dbConnection()
        db.Musicians.update_one({"_id": ObjectId(id)}, {"$set": {
            "username" : username,
            "years" : years,
            "email" : email    
        }})
        responde = jsonify({"message": "user" + id + "was updated successsfully"})
        return responde
# ERRORES
def not_Found(error=None):
    message = jsonify({
        "message" : "resource not found" + request.url,
        "status": 404
    })
# 400 cuando se hace una mala peti
# 