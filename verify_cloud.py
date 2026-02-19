import mysql.connector
from mysql.connector import Error

# Credentials provided by user
CONFIG = {
    'host': 'mysql-2sha7-companydetails1234.d.aivencloud.com',
    'port': 16314,
    'user': 'avnadmin',
    'password': 'YOUR_PASSWORD_HERE', # Replace with your actual password or use environment variables
    'database': 'defaultdb',
    # Aiven requires SSL. mysql-connector uses SSL by default if available.
    # We might need 'ssl_mode': 'REQUIRED'? 
    # For mysql-connector-python, 'ssl_disabled': False is default.
}

def verify_connection():
    print(f"Connecting to {CONFIG['host']}...")
    try:
        conn = mysql.connector.connect(**CONFIG)
        if conn.is_connected():
            print("Connection successful!")
            
            cursor = conn.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"Connected to database: {record[0]}")
            
            # Create tables if not exist (similar to init_db)
            print("Creating/Verifying tables...")
            
            # HR Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hr (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    department VARCHAR(100)
                )
            """)
            
            # Employee Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS employee (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    age INT,
                    gender VARCHAR(10),
                    address VARCHAR(255),
                    hr_id INT,
                    sponsor VARCHAR(100),
                    FOREIGN KEY (hr_id) REFERENCES hr(id) ON DELETE SET NULL
                )
            """)
            print("Tables initialized successfully.")
            
            cursor.close()
            conn.close()
            return True
            
    except Error as e:
        print(f"Error connecting to Cloud DB: {e}")
        return False

if __name__ == '__main__':
    verify_connection()
