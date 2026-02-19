from flask import Flask, render_template
from flasgger import Swagger
from database import init_db, db
from flask_migrate import Migrate
from routes.hr import hr_bp
from routes.employee import employee_bp
from routes.auth import auth_bp
from routes.donor import donor_bp
from routes.volunteer import volunteer_bp
from routes.project import project_bp
from routes.finance import finance_bp
from routes.analytics import analytics_bp

app = Flask(__name__)
app.secret_key = 'super_secret_key_for_demo_only' # Change this in production
app.config['SWAGGER'] = {
    'title': 'HR and Employee API',
    'uiversion': 3
}

# Initialize DB
init_db(app)
migrate = Migrate(app, db)

swagger = Swagger(app)

# Register Blueprints
app.register_blueprint(hr_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(donor_bp)
app.register_blueprint(volunteer_bp)
app.register_blueprint(project_bp)
app.register_blueprint(finance_bp)
app.register_blueprint(analytics_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
