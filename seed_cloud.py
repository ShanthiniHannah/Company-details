import mysql.connector
from werkzeug.security import generate_password_hash

# Cloud Credentials
CONFIG = {
    'host': 'mysql-2sha7-companydetails1234.d.aivencloud.com',
    'port': 16314,
    'user': 'avnadmin',
    'password': 'YOUR_PASSWORD_HERE', # Replace with your actual password or use environment variables
    'database': 'defaultdb'
}

def seed_cloud_data():
    print(f"Connecting to Cloud DB at {CONFIG['host']}...")
    try:
        conn = mysql.connector.connect(**CONFIG)
        cursor = conn.cursor()

        # Seed HRs
        print("Seeding HRs...")
        # Note: Password is '123' to match your latest preference
        password_hash = generate_password_hash('123')
        
        hrs = [
            ('Alice Admin', 'admin@company.com', 'Management', password_hash),
            ('Bob Recruiter', 'bob@company.com', 'Recruitment', password_hash)
        ]
        
        for hr in hrs:
            try:
                cursor.execute(
                    "INSERT INTO hr (name, email, department, password) VALUES (%s, %s, %s, %s)", 
                    hr
                )
            except mysql.connector.Error as err:
                if err.errno == 1062: # Duplicate entry
                    print(f" - HR {hr[0]} already exists.")
                else:
                    print(f"Error inserting HR {hr[0]}: {err}")

        conn.commit()
        
        # Get HR IDs
        cursor.execute("SELECT id, name FROM hr")
        hr_map = {name: id for id, name in cursor.fetchall()}
        
        # Seed Employees
        employees = [
            ('John Doe', 30, 'Male', '123 Tech Park', 'Tech Corp', hr_map.get('Alice Admin')),
            ('Jane Smith', 28, 'Female', '456 Design Ave', 'Creative Solutions', hr_map.get('Bob Recruiter')),
            ('Mike Johnson', 35, 'Male', '789 Sales Blvd', 'Global Sales', hr_map.get('Alice Admin')),
            ('Emily Chen', 26, 'Female', '321 Dev Lane', 'Innovate LLC', hr_map.get('Bob Recruiter'))
        ]

        print("Seeding Employees...")
        for emp in employees:
            try:
                cursor.execute(
                    "INSERT INTO employee (name, age, gender, address, sponsor, hr_id) VALUES (%s, %s, %s, %s, %s, %s)",
                    emp
                )
            except mysql.connector.Error as err:
                print(f"Error inserting Employee {emp[0]}: {err}")

        conn.commit()
        print("Cloud Database seeded successfully!")
        
    except mysql.connector.Error as err:
        print(f"Connection Error: {err}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    seed_cloud_data()
