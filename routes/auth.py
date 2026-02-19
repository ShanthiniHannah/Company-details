from flask import Blueprint, request, jsonify, current_app
from database import db
from models import User, Role
from werkzeug.security import check_password_hash
import jwt
import datetime
import functools

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            else:
                token = auth_header
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, current_app.secret_key, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'role': user.role.name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.secret_key, algorithm="HS256")
        
        return jsonify({
            'message': 'Logged in successfully',
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role.name
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/check-auth', methods=['GET'])
@token_required
def check_auth(current_user):
    return jsonify({
        'authenticated': True,
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'role': current_user.role.name
        }
    })
