from app import app, db
from sqlalchemy import text

def fix():
    with app.app_context():
        try:
            with db.engine.connect() as conn:
                # Check if column exists first? 
                # Or just try to add it. If it fails (exists), catch error.
                try:
                    conn.execute(text("ALTER TABLE activity_logs ADD COLUMN details TEXT"))
                    conn.commit()
                    print("Added 'details' column to activity_logs.")
                except Exception as e:
                    print(f"Could not add column (maybe exists?): {e}")
                    
        except Exception as e:
            print(f"Database connection error: {e}")

if __name__ == "__main__":
    fix()
