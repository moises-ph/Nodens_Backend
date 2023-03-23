#reunir el codigo y iniciar el svr
from collections import namedtuple
from flask import Flask, request, jsonify, Response
from flask_optional_routes import OptionalRoutes
from marshmallow import ValidationError
from Database import db as Database
from bson import json_util
from bson.objectid import  ObjectId
from validations import MusicianInfo
from werkzeug.datastructures import MultiDict
from flask_marshmallow import Marshmallow

from utils.tokenValidator import token_required

app = Flask(__name__)
app.secret_key = "dfdgdfgfgf"
optional = OptionalRoutes(app)

ma = Marshmallow(app)

### GETALL ###
@app.route("/musician", methods=["GET"])
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
    try:
        # Comprueba si el músico existe en la base de datos
        db = Database.dbConnection()
        exists = db.Musicians.find_one({'IdAuth' : int(id)}) # el argumento id está dentro del token y viene del validador del token
        if exists: # Si existe no se guardará la información
            response = jsonify({"message" : "El músico existe actualmente"})
            response.status_code = 400
            return response
        
        # Valida que los datos del request estén dentro del schema de validación
        # Si los datos del request no pasan la validación se llamará a la excepcion "ValidationError" y 
        # se dirá en la respuesta el campo que no pasó la validación */
        request.json['IdAuth'] = int(id)
        form = MusicianInfo.MusicianSchemaCreate().load(request.json)

        # Los bucles for son para validar los campos que son arreglos de otro tipo de schema dentro del form ya validado.
        # Cada campo se recorre y cada elemento dentro de esa lista se valida con los métodos correspondientes al campo
        instruments = []
        for instrument in form['instrumentos']:
            instruments.append(MusicianInfo.InstrumentsField().load(instrument))
        educacion = []
        for educ in form['educacion']:
            educacion.append(MusicianInfo.EducacionField().load(educ))
        redes_sociales = []
        for social in form['redes_sociales']:
            redes_sociales.append(MusicianInfo.RedesSocialesField().load(social))
        
        #En este punto los datos pasan la validación, se procede a guardar la información del músico en la base de datos
        result = db.Musicians.insert_one(request.json)
        response = jsonify({"message" : "Información del músico creada correctamente"})
        response.status_code = 200
        return response
    except ValidationError as err:
        print(err.messages)
        response = jsonify(err.messages)
        response.status_code = 418
        return response


### DELETE ###
@app.route("/musician", methods=["DELETE"])
@token_required
def deleteMusician(id):
    db = Database.dbConnection()
    db.Musicians.delete_one({'IdAuth' : int(id)})
    response = jsonify({"message": "user deleted successfully"})
    return response


### PUT ###
@app.route("/musician", methods=["PUT"])
@token_required
def putMusician (id):
    
    try:
        #Aquí se validan los datos como en el POST
        request.json['IdAuth'] = int(id)
        form = MusicianInfo.MusicianSchemaUpdate().load(request.json)

        # La diferencia aquí es que como se actualizan los datos no hay necesidad de que el cliente envíe información
        # que no ha sido actualizada, por ende se valida el form con un esquema que tenga todos los campos opcionales,
        # algún campo que esté debe cumplir con la validación y los campos que no estén en el esquema no se aceptan.

        # Se debe comprobar que los campos que son listas existan dentro del request
        if 'instrumentos' in form:
            instruments = []
            for instrument in form['instrumentos']:
                instruments.append(MusicianInfo.InstrumentsField().load(instrument))
        
        if 'educacion' in form:
            educacion = []
            for educ in form['educacion']:
                educacion.append(MusicianInfo.EducacionField().load(educ))
        
        if 'redes_sociales' in form:
            redes_sociales = []
            for social in form['redes_sociales']:
                redes_sociales.append(MusicianInfo.RedesSocialesField().load(social))
        
        #Se actualizan los datos
        db = Database.dbConnection()
        result = db.Musicians.update_one({'IdAuth' : int(id)}, { "$set" : request.json})
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
    message = jsonify({
        "message" : "resource not found" + request.url,
        "status": 404
    })



if __name__ =="__main__":  
    app.run(debug = True, port=5000)  
