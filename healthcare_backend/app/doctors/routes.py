from flask_restx import Namespace, Resource
from app.doctors.models import Doctor
from app.auth.routes import UserRegister, UserLogin
from app.auth.utils import generate_jwt_token
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from datetime import datetime
from app import db 
import uuid
from config import Config
doctor_namespace = Namespace('doctors', description='Doctors related operations')


@doctor_namespace.route('/register')
class DoctorRegister(UserRegister):
    """
    Handles doctor registration.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")


@doctor_namespace.route('/login')
class DoctorLogin(UserLogin):
    """
    Handles doctor login.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")


@doctor_namespace.route("/availability")
class SetAvailability(Resource):
    @jwt_required()
    def post(self):
        """
        Set or update a doctor's availability.
        """
        current_user = get_jwt_identity()
        print(f"Current user: '{current_user}'")  # Debugging line

        # Check if current_user is a valid UUID
        try:
            doctor_id = uuid.UUID(current_user)  # Convert current_user to UUID
        except ValueError:
            return {"message": "Invalid doctor ID format."}, 400

        # Query the doctor by the UUID
        doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()

        if not doctor:
            return {"message": "Doctor not found."}, 403

        data = request.get_json()

        # Validate input data
        try:
            availability_start = datetime.strptime(data.get("availability_start"), "%H:%M").time()
            availability_end = datetime.strptime(data.get("availability_end"), "%H:%M").time()
            days_available = data.get("days_available", [])
            if not isinstance(days_available, list) or not days_available:
                raise ValueError("Invalid days_available format or empty list.")
        except (ValueError, TypeError):
            return {"message": "Invalid time format or missing data. Use 'HH:MM' for time and a non-empty list for days."}, 400

        # Convert list of days to a comma-separated string for storage
        days_available_str = ",".join(days_available)

        # Update doctor's availability in the database
        doctor.availability_start = availability_start
        doctor.availability_end = availability_end
        doctor.days_available = days_available_str

        db.session.commit()

        return {
            "status": "success",
            "message": "Availability updated successfully.",
            "data": {
                "availability_start": str(availability_start),
                "availability_end": str(availability_end),
                "days_available": days_available  # Return as a list
            }
        }, 200




@doctor_namespace.route("/availability/<uuid:doctor_id>")
class GetAvailability(Resource):
    @jwt_required()
    def get(self, doctor_id):
        """
        Fetch a doctor's availability. This is accessible to any logged-in user (patient, doctor, etc.).
        """
        current_user = get_jwt_identity()

        # Check if the requested doctor exists
        requested_doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()

        if not requested_doctor:
            return {"message": "Requested doctor not found."}, 404

        # Fetch the doctor's availability
        availability_start = str(requested_doctor.availability_start)
        availability_end = str(requested_doctor.availability_end)
        days_available = requested_doctor.days_available.split(",") if requested_doctor.days_available else []

        return {
            "status": "success",
            "data": {
                "doctor_id": str(requested_doctor.doctor_id),
                "availability_start": availability_start,
                "availability_end": availability_end,
                "days_available": days_available
            }
        }, 200
    
@doctor_namespace.route("/<uuid:doctor_id>")
class GetDoctorDetails(Resource):
    @jwt_required()
    def get(self, doctor_id):
        """
        Fetch a doctor's details. This is accessible to any logged-in user (patient, doctor, etc.).
        """
        current_user = get_jwt_identity()

        # Check if the requested doctor exists
        requested_doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()

        if not requested_doctor:
            return {"message": "Requested doctor not found."}, 404

        # Fetch the doctor's details
        doctor_details = {
            "doctor_id": str(requested_doctor.doctor_id),
            "firstname": requested_doctor.firstname,
            "lastname": requested_doctor.lastname,
            "specialization": requested_doctor.specialization,
            "availability_start": str(requested_doctor.availability_start),
            "availability_end": str(requested_doctor.availability_end),
            "days_available": requested_doctor.days_available.split(",") if requested_doctor.days_available else []
        }

        return {
            "status": "success",
            "data": doctor_details
        }, 200