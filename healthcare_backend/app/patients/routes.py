from flask_restx import Namespace, Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.auth.routes import UserRegister, UserLogin
from app.patients.models import Patient
from app import db
import logging

# Configure logger
logger = logging.getLogger(__name__)

patient_namespace = Namespace('patients', description='Patients related operations')


@patient_namespace.route('/register')
class PatientRegister(UserRegister):
    """Handles patient registration."""

    def __init__(self, *args, **kwargs):
        super().__init__(model=Patient, role="patient")


@patient_namespace.route('/login')
class PatientLogin(UserLogin):
    """Handles patient login."""

    def __init__(self, *args, **kwargs):
        super().__init__(model=Patient, role="patient")


# patient endpoint for creating profile ie image,weight,height,age,blood group and home address.
# only them can update their profile
# only them can view their profile
@patient_namespace.route('/profile')
class PatientProfile(Resource):
    """Handles patient profile operations."""
    @jwt_required()
    def get(self):
        """Fetches the profile of the logged-in patient."""
        current_user = get_jwt_identity()  # This is likely a string (e.g., patient ID)
        logger.debug(f"Fetching profile for user: {current_user}")

        # Fetch the patient's profile from the database
        patient = Patient.query.filter_by(patient_id=current_user).first()  # Use the correct column name
        if not patient:
            return {"message": "Patient not found."}, 404

        patient_details = {
            "id": str(patient.patient_id),  # Use the correct column name
            "image": patient.image,
            "name": f"{patient.firstname} {patient.lastname}",
            "email": patient.email,
            "phone": patient.phone,
            "address": patient.address,
            "age": patient.age,
            "weight": patient.weight,
            "height": patient.height,
            "blood_group": patient.blood_group,
        }
        return {
            "status": "success",
            "data": patient_details
        }, 200

    @jwt_required()
    def put(self):
        """Updates the profile of the logged-in patient."""
        current_user = get_jwt_identity()
        logger.debug(f"Updating profile for user: {current_user}")

        # Fetch the patient's profile from the database
        patient = Patient.query.filter_by(patient_id=current_user).first()  # Use the correct column name
        if not patient:
            return {"message": "Patient not found."}, 404

        # Update the patient's profile with the provided data
        data = request.get_json()
        patient.image = data.get('image', patient.image)
        patient.firstName = data.get('firstName', patient.firstname)
        patient.lastName = data.get('lastName', patient.lastname)
        patient.email = data.get('email', patient.email)
        patient.phone = data.get('phone', patient.phone)
        patient.address = data.get('address', patient.address)
        patient.age = data.get('age', patient.age)
        patient.weight = data.get('weight', patient.weight)
        patient.height = data.get('height', patient.height)
        patient.blood_group = data.get('blood_group', patient.blood_group)

        db.session.commit()

        return {
            "status": "success",
            "message": "Profile updated successfully."
        }, 200

    @jwt_required()
    def post(self):
        """Creates a new profile for the logged-in patient."""
        current_user = get_jwt_identity()
        logger.debug(f"Creating profile for user: {current_user}")

        # Fetch the patient's profile from the database
        patient = Patient.query.filter_by(patient_id=current_user['id']).first()
        if not patient:
            return {"message": "Patient not found."}, 404

        # Create a new profile with the provided data
        data = request.get_json()
        patient.image = data.get('image', patient.image)
        patient.name = data.get('name', patient.name)
        patient.email = data.get('email', patient.email)
        patient.phone = data.get('phone', patient.phone)
        patient.address = data.get('address', patient.address)
        patient.age = data.get('age', patient.age)
        patient.weight = data.get('weight', patient.weight)
        patient.height = data.get('height', patient.height)
        patient.blood_group = data.get('blood_group', patient.blood_group)

        db.session.commit()

        return {
            "status": "success",
            "message": "Profile created successfully."
        }, 201
