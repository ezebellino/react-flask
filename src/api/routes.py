"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Healthcheck endpoint
@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# User Registration
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    pwd = data.get('password')
    if not email or not pwd:
        return jsonify({"msg": "Email and password are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409
    hashed = generate_password_hash(pwd)
    user = User(email=email, password=hashed, is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201

# User Login
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    pwd = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, pwd):
        return jsonify({"msg": "Invalid credentials"}), 401
    # Ensure identity is a string to satisfy JWT spec
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token}), 200

# Tasks CRUD
@api.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def handle_tasks():
    # Convert identity back to int
    user_id = int(get_jwt_identity())
    if request.method == 'GET':
        tasks = Task.query.filter_by(user_id=user_id).all()
        return jsonify([t.serialize() for t in tasks]), 200
    # POST: create new task
    data = request.get_json() or {}
    label = data.get('label')
    if not label:
        return jsonify({"msg": "Field 'label' is required"}), 400
    task = Task(label=label, user_id=user_id)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.serialize()), 201

@api.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def modify_task(task_id):
    # Convert identity back to int
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"msg": "Task not found"}), 404
    if request.method == 'PUT':
        data = request.get_json() or {}
        task.label = data.get('label', task.label)
        task.completed = data.get('completed', task.completed)
        db.session.commit()
        return jsonify(task.serialize()), 200
    # DELETE
    db.session.delete(task)
    db.session.commit()
    return jsonify({"msg": "Task deleted"}), 200
