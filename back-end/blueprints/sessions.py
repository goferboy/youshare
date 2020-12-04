import models;

from flask import Blueprint, jsonify, request;

from playhouse.shortcuts import model_to_dict;

session = Blueprint('sessions', 'session');

@session.route('/', methods=['GET'])
def get_all_sessions():
    try:
        sessions = [model_to_dict(session) for session in models.Session.select()];
        print(sessions);
        return jsonify(data=sessions, status={"code": 200, "message": "Retrived Sessions"});
    except models.DoesNotExist:
        return jsonify(data={}, status={"code": 401, "message": "Error"});

@session.route('/', methods=['POST'])
def create_sessions():
    payload = request.get_json();
    print(type(payload), 'payload');
    session = models.Session.create(**payload);
    sess_to_dict = model_to_dict(session);
    return jsonify(data=sess_to_dict, status={"code": 201, "message": "Session Created"});
