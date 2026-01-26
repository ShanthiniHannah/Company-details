import mysql.connector
from database import DB_CONFIG
from werkzeug.security import generate_password_hash

def reset_password():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    new_password = '123'
    hashed = generate_password_hash(new_password)
    email = 'admin@company.com'

    try:
        cursor.execute("UPDATE hr SET password = %s WHERE email = %s", (hashed, email))
        conn.commit()
        if cursor.rowcount > 0:
            print(f"Password for {email} reset to '{new_password}' successfully.")
        else:
            print(f"User {email} not found.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    reset_password()
