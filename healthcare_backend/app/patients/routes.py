"""This module contains all the routes for the patients blueprint"""

import re
import uuid
from flask import request
from flask_restx import Namespace, Resource, fields
from werkzeug.security import check_password_hash, generate_password_hash
from app.patients.models import Patient
from app import db,api
from app.auth.utils import generate_jwt_token
from datetime import datetime
from utils.mail import send_email
from app.patients.schemas import auth_response_model, register_model, login_model, change_password_model
from app.patients.schemas import appointment_model, appointment_details_model, book_appointment_model, reschedule_appointment_model, cancel_appointment_model


# this is the namespace for the patients module
patient_namespace  = Namespace('patients', description='Patients related operations')

# Helper function for validation errors
def add_error_to_list(error_list, field, message):
    error_list.append({
        "field": field,
        "message": message
    })


@patient_namespace.route('/')
class PatientList(Resource):
    def get(self):
        """List all patients"""
        patients = Patient.query.all()
        if not patients:
            return {"status": "No Content", "message": "No patients found"}, 204

        patient_list = [{
            "patientId": p.patient_id,
            "firstName": p.firstname,
            "lastName": p.lastname,
            "email": p.email,
            "phone": p.phone
        } for p in patients]

        return {
            "status": "Success",
            "message": "Patients retrieved successfully",
            "data": {"patients": patient_list}
        }, 200

# print("Registering patient routes", api.models)
@patient_namespace.route('/register')
class PatientRegister(Resource):
    @patient_namespace.expect(api.models["Register"])
    @patient_namespace.response(201, "Registration successful", auth_response_model)
    @patient_namespace.response(400, "Bad request")
    @patient_namespace.response(500, "Internal server error")
    def post(self):
        """Register a new patient"""
        data = request.json
        errors_list = []

        # Validate required fields
        required_fields = ["firstname", "lastname", "email", "phone", "date_of_birth", "password"]
        for field in required_fields:
            if not data.get(field):
                add_error_to_list(errors_list, field, f"{field.replace('_', ' ').capitalize()} is required")

        # Check if email is already in use
        if Patient.query.filter_by(email=data.get("email")).first():
            add_error_to_list(errors_list, "email", "Email already in use")

        # Validate phone and email formats
        if data.get("phone") and not re.match(r"^[0-9]{10}$", data["phone"]):
            add_error_to_list(errors_list, "phone", "Phone number is invalid")

        if data.get("email") and not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", data["email"]):
            add_error_to_list(errors_list, "email", "Email is invalid")

        if errors_list:
            return {"status": "Bad Request", "message": "Registration unsuccessful", "errors": errors_list}, 400

        # Hash the password
        hashed_password = generate_password_hash(data.get("password"))

        # Create new patient instance
        new_patient = Patient(
            patient_id=str(uuid.uuid4()),
            firstname=data.get("firstname"),
            lastname=data.get("lastname"),
            email=data.get("email"),
            phone=data.get("phone"),
            date_of_birth=data.get("date_of_birth"),
            password=hashed_password
        )

        # Save to the database
        try:
            db.session.add(new_patient)
            db.session.commit()
            jwt_token = generate_jwt_token(new_patient.patient_id)

            return {
                "status": "Success",
                "message": "Registration successful",
                "data": {
                    "accessToken": jwt_token,
                    "patient": {
                        "patientId": new_patient.patient_id,
                        "firstName": new_patient.firstname,
                        "lastName": new_patient.lastname,
                        "email": new_patient.email,
                        "dateOfBirth": new_patient.date_of_birth,
                        "phone": new_patient.phone
                    }
                }
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"status": "Internal Server Error", "message": "Registration unsuccessful", "errors": str(e)}, 500


@patient_namespace.route('/login')
class PatientLogin(Resource):
    @patient_namespace.expect(login_model)  # Auto-generates request body schema
    @patient_namespace.response(200, "Login successful", auth_response_model)
    @patient_namespace.response(400, "Bad request")
    @patient_namespace.response(404, "User not found")
    def post(self):
        """Authenticate a patient and return an access token"""
        data = request.json

        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data:
                return {"message": f"{field} is required"}, 400

        email = data['email']
        password = data['password']
        patient = Patient.query.filter_by(email=email).first()

        if not patient:
            return {"message": "User not found"}, 404

        if not check_password_hash(patient.password, password):
            return {"message": "Invalid password"}, 400

        jwt_token = generate_jwt_token(patient.patient_id)

        return {
            "status": "success",
            "message": "Login successful",
            "data": {
                "accessToken": jwt_token,
                "patient": {
                    "patientId": patient.patient_id,
                    "firstName": patient.firstname,
                    "lastName": patient.lastname,
                    "email": patient.email,
                    "phone": patient.phone
                }
            }
        }, 200


# @patient_namespace.route('/<int:patient_id>/change-password')
# class ChangePassword(Resource):
#     @patient_namespace.expect(change_password_model)  
#     @patient_namespace.response(200, "Password changed successfully")
#     @patient_namespace.response(400, "Bad request")
#     @patient_namespace.response(404, "User not found")
#     def put(self, patient_id):
#         """Change the password of a patient and notify them via email."""
#         data = request.json
#         if not data or "new_password" not in data:
#             return {"message": "Request body cannot be empty and must contain 'new_password'"}, 400

#         patient = Patient.query.get(patient_id)
#         if not patient:
#             return {"message": "User not found"}, 404

#         patient.password = generate_password_hash(data["new_password"])
#         db.session.commit()

#         send_email(
#             "Password Change Notification",
#             patient.email,
#             "Your password has been changed successfully."
#         )

#         return {"status": "success", "message": "Password changed successfully"}, 200


# @patient_namespace.route('/<int:patient_id>/appointments')
# class ViewAppointments(Resource):
#     @patient_namespace.response(200, "Appointments retrieved successfully", 
#                   api.model("AppointmentsResponse", {
#                       "status": fields.String(example="success"),
#                       "message": fields.String(example="Appointments retrieved successfully"),
#                       "data": fields.Nested(api.model("AppointmentsData", {
#                           "appointments": fields.List(fields.Nested(appointment_model))
#                       }))
#                   }))
#     @patient_namespace.response(404, "No appointments found")
#     def get(self, patient_id):
#         """Retrieve all the appointments of a patient."""
#         appointments = Appointment.query.filter_by(patient_id=patient_id).all()
#         if not appointments:
#             return {"message": "No appointments found"}, 404

#         appointment_list = [{
#             "appointmentId": a.appointment_id,
#             "doctorId": a.doctor_id,
#             "date": a.date.strftime("%Y-%m-%d"),
#             "time": a.date.strftime("%H:%M"),
#             "status": a.status
#         } for a in appointments]

#         return {
#             "status": "success",
#             "message": "Appointments retrieved successfully",
#             "data": {"appointments": appointment_list}
#         }, 200


# @patient_namespace.route('/<int:patient_id>/appointments/<int:appointment_id>')
# class ViewAppointmentDetails(Resource):
#     @patient_namespace.response(200, "Appointment details retrieved successfully", 
#                   api.model("AppointmentResponse", {
#                       "status": fields.String(example="success"),
#                       "message": fields.String(example="Appointment details retrieved successfully"),
#                       "data": fields.Nested(api.model("AppointmentData", {
#                           "appointment": fields.Nested(appointment_details_model)
#                       }))
#                   }))
#     @patient_namespace.response(404, "Appointment not found")
#     def get(self, patient_id, appointment_id):
#         """Retrieve the details of a specific appointment."""
#         appointment = Appointment.query.get(appointment_id)
#         if not appointment or appointment.patient_id != patient_id:
#             return {"message": "Appointment not found"}, 404

#         appointment_details = {
#             "appointmentId": appointment.appointment_id,
#             "doctorId": appointment.doctor_id,
#             "date": appointment.date.strftime("%Y-%m-%d"),
#             "time": appointment.date.strftime("%H:%M"),
#             "status": appointment.status
#         }

#         return {
#             "status": "success",
#             "message": "Appointment details retrieved successfully",
#             "data": {"appointment": appointment_details}
#         }, 200


# @patient_namespace.route('/<int:patient_id>/appointments')
# class BookAppointment(Resource):
#     @patient_namespace.expect(book_appointment_model)  # Auto-generates request body schema
#     @patient_namespace.response(201, "Appointment booked successfully", appointment_details_model)
#     @patient_namespace.response(400, "Bad request")
#     @patient_namespace.response(404, "Patient not found")
#     def post(self, patient_id):
#         """Book an appointment and notify the patient via email."""
#         data = request.json
#         if not data:
#             return {"message": "Request body cannot be empty"}, 400

#         required_fields = ["date", "time", "doctor_id"]
#         for field in required_fields:
#             if field not in data:
#                 return {"message": f"{field} is required"}, 400

#         try:
#             appointment_datetime = datetime.strptime(
#                 f"{data['date']} {data['time']}", "%Y-%m-%d %H:%M"
#             )
#             if appointment_datetime < datetime.now():
#                 return {"message": "Date cannot be in the past"}, 400
#         except ValueError:
#             return {"message": "Invalid date or time format. Use YYYY-MM-DD HH:MM"}, 400

#         patient = Patient.query.get(patient_id)
#         if not patient:
#             return {"message": "Patient not found"}, 404

#         new_appointment = Appointment(
#             patient_id=patient_id,
#             doctor_id=data["doctor_id"],
#             date=appointment_datetime,
#             status="booked"
#         )
#         db.session.add(new_appointment)
#         db.session.commit()

#         send_email(
#             "Appointment Booking Notification",
#             patient.email,
#             f"Your appointment has been booked for {data['date']} at {data['time']}."
#         )

#         return {
#             "status": "success",
#             "message": "Appointment booked successfully",
#             "data": {
#                 "appointmentId": new_appointment.appointment_id,
#                 "doctorId": new_appointment.doctor_id,
#                 "date": new_appointment.date.strftime("%Y-%m-%d"),
#                 "time": new_appointment.date.strftime("%H:%M"),
#                 "status": new_appointment.status
#             }
#         }, 201


# @patient_namespace.route('/<int:patient_id>/appointments/<int:appointment_id>/reschedule')
# class RescheduleAppointment(Resource):
#     @patient_namespace.expect(reschedule_appointment_model)
#     @patient_namespace.response(200, "Appointment rescheduled successfully", appointment_details_model)
#     @patient_namespace.response(400, "Invalid input")
#     @patient_namespace.response(404, "Appointment or patient not found")
#     def put(self, patient_id, appointment_id):
#         """Reschedule an appointment and notify the patient via email."""
#         data = request.json
#         if not data:
#             return {"message": "Request body cannot be empty"}, 400

#         appointment = Appointment.query.get(appointment_id)
#         if not appointment or appointment.patient_id != patient_id:
#             return {"message": "Appointment not found"}, 404

#         try:
#             new_datetime = datetime.strptime(
#                 f"{data['date']} {data['time']}", "%Y-%m-%d %H:%M"
#             )
#             if new_datetime < datetime.now():
#                 return {"message": "Date cannot be in the past"}, 400
#         except ValueError:
#             return {"message": "Invalid date or time format. Use YYYY-MM-DD HH:MM"}, 400

#         patient = Patient.query.get(patient_id)
#         if not patient:
#             return {"message": "Patient not found"}, 404

#         appointment.date = new_datetime
#         db.session.commit()

#         send_email(
#             "Appointment Rescheduling Notification",
#             patient.email,
#             f"Your appointment has been rescheduled for {data['date']} at {data['time']}."
#         )

#         return {
#             "status": "success",
#             "message": "Appointment rescheduled successfully",
#             "data": {
#                 "appointmentId": appointment.appointment_id,
#                 "doctorId": appointment.doctor_id,
#                 "date": appointment.date.strftime("%Y-%m-%d"),
#                 "time": appointment.date.strftime("%H:%M"),
#                 "status": appointment.status
#             }
#         }, 200


# @patient_namespace.route('/<int:patient_id>/appointments/<int:appointment_id>/cancel')
# class CancelAppointment(Resource):
#     @patient_namespace.response(200, "Appointment cancelled successfully", cancel_appointment_model)
#     @patient_namespace.response(404, "Appointment or patient not found")
#     def delete(self, patient_id, appointment_id):
#         """Cancel an appointment and notify the patient via email."""
#         appointment = Appointment.query.get(appointment_id)
#         if not appointment or appointment.patient_id != patient_id:
#             return {"message": "Appointment not found"}, 404

#         patient = Patient.query.get(patient_id)
#         if not patient:
#             return {"message": "Patient not found"}, 404

#         send_email(
#             "Appointment Cancellation Notification",
#             patient.email,
#             f"Your appointment for {appointment.date.strftime('%Y-%m-%d')} at {appointment.date.strftime('%H:%M')} has been cancelled."
#         )

#         db.session.delete(appointment)
#         db.session.commit()

#         return {
#             "status": "success",
#             "message": "Appointment cancelled successfully",
#             "data": {
#                 "appointmentId": appointment.appointment_id
#             }
#         }, 200
