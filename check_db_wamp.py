import mysql.connector
import os

def check_database():
    try:
        # Default WAMP credentials
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""
        )
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES LIKE 'hr_employee_db'")
        result = cursor.fetchone()
        
        if result:
            print("SUCCESS: Database 'hr_employee_db' FOUND in local MySQL (WAMP).")
            
            # Check tables
            cursor.execute("USE hr_employee_db")
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print("Tables found:", [t[0] for t in tables])
        else:
            print("FAILURE: Database 'hr_employee_db' NOT FOUND.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        print("Make sure WAMP is running!")

if __name__ == "__main__":
    check_database()
