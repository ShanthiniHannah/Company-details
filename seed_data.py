import mysql.connector
from database import DB_CONFIG
from werkzeug.security import generate_password_hash

def seed_data():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        # Seed HRs
        # Note: Password is 'password123'
        password_hash = generate_password_hash('password123')
        
        hrs = [
            ('Alice Admin', 'admin@company.com', 'Management', password_hash),
            ('Bob Recruiter', 'bob@company.com', 'Recruitment', password_hash)
        ]
        
        print("Seeding HRs...")
        for hr in hrs:
            try:
                cursor.execute(
                    "INSERT INTO hr (name, email, department, password) VALUES (%s, %s, %s, %s)", 
                    hr
                )
            except mysql.connector.Error as err:
                if err.errno == 1062: # Duplicate entry
                    print(f"HR {hr[0]} already exists.")
                else:
                    raise err

        conn.commit()
        
        # Get HR IDs for foreign keys
        cursor.execute("SELECT id, name FROM hr")
        hr_map = {name: id for id, name in cursor.fetchall()}
        
        if not hr_map:
            print("No HRs found to link employees to.")
            return

        # Seed Employees
        employees = [
            ('John Doe', 30, 'Male', '123 Tech Park', 'Tech Corp', hr_map.get('Alice Admin')),
            ('Jane Smith', 28, 'Female', '456 Design Ave', 'Creative Solutions', hr_map.get('Bob Recruiter')),
            ('Mike Johnson', 35, 'Male', '789 Sales Blvd', 'Global Sales', hr_map.get('Alice Admin')),
            ('Emily Chen', 26, 'Female', '321 Dev Lane', 'Innovate LLC', hr_map.get('Bob Recruiter'))
        ]

        print("Seeding Employees...")
        for emp in employees:
            # Check for duplicates by name (simple check for demo)
            cursor.execute("SELECT id FROM employee WHERE name = %s", (emp[0],))
            if cursor.fetchone():
                print(f"Employee {emp[0]} already exists.")
                continue

            cursor.execute(
                "INSERT INTO employee (name, age, gender, address, sponsor, hr_id) VALUES (%s, %s, %s, %s, %s, %s)",
                emp
            )

        conn.commit()
        print("Database seeded successfully!")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    seed_data()
