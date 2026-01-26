from flask import Blueprint, request, jsonify
from database import get_db_connection
from flasgger import swag_from
from werkzeug.security import generate_password_hash
from auth import login_required

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/hr', methods=['GET'])
def get_hrs():
    """
    Get all HR details
    ---
    responses:
      200:
        description: List of HRs
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              email:
                type: string
              department:
                type: string
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM hr")
    hrs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(hrs)

@hr_bp.route('/hr', methods=['POST'])
def add_hr():
    """
    Add a new HR
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
          properties:
            name:
              type: string
            email:
              type: string
            department:
              type: string
    responses:
      201:
        description: HR created
      400:
        description: Error
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    department = data.get('department')
    password = data.get('password', '123') # Default for now if not provided
    hashed_password = generate_password_hash(password)

    if not name or not email:
        return jsonify({'error': 'Name and Email are required'}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO hr (name, email, department, password) VALUES (%s, %s, %s, %s)", (name, email, department, hashed_password))
        conn.commit()
        return jsonify({'message': 'HR added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@hr_bp.route('/hr/<int:id>', methods=['PUT'])

def update_hr(id):
    """
    Update an HR
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            department:
              type: string
    responses:
      200:
        description: HR updated
      404:
        description: HR not found
    """
    data = request.get_json()
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    
    # Check if HR exists
    cursor.execute("SELECT * FROM hr WHERE id = %s", (id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({'message': 'HR not found'}), 404

    # Build update query dynamically
    fields = []
    values = []
    if 'name' in data:
        fields.append("name = %s")
        values.append(data['name'])
    if 'email' in data:
        fields.append("email = %s")
        values.append(data['email'])
    if 'department' in data:
        fields.append("department = %s")
        values.append(data['department'])
    
    if not fields:
         return jsonify({'message': 'No fields to update'}), 400

    values.append(id)
    query = f"UPDATE hr SET {', '.join(fields)} WHERE id = %s"
    
    try:
        cursor.execute(query, tuple(values))
        conn.commit()
        return jsonify({'message': 'HR updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@hr_bp.route('/hr/<int:id>', methods=['DELETE'])

def delete_hr(id):
    """
    Delete an HR
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: HR deleted
      404:
        description: HR not found
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM hr WHERE id = %s", (id,))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({'message': 'HR not found'}), 404
        
    cursor.close()
    conn.close()
    return jsonify({'message': 'HR deleted successfully'})
