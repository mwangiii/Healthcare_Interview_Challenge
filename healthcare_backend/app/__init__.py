import os
from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

load_dotenv()

# Initialize the SQLAlchemy database instance
db = SQLAlchemy()
api = Api()
migrate = Migrate()
jwt = JWTManager()  # Initialize JWTManager

def create_app():
    app = Flask(__name__)

    from config import Config 
    app.config.from_object(Config)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

    # JWT configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Set your JWT secret key
    app.config['JWT_TOKEN_LOCATION'] = ["headers"]  # Can be "cookies", "headers", etc.
    app.config['JWT_HEADER_NAME'] = "Authorization"  # Name of the header holding the token
    app.config['JWT_HEADER_TYPE'] = "Bearer"  # Type of token, typically "Bearer"

    # Initialize components
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)  # Initialize JWTManager with the Flask app

    # Flask-RESTX API
    api.init_app(app, doc="/api/docs", title="Patient API", version="1.0", description="API for managing patient data")
    
    # Import namespaces after creating the app
    from app.patients.routes import patient_namespace
    api.add_namespace(patient_namespace, path="/patients")

    from app.doctors.routes import doctor_namespace
    api.add_namespace(doctor_namespace, path="/doctors")

    from app.appointments.routes import appointment_namespace
    api.add_namespace(appointment_namespace, path="/appointments")

    return app  # Return only the app instance
