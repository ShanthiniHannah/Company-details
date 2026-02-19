from flask import Blueprint, request, jsonify
from database import db
from models import db, Employee, User
from auth import token_required
from helpers import log_activity, send_sms

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/employee', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    output = []
    for emp in employees:
        hr_name = 'Unassigned'
        if emp.hr_id:
            hr_user = User.query.get(emp.hr_id)
            if hr_user:
                hr_name = hr_user.name
                
        output.append({
            'id': emp.id,
            'name': emp.name,
            'age': emp.age,
            'gender': emp.gender,
            'address': emp.address,
            'hr_id': emp.hr_id,
            'hr_name': hr_name,
            'sponsor': emp.sponsor
        })
    return jsonify(output)

@employee_bp.route('/employee', methods=['POST'])
@token_required
def add_employee(current_user):
    data = request.get_json()
    name = data.get('name')
    
    if not name:
        return jsonify({'error': 'Name is required'}), 400
        
    email = data.get('email', f"{name.lower().replace(' ', '.')}@example.com") # Temp placeholder email generation

    # Create User account for Employee
    from werkzeug.security import generate_password_hash
    from models import Role, User

    try:
        # Check for existing user email
        if User.query.filter_by(email=email).first():
             return jsonify({'error': 'Email already connected to an account'}), 400

        employee_role = Role.query.filter_by(name='Employee').first()
        if not employee_role:
             return jsonify({'error': 'Employee Role not found'}), 500

        # Create User
        new_user = User(
            name=name,
            email=email,
            password=generate_password_hash('123456'), # Default Password
            role_id=employee_role.id
        )
        db.session.add(new_user)
        db.session.flush() # Get ID

        new_emp = Employee(
            name=name,
            email=email,
            age=data.get('age'),
            gender=data.get('gender'),
            address=data.get('address'),
            hr_id=data.get('hr_id'),
            sponsor=data.get('sponsor'),
            # We could link the User ID to the Employee record if needed, 
            # but current model doesn't strictly enforce it via ForeignKey in expected direction.
            # Assuming Employee model might be updated or we rely on email matching.
        )
        
        db.session.add(new_emp)
        db.session.commit()

        # Log & SMS
        log_activity(current_user.id, "ADD_EMPLOYEE", f"Added Employee & User: {data['name']}")
        send_sms("123-456-7890", f"Welcome {data['name']}! Login with {email} / 123456")

        return jsonify({'message': 'Employee and User account created successfully', 'id': new_emp.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@employee_bp.route('/employee/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    emp = Employee.query.get(id)
    
    if not emp:
        return jsonify({'message': 'Employee not found'}), 404

    if 'name' in data: emp.name = data['name']
    if 'age' in data: emp.age = data['age']
    if 'gender' in data: emp.gender = data['gender']
    if 'address' in data: emp.address = data['address']
    if 'hr_id' in data: emp.hr_id = data['hr_id']
    if 'sponsor' in data: emp.sponsor = data['sponsor']
    
    try:
        db.session.commit()
        return jsonify({'message': 'Employee updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@employee_bp.route('/employee/<int:id>', methods=['DELETE'])
def delete_employee(id):
    emp = Employee.query.get(id)
    if not emp:
        return jsonify({'message': 'Employee not found'}), 404
        
    try:
        db.session.delete(emp)
        db.session.commit()
        return jsonify({'message': 'Employee deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
