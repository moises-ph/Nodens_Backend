from functools import wraps
from flask import jsonify, request
import jwt
import config

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
            isMusician = False
            if data['role'] == "Musician":
                isMusician = True
            
            IdSQL = data['Id']
            claims = {
                "IdAuth" : IdSQL,
                "isMusician" : isMusician
            }
        except:
            response = jsonify({'message':'Token is invalid'})
            response.status_code = 401
            return response
        
        return f(claims, *args,**kwargs)
    return decorator