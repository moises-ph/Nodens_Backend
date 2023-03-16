from flask import jsonify, request
from Database import db as Database

def getMusician(email):
    db = Database.dbConnection()
    musicians = list(db.Musicians.find_one({"correo" : email}))
    return jsonify({musicians})

