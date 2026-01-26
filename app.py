from flask import Flask, jsonify, render_template
from flasgger import Swagger
from database import init_db
from hr import hr_bp
from employee import employee_bp
from auth import auth_bp

app = Flask(__name__)
app.secret_key = 'super_secret_key_for_demo_only' # Change this in production
app.config['SWAGGER'] = {
    'title': 'HR and Employee API',
    'uiversion': 3
}

swagger = Swagger(app)

# Register Blueprints
app.register_blueprint(hr_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

if __name__ == '__main__':
    # Initialize DB (Check and create tables)
    init_db()
    # Run app
    app.run(debug=True)
