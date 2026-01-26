import mysql.connector
from database import DB_CONFIG

def migrate():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        try:
            cursor.execute("ALTER TABLE employee ADD COLUMN sponsor VARCHAR(100)")
            print("Successfully added 'sponsor' column to employee table.")
        except mysql.connector.Error as err:
            if err.errno == 1060: # Duplicate column name
                print("'sponsor' column already exists.")
            else:
                print(f"Error adding column: {err}")
        
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    migrate()
