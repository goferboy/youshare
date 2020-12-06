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

connected_users = 0;

@socketio.on('connection')
def on_connection(json):
    global connected_users;
    connected_users += 1;
    print('received json: ' + str(json));
    print('Connected Users: ' + str(connected_users));
    return json;

@socketio.on('disconnect')
def on_disconnection():
    global connected_users;
    connected_users -= 1;
    print('Connected Users: ' + str(connected_users));

@socketio.on('playlist')
def on_playlist(json):
    emit('playlist', json, broadcast=True)


# @socketio.on('join')
# def on_join(data):
#     username = data['username']
#     room = data['room']
#     join_room(room);
#     print(data);
#     emit('join', username + ' has entered the room.', room=room)

# @socketio.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room);
#     print(data);
#     send(username + ' has left the room.', room=room)

if __name__ == '__main__':
    models.initialize();
    socketio.run(app, debug=DEBUG, port=PORT);
