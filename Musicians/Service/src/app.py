#reunir el codigo y iniciar el svr

from controllers import musiciansController
from flask import Flask, redirect, url_for

app = Flask(__name__)

app.add_url_rule('/<email>',"index", musiciansController.getMusician, methods=["GET"])

@app.route('/musician')
def musician():
    return redirect(url_for('index'))

@app.route('/musician/<option>')
def musicians(option):
    print(option)
    match option:
        case "index":
            print(url_for('index'))
            return redirect(url_for('index'))


if __name__ =="__main__":  
    app.run(debug = True)  
