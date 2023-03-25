from functools import wraps
from flask import jsonify, request
import jwt
from settings import config

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace("Bearer ","")
        
        if not token:
            return jsonify({'message' : 'No token valid was sent'})
        try:
            data = jwt.decode(token, config.SECRET, algorithms=["HS256"])
            isOrganizer = False
            if data['Role'] == "Organizer":
                isOrganizer = True
            
            IdSQL = data['Id']
            claims = {
                "IdAuth" : IdSQL,
                "isMusician" : isOrganizer
            }
        except:
            response = jsonify({'message':'Token is invalid'})
            response.status_code = 401
            return response
        
        return f(claims, *args,**kwargs)
    return decorator