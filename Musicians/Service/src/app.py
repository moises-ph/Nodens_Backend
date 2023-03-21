#reunir el codigo y iniciar el svr
from flask import Flask, request, jsonify
from flask_optional_routes import OptionalRoutes
from Database import db as Database
from bson import json_util
from bson.objectid import  ObjectId
from validations import MusicianInfo

from utils.tokenValidator import token_required

app = Flask(__name__)

optional = OptionalRoutes(app)

### GETALL ###
@app.route("/musician", methods=["GET"])
def getAllmusician ():
    db = Database.dbConnection()
    users = list(db.Musicians.find())
    response = json_util.dumps(users)
    return response #Response(response, mimetype="application/json")

### GETONLY ###
@app.route("/musician", methods=["GET"])
@token_required
def getMusician(id):
    db = Database.dbConnection()
    user = db.Musicians.find_one({"_id" : ObjectId(id)})
    response = json_util.dumps(user)
    return response


### POST ###
@app.route("/musician", methods=["POST"])
@token_required
def postInfomusician(id):
    # recive datos

    form = MusicianInfo.musicianInstrument()
    if not form.validate_on_submit():
        return "No form"

    #se mandan los datos

    print(id)

    # db = Database.dbConnection()

    # id = db.Musicians.insert_one(
    #     request.json
    # )
    # response = {
    #     "id": str(id.inserted_id),
    # }
    return "Ok"


### DELETE ###
@app.route("/musician", methods=["DELETE"])
@token_required
def deleteMusician(id):
    db = Database.dbConnection()
    db.Musicians.delete_one({"_id": ObjectId(id)})
    response = jsonify({"message": "user" + id + "was deleted successfully"})
    return response


### PUT ###
@app.route("/musician", methods=["PUT"])
@token_required
def putMusician (id):
    
    # if !MusicianValidator.validate(request.json):
    #   return BadRequest()    

    db = Database.dbConnection()
    db.Musicians.update_one({"_id": ObjectId(id)}, {"x$set": request.json})
    responde = jsonify({"message": "user" + id + "was updated successsfully"})
    return responde


@app.errorhandler(404)
def not_Found(error=None):
    message = jsonify({
        "message" : "resource not found" + request.url,
        "status": 404
    })



if __name__ =="__main__":  
    app.run(debug = True, port=5000)  
