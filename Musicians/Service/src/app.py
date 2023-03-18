#reunir el codigo y iniciar el svr
from controllers import musiciansController
from flask import Flask, redirect, url_for
from flask_optional_routes import OptionalRoutes

app = Flask(__name__)

optional = OptionalRoutes(app)

### GET ###
app.add_url_rule('/one/<id>',"onlyinfo", musiciansController.getMusician, methods=["GET"])
### POST ###
app.add_url_rule('/new',"postMusician", musiciansController.postInfomusician, methods=["POST"])
### DELETE ###
app.add_url_rule('/drop/<id>',"deleteMusician", musiciansController.deleteMusician, methods=["DELETE"])
### PUT ###
app.add_url_rule('/update/<id>',"updateMusician", musiciansController.putMusician, methods=["PUT"])
#

### GET ###
"""
@app.route('/', methods=["GET"])
def home():
    return musiciansController.home()
#
@app.route("/musician", methods=["GET"])
def getmusicians():
    return musiciansController.getInfomusician()
### POST ###
@app.route("/musician", methods=["POST"])
def addMusician():
    return musiciansController.postInfomusician()

"""


@optional.routes('/musician/<option>/<id>?', methods=["POST","GET","DELETE","PUT"])
def musicians(option):
    print(option)
    print(id)
    match option:      
        case "update":
            return redirect(url_for("updateMusician",id=id))
        case "one":
            return redirect(url_for('onlyinfo',id=id))
        case "drop":
            return redirect(url_for('deleteMusician',id=id))
        case "new":
            return redirect(url_for('postMusician',_method="POST"))





if __name__ =="__main__":  
    app.run(debug = True, port=5000)  
