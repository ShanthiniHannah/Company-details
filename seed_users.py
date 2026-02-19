from app import app
from database import db
from models import User, Role
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        # Ensure roles exist (should be handled by init_db but safe to check)
        roles = ['Admin', 'HR', 'Employee', 'Donor', 'Volunteer']
        for r_name in roles:
            role = Role.query.filter_by(name=r_name).first()
            if not role:
                role = Role(name=r_name)
                db.session.add(role)
                print(f"Created role: {r_name}")
        db.session.commit()
            
        # Get Admin Role
        admin_role = Role.query.filter_by(name='Admin').first()
        
        # Create Admin User
        admin = User.query.filter_by(email='admin@example.com').first()
        if not admin:
            admin = User(
                name='Super Admin',
                email='admin@example.com',
                password=generate_password_hash('admin'),
                role_id=admin_role.id
            )
            db.session.add(admin)
            db.session.commit()
            print("Created Admin user: admin@example.com / admin")
        else:
            print("Admin user already exists.")

if __name__ == '__main__':
    seed()
