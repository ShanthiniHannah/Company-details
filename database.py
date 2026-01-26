import mysql.connector
from mysql.connector import Error

import os

# Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'hr_employee_db'),
    'port': int(os.getenv('DB_PORT', 3306))
}

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_db():
    """Initializes the database and tables."""
    try:
        # Try connecting directly to the database first (Cloud providers create it for you)
        conn = get_db_connection()
        if conn is None:
            # If failed, maybe it doesn't exist? Try creating it (Local execution)
            temp_config = DB_CONFIG.copy()
            temp_config.pop('database')
            conn = mysql.connector.connect(**temp_config)
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
            print(f"Database {DB_CONFIG['database']} checked/created.")
            conn.close()
            
            # Reconnect with DB
            conn = get_db_connection()
            
        if conn is None:
            print("Failed to connect to database.")
            return
            
        cursor = conn.cursor()
        
        # Create HR Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hr (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                department VARCHAR(100)
            )
        """)
        print("HR table checked/created.")
        
        # Create Employee Table
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
        print("Employee table checked/created.")
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except Error as e:
        print(f"Error initializing database: {e}")

if __name__ == '__main__':
    init_db()
