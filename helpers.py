from models import db, ActivityLog
from datetime import datetime

def log_activity(user_id, action, details):
    """
    Logs a user action to the database.
    """
    try:
        log = ActivityLog(
            user_id=user_id,
            action=action,
            details=details,
            timestamp=datetime.utcnow()
        )
        db.session.add(log)
        db.session.commit()
        print(f"[LOG] User {user_id} performed {action}: {details}")
    except Exception as e:
        print(f"[ERROR] Failed to log activity: {e}")

def send_sms(phone_number, message):
    """
    Simulates sending an SMS notification.
    In a real app, this would use Twilio or similar service.
    """
    if not phone_number:
        return
    
    # Simulation
    print(f"========================================")
    print(f"[SMS GATEWAY MOCK] To: {phone_number}")
    print(f"Message: {message}")
    print(f"========================================")
