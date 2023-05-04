#reunir el codigo y iniciar el svr
from collections import namedtuple
from flask import Flask, request, jsonify, Response
from flask_optional_routes import OptionalRoutes
from marshmallow import ValidationError
from .Database import db as Database
from bson import json_util
from bson.objectid import  ObjectId
from .validations import Organizersinfo
from werkzeug.datastructures import MultiDict
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import HTTPException

from .utils.tokenValidator import token_required

import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config(
    cloud_name = "dx9vdom9p", 
    api_key = "662389528726413", 
    api_secret = "07cFuSTkdH3ZTUZ4Fw7M-bj-OKQ",
    secure = True
)

app = Flask(__name__)
app.secret_key = "dfdgdfgfgf"
optional = OptionalRoutes(app)

ma = Marshmallow(app)

CORS(app, origins="*", methods=["POST","PUT","GET","DELETE"])

# Route para el perfil
@cross_origin
@app.route('/Organizer/profile', methods=["POST"])
@token_required
def uploadProfile(claims):
    try:
        id = claims['IdAuth']
        if not claims['isOrganizer']:
            response = jsonify({"message" : "Rol no autorizado para esta función"})
            response.status_code = 400
            return response
        
        if not request.headers['Content-Type'].startswith("multipart/form-data"):
            response = jsonify({"message" : "No valid MIME Type for content"})
            response.status_code = 400
            return response
        
        files = request.files.lists()
        img = None
        for element in files:
            img = element[1][0]
        

        if not img.mimetype.startswith("image") :
            response = jsonify({"message" : "Extensión de archivo no válida"})
            response.status_code = 400
            return response
        
        uploadResult = cloudinary.uploader.upload_image(img.stream, public_id="profileOrg"+id, unique_filename=True)
        db = Database.dbConnection()
        db.Musicians.update_one({"IdAuth": int(id)}, {"$set" : { "url_foto_perfil" : uploadResult.url }})

        response = jsonify({"message" : "Foto de perfil actualizada correctamente"})
        response.status_code = 200
        return response

    except Exception as err:
        return jsonify(err)
    
### GETALL ###
@cross_origin
@app.route("/Organizer/all", methods=["GET"])
def getAllmusician ():
    db = Database.dbConnection()
    users = list(db.Organizers.find())
    response = json_util.dumps(users)
    return response #Response(response, mimetype="application/json")

### GETLOGIN ##
@cross_origin
@app.route("/Organizer", methods=["GET"])
@token_required
def getlogin (claims):
    if not claims["isOrganizer"]:
        response = jsonify({"message" : "Rol no autorizado para esta función"})
        response.status_code = 400
        return response
        
    db = Database.dbConnection()
    id = claims["IdAuth"]
    user = db.Organizers.find_one({'IdAuth' : int(id)})
    response = json_util.dumps(user)
    return response


### GETONLY ###
@cross_origin
@app.route("/Organizer/<id>", methods=["GET"])
def getMusician(id):
    db = Database.dbConnection()
    user = db.Organizers.find_one({"_id" : ObjectId(id)})
    response = json_util.dumps(user)
    return response
    

### POST ###
@cross_origin
@app.route("/Organizer", methods=["POST"])
@token_required
def postInfomusician(claims):
    try:
        if not claims["isOrganizer"]:
            response = jsonify({"message" : "Rol no autorizado para esta función"})
            response.status_code = 400
            return response

        id = claims["IdAuth"]
        # Comprueba si el Organizador existe en la base de datos
        db = Database.dbConnection()
        exists = db.Organizers.find_one({'IdAuth' : int(id)}) # el argumento id está dentro del token y viene del validador del token
        if exists: # Si existe no se guardará la información
            response = jsonify({"message" : "El Organizador existe actualmente"})
            response.status_code = 400
            return response
        
        # Valida que los datos del request estén dentro del schema de validación
        # Si los datos del request no pasan la validación se llamará a la excepcion "ValidationError" y 
        # se dirá en la respuesta el campo que no pasó la validación */
        request.json['IdAuth'] = int(id)
        form = Organizersinfo.OrganizerSchemaCreate().load(request.json)

        # Los bucles for son para validar los campos que son arreglos de otro tipo de schema dentro del form ya validado.
        # Cada campo se recorre y cada elemento dentro de esa lista se valida con los métodos correspondientes al campo
        redes_sociales = []
        for social in form['redes_sociales']:
            redes_sociales.append(Organizersinfo.RedesSocialesField().load(social))
        
        #En este punto los datos pasan la validación, se procede a guardar la información del organizador en la base de datos
        result = db.Organizers.insert_one(request.json)
        response = jsonify({"message" : "Información del Organizador creada correctamente"})
        response.status_code = 200
        return response
    except ValidationError as err:
        print(err.messages)
        response = jsonify(err.messages)
        response.status_code = 418
        return response


### DELETE ###
@cross_origin
@app.route("/Organizer", methods=["DELETE"])
@token_required
def deleteMusician(claims):
    if not claims["isOrganizer"]:
            response = jsonify({"message" : "Rol no autorizado para esta función"})
            response.status_code = 400
            return response
        
    id = claims["IdAuth"]
    db = Database.dbConnection()
    db.Organizers.delete_one({'IdAuth' : int(id)})
    response = jsonify({"message": "user deleted successfully"})
    return response


### PUT ###
@cross_origin
@app.route("/Organizer", methods=["PUT"])
@token_required
def putMusician (claims):
    try:
        if not claims["isOrganizer"]:
            response = jsonify({"message" : "Rol no autorizado para esta función"})
            response.status_code = 400
            return response
        
        id = claims["IdAuth"]
        #Aquí se validan los datos como en el POST
        request.json['IdAuth'] = int(id)
        form = Organizersinfo.OrganizerSchemaUpdate().load(request.json)

        # La diferencia aquí es que como se actualizan los datos no hay necesidad de que el cliente envíe información
        # que no ha sido actualizada, por ende se valida el form con un esquema que tenga todos los campos opcionales,
        # algún campo que esté debe cumplir con la validación y los campos que no estén en el esquema no se aceptan.

        # Se debe comprobar que los campos que son listas existan dentro del request
        
        if 'redes_sociales' in form:
            redes_sociales = []
            for social in form['redes_sociales']:
                redes_sociales.append(Organizersinfo.RedesSocialesField().load(social))
        
        #Se actualizan los datos
        db = Database.dbConnection()
        result = db.Organizers.update_one({'IdAuth' : int(id)}, { "$set" : request.json})
        response = jsonify({"message" : "Información del músico actualizada correctamente", "modified_count" : result.modified_count})
        response.status_code = 200
        return response
    except ValidationError as err:
        print(err.messages)
        response = jsonify(err.messages)
        response.status_code = 418
        return response


@app.errorhandler(404)
def not_Found(error=None):
    message = {"message" : "resource not found" + request.url}
    response = jsonify(message)
    return response, 404

@app.errorhandler(Exception)
def handle_exception(e):
    error = { "error" : {"Message": "{}, status 400 Bad request".format(e)}}
    return jsonify(error), 500


if __name__ =="__main__":  
    app.run(host="0.0.0.0",debug = True, port=5000)
