#reunir el codigo y iniciar el svr
from controllers import musiciansController
from flask import Flask, redirect, request, url_for
from flask_optional_routes import OptionalRoutes

from utils.tokenValidator import token_required

app = Flask(__name__)

optional = OptionalRoutes(app)

# ### HOME ###
# app.add_url_rule("/","home1", musiciansController.home, methods=["GET"])
# ### GETALL ###
# app.add_url_rule("/musician","getAll", musiciansController.getAllmusician, methods=["GET"])
# ### POST ###
# app.add_url_rule("/musician","postMusician", musiciansController.postInfomusician, methods=["POST"])
# ### GETONLY ###
# app.add_url_rule("/musician/<id>","onlyInfo", musiciansController.getMusician, methods=["GET"])
# ### DELETE ###
# app.add_url_rule('/musician/<id>',"deleteMusician", musiciansController.deleteMusician, methods=["DELETE"])
# ### PUT ###
# app.add_url_rule('/musician/<id>',"updateMusician", musiciansController.putMusician, methods=["PUT"])
# #

# ### HOME ###
# @app.route("/", methods=["GET"])
# def viewHome():
#     return redirect(url_for("home1"))

# ### GETALL ###
# @app.route("/musician", methods=["GET"])
# def musicianGetAll():
#     return redirect(url_for("getAll"))

# ### GETONLY ###
# @app.route("/musician/<id>", methods=["GET"])
# def musicianGet():
#     return redirect(url_for("onlyInfo"))

# ### POST ###
# @app.route("/musician", methods=["POST"])
# def musicianPost():
#     return redirect(url_for("postMusician"))

# ### DELETE ###
# @app.route("/musician", methods=["DELETE"])
# def musicianDelete():
#     return redirect(url_for("deleteMusician"))

# ### PUT ###
# @app.route("/musician/<id>", methods=["PUT"])
# def musicianPut():
#     return redirect(url_for("updateMusician"))


### Rutas Optimizadas ###

@optional.routes('/musician/<id>?', methods=["POST","GET","DELETE","PUT"])
@token_required
def musicians(id):
    print(id)
    match request.method:      
        case "PUT":
            return musiciansController.putMusician(id=id)
        case "GET":
            return musiciansController.getMusician(id=id)
        case "DELETE":
            return musiciansController.deleteMusician(id=id)
        case "POST":
            return musiciansController.postInfomusician(id=id)


if __name__ =="__main__":  
    app.run(debug = True, port=5000)  
