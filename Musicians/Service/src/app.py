#reunir el codigo y iniciar el svr

from controllers import musiciansController
from flask import Flask, redirect, url_for

app = Flask(__name__)

app.add_url_rule('/<email>',"index", musiciansController.getInfomusician, methods=["GET"])

@app.route('/musician', methods=["GET"])
def musician():
    return redirect(url_for('index'))

@app.route('/', methods=["GET"])
def holi():
    return musiciansController.getInfomusician()

"""
@app.route('/musician/<option>')
def musicians(option):
    print(option)
    match option:
        case "index":
            print(url_for('index'))
            return redirect(url_for('index'))        
"""




if __name__ =="__main__":  
    app.run(debug = True, port=5000)  
