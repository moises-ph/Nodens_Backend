from functools import wraps
from flask import jsonify, request
import jwt

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace("Bearer ","")
        
        if not token:
            return jsonify({'message' : 'No token valid was sent'})
        try:
            data = jwt.decode(token, "||NODENS-Authorized||", algorithms=["HS256"])
            IdSQL = data['Id']
        except:
            response = jsonify({'message':'Token is invalid'})
            response.status_code = 401
            return response
        
        return f(IdSQL, *args,**kwargs)
    return decorator