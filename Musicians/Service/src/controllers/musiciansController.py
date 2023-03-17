from flask import jsonify, request, url_for,redirect,Response
from Database import db as Database
from bson import json_util
from validations.MusicianInfo import musicianinfo as infoMusician

### ========> Solucionar errores <======== ###
# Solcionar objectid
# Terminar GET
# iniciar hacer delete y put
# linea 40



# Musician
def getMusician(email):
    db = Database.dbConnection()
    musicians = list(db.Musicians.find_one({"correo" : email}))
    return jsonify({musicians})

def home():
    return jsonify({"Message":"pong"})
### GET ###
def getInfomusician ():
    db = Database.dbConnection()
    users = list(db.users.find())
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


### POST ###
def postInfomusician():
    # recive datos
    username = request.json["username"]
    years = request.json["years"]
    email = request.json["email"]
    #se mandan los datos
    if username and email and years:
        db = Database.dbConnection()

        id = db.users.insert_one(
            {"username": username,"email": email,"years": years}
        )
        response = {
            "id": str(id),
            "username": username,
            "years": years,
            "email": email
        }
        return response
    else:
        return not_Found()
    
"""
### method put ###
def edit(product_name):
    products = db["products"]
    name = request.form["name"]
    price = request.form["price"]
    quantity = request.form["quantity"]
    
    if name and price and quantity:
        products.update_one({"name" : product_name}, {"$set" : {"name" : name, "price" : price, "quantity" : quantity}})
        response = jsonify({"message" : "Producto" + product_name + "actualizado correctamente"})
        return redirect(url_for("home"))
    else:
        return not_Found()

"""
"""
def postInfomusician():
    MusicianInfos = Database["MusicianInfos"]
    name = request.form["name"]
    email = request.form["email"]
    years = request.form["years"]

    if name and email and years:
        MusicianInfo = infoMusician(name,email,years)
        MusicianInfos.insert_one(MusicianInfo.toDBCollection())
        response = jsonify ({
            "name": name,
            "email": email,
            "years": years
        })
        return redirect(url_for("home"))  #response
    else:
        return not_Found()
    
"""    



# ERRORES
def not_Found(error=None):
    message = jsonify({
        "message" : "resource not found" + request.url,
        "status": 404
    })


# 400 cuando se hace una mala peti
# 