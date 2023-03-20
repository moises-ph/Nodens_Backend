from functools import wraps
from flask import jsonify, request
import jwt

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'x-acces-token' in request.headers:
            token = request.headers['x-acces-token']

        if not token:
            return jsonify({'message' : 'No token valid was sent'})
        try:
            data = jwt.decode(token, '||NODENS-Authorized||')
            IdSQL = data['Id']
        except:
            return jsonify({'message':'Token is invalid'})
        
        return f(IdSQL, *args,**kwargs)
    return decorator