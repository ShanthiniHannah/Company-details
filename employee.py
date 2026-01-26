from flask import Blueprint, request, jsonify
from database import get_db_connection
from flasgger import swag_from
from auth import login_required

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/employee', methods=['GET'])

def get_employees():
    """
    Get all employees details
    ---
    responses:
      200:
        description: List of Employees
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              age:
                type: integer
              gender:
                type: string
              address:
                type: string
              hr_id:
                type: integer
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM employee")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(employees)

@employee_bp.route('/employee', methods=['POST'])

def add_employee():
    """
    Add a new Employee
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - name
          properties:
            name:
              type: string
            age:
              type: integer
            gender:
              type: string
            address:
              type: string
            hr_id:
              type: integer
              description: ID of the HR manager
            sponsor:
              type: string
    responses:
      201:
        description: Employee created
      400:
        description: Error
    """
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    gender = data.get('gender')
    address = data.get('address')
    hr_id = data.get('hr_id')
    sponsor = data.get('sponsor')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO employee (name, age, gender, address, hr_id, sponsor) VALUES (%s, %s, %s, %s, %s, %s)",
            (name, age, gender, address, hr_id, sponsor)
        )
        conn.commit()
        return jsonify({'message': 'Employee added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@employee_bp.route('/employee/<int:id>', methods=['PUT'])

def update_employee(id):
    """
    Update an Employee
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
            age:
              type: integer
            gender:
              type: string
            address:
              type: string
            hr_id:
              type: integer
    responses:
      200:
        description: Employee updated
      404:
        description: Employee not found
    """
    data = request.get_json()
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    
    # Check if Employee exists
    cursor.execute("SELECT * FROM employee WHERE id = %s", (id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({'message': 'Employee not found'}), 404

    # Build update query dynamically
    fields = []
    values = []
    if 'name' in data:
        fields.append("name = %s")
        values.append(data['name'])
    if 'age' in data:
        fields.append("age = %s")
        values.append(data['age'])
    if 'gender' in data:
        fields.append("gender = %s")
        values.append(data['gender'])
    if 'address' in data:
        fields.append("address = %s")
        values.append(data['address'])
    if 'hr_id' in data:
        fields.append("hr_id = %s")
        values.append(data['hr_id'])
    if 'sponsor' in data:
        fields.append("sponsor = %s")
        values.append(data['sponsor'])
    
    if not fields:
         return jsonify({'message': 'No fields to update'}), 400

    values.append(id)
    query = f"UPDATE employee SET {', '.join(fields)} WHERE id = %s"
    
    try:
        cursor.execute(query, tuple(values))
        conn.commit()
        return jsonify({'message': 'Employee updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@employee_bp.route('/employee/<int:id>', methods=['DELETE'])

def delete_employee(id):
    """
    Delete an Employee
    ---
    parameters:
      - name: id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Employee deleted
      404:
        description: Employee not found
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM employee WHERE id = %s", (id,))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({'message': 'Employee not found'}), 404
        
    cursor.close()
    conn.close()
    return jsonify({'message': 'Employee deleted successfully'})
