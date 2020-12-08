from flask import Flask, jsonify, g
from flask.globals import request;
from flask_cors import CORS;
from playhouse.shortcuts import model_to_dict;
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms;
from pprint import pprint;

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

all_rooms = [];

@socketio.on('connection')
def on_connection(json):
    global all_rooms;
    join_room(json['room']);
    user_dict = {
        "username": str(json['username']),
        "sessionID": request.sid
    };
    if (len(all_rooms) == 0):
        new_room = {
                "room_name": str(json['room']),
                "connected_users": [user_dict]
        }
        all_rooms.append(new_room);  
    else:
        for i in range(0, len(all_rooms)):
            if all_rooms[i].get('room_name') == str(json['room']):
                all_rooms[i]['connected_users'].append(user_dict);
                break;
            elif (i == len(all_rooms) - 1):
                new_room = {
                    "room_name": str(json['room']),
                    "connected_users": [user_dict]
                }
                all_rooms.append(new_room);
    pprint(all_rooms)
    pprint('**** User ' + str(json['username']) + " (sid: " + str(request.sid) + ") connected to room " + str(json['room']));
    return request.sid;

@socketio.on('disconnect')
def on_disconnect():
    global all_rooms;
    for room in all_rooms:
        for i in range(0, len(room['connected_users'])):
            if room['connected_users'][i].get('sessionID') == request.sid:
                del room['connected_users'][i];
                break;
    pprint(all_rooms);
    pprint(str(request.sid) + ' has disconnected');

@socketio.on('playlist')
def on_playlist(json):
    pprint(json);
    room = json['room'];
    print("its a hit for the playlist listener");
    emit('playlist', json, room=room)

@socketio.on('player-state')
def on_player_state(json):
    pprint(json);
    room = json['room'];
    print("its a hit for the player listener");
    print(json);
    emit('player-state', json, room=room)

if __name__ == '__main__':
    models.initialize();
    socketio.run(app, debug=DEBUG, port=PORT);
