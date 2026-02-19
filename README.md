
# NGO Management System

A comprehensive web application for managing NGO operations, including Human Resources, Employees, Donors, Volunteers, Projects, Finance, and Analytics.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Secure access for Admins, HRs, and standard users.
- **HR & Employee Management**: Track employee details, attendance, and leave requests.
- **Donor Management**: Manage donor profiles and track contributions.
- **Volunteer & Beneficiary Tracking**: Assign volunteers to beneficiaries and monitor progress.
- **Project Management**: Oversee projects, deliverables, and budgets.
- **Finance**: Track sponsorships and expenses.
- **Analytics Dashboard**: Visual insights into organizational data.
- **Activity Logging**: Audit trails for user actions.

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Database**: MySQL (via SQLAlchemy ORM)
- **Frontend**: Vue.js 3 (CDN), Vanilla CSS
- **API Documentation**: Flasgger (Swagger UI)

## 📂 Project Structure

```
├── app.py                 # Application Entry Point
├── models.py              # Database Schema
├── database.py            # Database Configuration
├── routes/                # Blueprint Routes (Controllers)
│   ├── auth.py            # Authentication
│   ├── hr.py              # HR Management
│   ├── employee.py        # Employee Management
│   └── ... (donor, volunteer, project, finance, analytics)
├── static/                # Static Assets
│   ├── css/               # Stylesheets
│   └── js/                # Vue.js Components & Logic
└── templates/             # HTML Templates
```

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ShanthiniHannah/Company-details.git
    cd Company-details
    ```

2.  **Create a Virtual Environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Database**
    - Ensure you have a MySQL server running (local or cloud).
    - Update `database.py` or set environment variables with your DB credentials.

5.  **Initialize Database**
    The application will automatically create tables on the first run via `init_db(app)` in `app.py`.

## ▶️ Running the Application

1.  **Start the Flask Server**
    ```bash
    python app.py
    ```

2.  **Access the Application**
    Open your browser and navigate to: [http://localhost:5000](http://localhost:5000)

3.  **API Documentation**
    Explore the API endpoints at: [http://localhost:5000/apidocs](http://localhost:5000/apidocs)

## 🧪 Testing

To run the backend tests:
```bash
python -m unittest discover tests
```
