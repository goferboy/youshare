from flask import Flask, jsonify, g;
from flask_cors import CORS;
from playhouse.shortcuts import model_to_dict;
from flask_socketio import SocketIO, send, emit, join_room;

import models;
from blueprints.sessions import session;

DEBUG = True;

from dotenv import load_dotenv;
load_dotenv();

import os;
PORT = os.getenv("PORT");
SECRET = os.getenv("SECRET");
ROOMS = {};

app = Flask(__name__);
app.config['SECRET_KEY'] = SECRET;
socketio = SocketIO(app, cors_allowed_origins="*");

CORS(app, origins=['http://localhost:3000'], supports_credentials=True);

app.register_blueprint(session, url_prefix="/api/sessions");

@app.before_request
def before_request():
    g.db = models.DATABASE;
    g.db.connect();

@app.after_request
def after_request(response):
    g.db.close();
    return response;

@socketio.on('connection')
def handle_my_custom_event(json):
    print('received json: ' + str(json));
    emit('connection', json);

# @socketio.on('itsme')
# def send_back():
#     print("sending something back now");
    


if __name__ == '__main__':
    models.initialize();
    socketio.run(app, debug=DEBUG, port=PORT);
