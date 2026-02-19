from flask import Blueprint, request, jsonify
from database import db
from models import db, Donor
from auth import token_required
from helpers import log_activity, send_sms

donor_bp = Blueprint('donor', __name__)

@donor_bp.route('/donor', methods=['GET'])
def get_donors():
    donors = Donor.query.all()
    output = []
    for d in donors:
        output.append({
            'id': d.id,
            'name': d.name,
            'email': d.email,
            'phone': d.phone,
            'donation_amount': d.donation_amount
        })
    return jsonify(output)

@donor_bp.route('/donor', methods=['POST'])
@token_required
def add_donor(current_user):
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and Email required'}), 400
        
    new_donor = Donor(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address'),
        donation_amount=data.get('donation_amount', 0.0)
    )
    
    try:
        db.session.add(new_donor)
        db.session.commit()

        # Log & SMS
        log_activity(current_user.id, "ADD_DONOR", f"Added Donor: {data['name']}, Amount: {data['donation_amount']}")
        send_sms(data.get('phone'), f"Thank you {data['name']} for your donation of ${data['donation_amount']}!")

        return jsonify({'message': 'Donor added successfully', 'id': new_donor.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
