import os
from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()

# Initialize the SQLAlchemy database instance
db = SQLAlchemy()
api = Api()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

    db.init_app(app)
    migrate.init_app(app, db)

    # Flask-RESTX API
    api = Api(app, doc="/api/docs", title="Patient API", version="1.0", description="API for managing patient data")
    
    # Import namespaces after creating the app
    from app.patients.routes import patient_namespace
    api.add_namespace(patient_namespace, path="/patients")

    return app, db, api
