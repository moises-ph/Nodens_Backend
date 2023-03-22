from functools import wraps
from flask import jsonify, request
import jwt

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'token' in request.headers:
            token = request.headers['token']
            print(token)
        
        if not token:
            return jsonify({'message' : 'No token valid was sent'})
        try:
            data = jwt.decode(token, "||NODENS-Authorized||", algorithms=["HS256"])
            print(data)
            IdSQL = data['Id']
        except:
            return jsonify({'message':'Token is invalid'})
        
        return f(IdSQL, *args,**kwargs)
    return decorator