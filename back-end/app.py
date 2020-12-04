from flask import Flask, jsonify, g;
from flask_cors import CORS;
from playhouse.shortcuts import model_to_dict;

import models;
from blueprints.sessions import session;

DEBUG = True;
PORT = 8000;

app = Flask(__name__);

CORS(session, origins=['http://localhost:3000'], supports_credentials=True);

app.register_blueprint(session, url_prefix="/api/sessions");

@app.before_request
def before_request():
    g.db = models.DATABASE;
    g.db.connect();

@app.after_request
def after_request(response):
    g.db.close();
    return response;

if __name__ == '__main__':
    models.initialize();
    app.run(debug=DEBUG, port=PORT);
