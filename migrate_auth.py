import mysql.connector
from database import DB_CONFIG

def migrate():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        try:
            # Add password column. Defaulting to 'password123' for existing HRs temporarily
            cursor.execute("ALTER TABLE hr ADD COLUMN password VARCHAR(255) DEFAULT 'scrypt:32768:8:1$k7...'") 
            # Note: In a real app we wouldn't set a default hardcoded hash easily like this without a proper hash.
            # For this demo, let's just add the column and we will handle setting passwords later or manually.
            # Actually, let's just add it as NULLable first or with a default string if strict mode.
            
            # Re-running with a simpler approach
            pass
        except Exception:
            pass

        try:
            cursor.execute("ALTER TABLE hr ADD COLUMN password VARCHAR(255)")
            print("Successfully added 'password' column to hr table.")
        except mysql.connector.Error as err:
            if err.errno == 1060:
                print("'password' column already exists.")
            else:
                print(f"Error adding column: {err}")
        
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    migrate()
