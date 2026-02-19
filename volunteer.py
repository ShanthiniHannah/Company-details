from flask import Blueprint, request, jsonify
from database import db
from models import db, Volunteer, Beneficiary
from auth import token_required
from helpers import log_activity, send_sms

volunteer_bp = Blueprint('volunteer', __name__)

# --- VOLUNTEER ENDPOINTS ---
@volunteer_bp.route('/volunteer', methods=['GET'])
def get_volunteers():
    volunteers = Volunteer.query.all()
    output = []
    for v in volunteers:
        output.append({
            'id': v.id,
            'name': v.name,
            'email': v.email,
            'skills': v.skills
        })
    return jsonify(output)

@volunteer_bp.route('/volunteer', methods=['POST'])
@token_required
def add_volunteer(current_user):
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and Email required'}), 400
        
    new_vol = Volunteer(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        skills=data.get('skills'),
        availability=data.get('availability')
    )
    
    try:
        db.session.add(new_vol)
        db.session.commit()
        log_activity(current_user.id, "ADD_VOLUNTEER", f"Added Volunteer: {data['name']}")
        return jsonify({'message': 'Volunteer added successfully', 'id': new_vol.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# --- BENEFICIARY ENDPOINTS ---
@volunteer_bp.route('/beneficiary', methods=['GET'])
def get_beneficiaries():
    bens = Beneficiary.query.all()
    output = []
    for b in bens:
        output.append({
            'id': b.id,
            'name': b.name,
            'status': b.status,
            'needs': b.needs,
            'assigned_volunteer_id': b.assigned_volunteer_id
        })
    return jsonify(output)

@volunteer_bp.route('/beneficiary', methods=['POST'])
@token_required
def add_beneficiary(current_user):
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'Name required'}), 400
        
    new_ben = Beneficiary(
        name=data.get('name'),
        age=data.get('age'),
        gender=data.get('gender'),
        needs=data.get('needs'),
        status=data.get('status', 'Pending'),
        assigned_volunteer_id=data.get('assigned_volunteer_id')
    )
    
    try:
        db.session.add(new_ben)
        db.session.commit()
        log_activity(current_user.id, "ADD_BENEFICIARY", f"Added Beneficiary: {data['name']}")
        return jsonify({'message': 'Beneficiary added successfully', 'id': new_ben.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
