from flask import Flask, jsonify, g;
from flask_cors import CORS;
from playhouse.shortcuts import model_to_dict;
from flask_socketio import SocketIO, send, emit, join_room, leave_room;

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

CORS(app, origins=['http://localhost:3000']);

app.register_blueprint(session, url_prefix="/api/sessions");

@app.before_request
def before_request():
    g.db = models.DATABASE;
    g.db.connect();

@app.after_request
def after_request(response):
    g.db.close();
    return response;

# SOCKET ROUTES

@socketio.on('connection')
def on_connection(json):
    join_room(json['room']);
    print('User ' + str(json['username']) + " connected to room " + str(json['room']));
    return json;

@socketio.on('playlist')
def on_playlist(json):
    print("its a hit for the playlist listener");
    emit('playlist', json, broadcast=True)

@socketio.on('player-state')
def on_player_state(json):
    print("its a hit for the player listener");
    print(json);
    emit('player-state', json, broadcast=True)

if __name__ == '__main__':
    models.initialize();
    socketio.run(app, debug=DEBUG, port=PORT);
