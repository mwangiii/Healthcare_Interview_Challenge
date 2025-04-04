# -*- coding: utf-8 -*-
from flask_restx import Namespace, Resource
from app.doctors.models import Doctor
from app.auth.routes import UserRegister, UserLogin
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from datetime import datetime
from app import db, cache
from app.doctors.schemas import DoctorAvailabilitySchema
import uuid
import logging
import json

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

doctor_namespace = Namespace('doctors', description='Doctors related operations')


@doctor_namespace.route('/register')
class DoctorRegister(UserRegister):
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")


@doctor_namespace.route('/login')
class DoctorLogin(UserLogin):
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")


@doctor_namespace.route("/availability")
class SetAvailability(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()

        try:
            doctor_id = uuid.UUID(current_user)
        except ValueError:
            return {"message": "Invalid doctor ID format."}, 400

        doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
        if not doctor:
            return {"message": "Doctor not found."}, 403

        json_data = request.get_json()
        schema = DoctorAvailabilitySchema()

        try:
            data = schema.load(json_data)
        except Exception as e:
            return {"message": "Invalid input", "errors": e.messages}, 400

        doctor.availability_start = datetime.strptime(data["availability_start"], "%H:%M").time()
        doctor.availability_end = datetime.strptime(data["availability_end"], "%H:%M").time()
        doctor.days_available = ",".join(data["days_available"])

        db.session.commit()

        cache.delete(f"doctor_details:{doctor.doctor_id}")
        cache.delete(f"doctor_availability:{doctor.doctor_id}")
        logger.debug(f"Cache invalidated for doctor {doctor.doctor_id}")

        return {
            "status": "success",
            "message": "Availability updated successfully.",
            "data": {
                "availability_start": str(data["availability_start"]),
                "availability_end": str(data["availability_end"]),
                "days_available": data["days_available"]
            }
        }, 200


@doctor_namespace.route("/availability/<uuid:doctor_id>")
class GetAvailability(Resource):
    @jwt_required()
    @cache.cached(timeout=300, key_prefix="doctor_availability")
    def get(self, doctor_id):
        current_user = get_jwt_identity()
        logger.debug(f"Fetching cache for doctor availability: {doctor_id}")
        cached_availability = cache.get(f"doctor_availability:{doctor_id}")
        if cached_availability:
            logger.debug(f"Cache hit for doctor availability: {doctor_id}")
            return {
                "status": "success",
                "data": json.loads(cached_availability)
            }, 200

        requested_doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
        if not requested_doctor:
            return {"message": "Requested doctor not found."}, 404

        data = {
            "doctor_id": str(requested_doctor.doctor_id),
            "availability_start": str(requested_doctor.availability_start),
            "availability_end": str(requested_doctor.availability_end),
            "days_available": requested_doctor.days_available.split(",") if requested_doctor.days_available else []
        }

        cache.set(f"doctor_availability:{doctor_id}", json.dumps(data), timeout=300)
        logger.debug(f"Cache set for doctor availability: {doctor_id}")

        return {"status": "success", "data": data}, 200


@doctor_namespace.route("/<uuid:doctor_id>")
class GetDoctorDetails(Resource):
    @jwt_required()
    @cache.cached(timeout=300, key_prefix="doctor_details")
    def get(self, doctor_id):
        current_user = get_jwt_identity()
        logger.debug(f"Fetching cache for doctor details: {doctor_id}")
        cached_details = cache.get(f"doctor_details:{doctor_id}")
        if cached_details:
            logger.debug(f"Cache hit for doctor details: {doctor_id}")
            return {"status": "success", "data": json.loads(cached_details)}, 200

        requested_doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
        if not requested_doctor:
            return {"message": "Requested doctor not found."}, 404

        doctor_details = {
            "doctor_id": str(requested_doctor.doctor_id),
            "firstname": requested_doctor.firstname,
            "lastname": requested_doctor.lastname,
            "specialization": requested_doctor.specialization,
            "availability_start": str(requested_doctor.availability_start),
            "availability_end": str(requested_doctor.availability_end),
            "days_available": requested_doctor.days_available.split(",") if requested_doctor.days_available else []
        }

        cache.set(f"doctor_details:{doctor_id}", json.dumps(doctor_details), timeout=300)
        logger.debug(f"Cache set for doctor details: {doctor_id}")

        return {"status": "success", "data": doctor_details}, 200
