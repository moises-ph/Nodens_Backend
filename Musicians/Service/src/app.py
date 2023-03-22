#reunir el codigo y iniciar el svr
from collections import namedtuple
from flask import Flask, request, jsonify, Response
from flask_optional_routes import OptionalRoutes
from Database import db as Database
from bson import json_util
from bson.objectid import  ObjectId
from validations import MusicianInfo
from werkzeug.datastructures import MultiDict

from utils.tokenValidator import token_required

app = Flask(__name__)
app.secret_key = "dfdgdfgfgf"
optional = OptionalRoutes(app)

### GETALL ###
@app.route("/musician", methods=["GET"])
@token_required
def getAllmusician ():
    db = Database.dbConnection()
    users = list(db.Musicians.find())
    response = json_util.dumps(users)
    return response #Response(response, mimetype="application/json")

### GETONLY ###
@app.route("/musician/si", methods=["GET"])
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

    request.json['IdAuth'] = int(id)

    # print(request.get_json())
    
    data = []

    for key in request.json:
        temp = []
        if type(request.json[key]) == list:
            listNamed = None
            if key == "instrumentos":
                listNamed = namedtuple('instrumentos',['nombre','nivel'])
            elif key == "educacion":
                listNamed = namedtuple('educacion',['nombre','Institucion','fecha_inicio','fecha_fin'])
            elif key == "redes_sociales":
                listNamed = namedtuple('redes_sociales',['nombre','url'])
            list2 = request.json[key]
            for element in range(len(list2)):
                temp2 = []
                for key2 in list2[element]:
                    temp2.append((key2, list2[element][key2]))
                temp.append(temp2)
        if len(temp) > 0:
            data.append((key,temp))
        else:
            data.append((key, request.json[key]))
    
    print(data)

    ReqForm = MultiDict(data)

    print(ReqForm)

    form = MusicianInfo.musicianInstrument(ReqForm)
    if not form.validate():
        response = jsonify({"message" : "No Valid form"})
        response.status_code = 428
        return response
        # return response

    #se mandan los datos

    print(id)

    db = Database.dbConnection()

    id = db.Musicians.insert_one(
        request.json
    )
    response = {
        "id": str(id.inserted_id),
    }
    response = jsonify({"message" : "Información del músico creada correctamente"})
    response.status_code = 200
    return response


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
