from flask_sqlalchemy import SQLAlchemy
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initializes the database with the Flask app."""
    # Configuration
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '') # Make sure to set this in environment or .env
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = os.getenv('DB_NAME', 'hr_employee_db')
    
    # MySQL Configuration
    # app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
    
    # Check and create database if not exists
    import mysql.connector
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.close()
        conn.close()
        print(f"Database '{DB_NAME}' checked/created successfully.")
    except Exception as e:
        print(f"Error creating database: {e}")

    # Set MySQL URI
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    
    with app.app_context():
        # Import models to ensure they are registered with SQLAlchemy
        from models import Role, User, Employee, Donor, Volunteer, Beneficiary, Report, ActivityLog, Attendance, Leave, Project, Deliverable, Sponsorship, SpiritualGrowth
        
        # Create tables
        db.create_all()
        print("Database tables checked/created.")
        
        # Seed basic roles if not exist
        if not Role.query.first():
            roles = ['Admin', 'HR', 'Employee', 'Donor', 'Volunteer']
            for r_name in roles:
                db.session.add(Role(name=r_name))
            db.session.commit()
            print("Roles seeded.")
