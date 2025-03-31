"""This module contains all the routes for the patients blueprint"""

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from app.utils.mail import send_email
from models import Patient, Appointment, Visit
from app.extensions import db
from auth.utils import generate_jwt_token
from flask_restx import Namespace, Resource, fields


api = Namespace('patients', description='Patients related operations')

patients = Blueprint('patients', __name__, url_prefix='/patients')


def add_error_to_list(error_list,field, message):
    error_list.append({
        "field": field,
        "message": message
    })

@patients.route('/register', methods=['POST'])
def register():
    data = request.json
    errors_list = []
  
    # check for the required fields
    if not data.get('firstname'):
        add_error_to_list(errors_list, 'firstname', 'First name is required')
    if not data.get('lastname'):
        add_error_to_list(errors_list, 'lastname', 'Last name is required')
    if not data.get('email'):
        add_error_to_list(errors_list, 'email', 'Email is required')
    if not data.get('phone'):
        add_error_to_list(errors_list, 'phone', 'Phone is required')
    if not data.get('date_of_birth'):
        add_error_to_list(errors_list, 'date_of_birth', 'Date of birth is required')
    if not data.get('password'):
        add_error_to_list(errors_list, 'password', 'Password is required')
 
    
    # Check if email is already in use
    if Patient.query.filter_by(email=data.get('email')).first():
        add_error_to_list(errors_list, 'email', 'Email already in use')
    
    if errors_list:
        return jsonify({
            "status": "Bad Request",
            "message": "Registration unsuccessful",
            "errors": errors_list
        }), 400
    
    # Validate the data from input
    phone = data.get('phone')
    if not re.match(r"^[0-9]{10}$", phone):
        add_error_to_list(errors_list, 'phone', 'Phone number is invalid')
    
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", data.get('email')):
        add_error_to_list(errors_list, 'email', 'Email is invalid')
    
    if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", data.get('password')):
        add_error_to_list(errors_list, 'password', 'Password is invalid')
    
    if errors_list:
        return jsonify({
            "status": "Bad Request",
            "message": "Registration unsuccessful",
            "errors": errors_list
        }), 400
    
    # Hash the password
    hashed_password = generate_password_hash(data.get('password'))
    
    # Create new patient instance
    new_patient = Patient(
        patient_id=str(uuid.uuid4()),
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        email=data.get('email'),
        phone=data.get('phone'),
        date_of_birth=data.get('date_of_birth'),
        password=hashed_password
    )
    
    # Save to the database
    try:
        db.session.add(new_patient)
        db.session.commit()
        
        jwt_token = generate_jwt_token(new_patient.patient_id)
        
        return jsonify({
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
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "Internal Server Error",
            "message": "Registration unsuccessful",
            "errors": str(e)
        }), 500


@patients.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'message': 'Request body cannot be empty'}), 400

    required_fields = ['email', 'password']
    for field in required_fields: 
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400

    email = data['email']
    password = data['password']
    patient = Patient.query.filter_by(email=email).first()

    if not patient:
        return jsonify({'message': 'User not found'}), 404

    if not check_password_hash(patient.password, password):
        return jsonify({'message': 'Invalid password'}), 400

    jwt_token = generate_jwt_token(patient.patient_id)

    return jsonify({
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
    }), 200


# @patients.route('/<int:patient_id>/change-password', methods=['PUT'])
# def change_password(patient_id):
#     """Change the password of a patient and notify the patient via email."""
#     data = request.json
#     if not data:
#         return jsonify({'message': 'Request body cannot be empty'}), 400

#     patient = Patient.query.get(patient_id)
#     if not patient:
#         return jsonify({'message': 'User not found'}), 404

#     new_password = data['new_password']
#     patient.password = generate_password_hash(new_password)
#     db.session.commit()

#     send_email(
#         'Password Change Notification',
#         patient.email,
#         'Your password has been changed successfully.'
#     )

#     return jsonify({'message': 'Password changed successfully'})


# @patients.route('/<int:patient_id>/appointments', methods=['GET'])
# def view_all_appointments(patient_id):
#     """Retrieve all the appointments of a patient."""
#     appointments = Appointment.query.filter_by(patient_id=patient_id).all()
#     if not appointments:
#         return jsonify({'message': 'No appointments found'}), 404

#     appointment_list = [{
#         'appointmentId': a.appointment_id,
#         'doctorId': a.doctor_id,
#         'date': a.date.strftime("%Y-%m-%d"),
#         'time': a.date.strftime("%H:%M"),
#         'status': a.status
#     } for a in appointments]

#     return jsonify({'appointments': appointment_list}), 200


# @patients.route('/<int:patient_id>/appointments/<int:appointment_id>', methods=['GET'])
# def view_appointment_details(patient_id, appointment_id):
#     """Retrieve the details of a specific appointment."""
#     appointment = Appointment.query.get(appointment_id)
#     if not appointment or appointment.patient_id != patient_id:
#         return jsonify({'message': 'Appointment not found'}), 404

#     appointment_details = {
#         'appointmentId': appointment.appointment_id,
#         'doctorId': appointment.doctor_id,
#         'date': appointment.date.strftime("%Y-%m-%d"),
#         'time': appointment.date.strftime("%H:%M"),
#         'status': appointment.status
#     }
#     return jsonify({'appointment': appointment_details}), 200


# @patients.route('/<int:patient_id>/appointments', methods=['POST'])
# def book_appointment(patient_id):
#     """Book an appointment and notify the patient via email."""

#     data = request.json
#     if not data:
#         return jsonify({'message': 'Request body cannot be empty'}), 400

#     required_fields = ['date', 'time', 'doctor_id']
#     for field in required_fields:
#         if field not in data:
#             return jsonify({'message': f'{field} is required'}), 400

#     try:
#         appointment_datetime = datetime.strptime(
#             f"{data['date']} {data['time']}", "%Y-%m-%d %H:%M"
#         )
#         if appointment_datetime < datetime.now():
#             return jsonify({'message': 'Date cannot be in the past'}), 400
#     except ValueError:
#         return jsonify({'message': 'Invalid date or time format. Use YYYY-MM-DD HH:MM'}), 400

#     patient = Patient.query.get(patient_id)
#     if not patient:
#         return jsonify({'message': 'Patient not found'}), 404

#     new_appointment = Appointment(
#         patient_id=patient_id,
#         doctor_id=data['doctor_id'],
#         date=appointment_datetime,
#         status='booked'
#     )
#     db.session.add(new_appointment)
#     db.session.commit()

#     send_email(
#         'Appointment Booking Notification',
#         patient.email,
#         f'Your appointment has been booked for {data["date"]} at {data["time"]}.'
#     )

#     return jsonify({
#         "status": "success",
#         "message": "Appointment booked successfully",
#         "data": {
#             "appointmentId": new_appointment.appointment_id,
#             "doctorId": new_appointment.doctor_id,
#             "date": new_appointment.date.strftime("%Y-%m-%d"),
#             "time": new_appointment.date.strftime("%H:%M"),
#             "status": new_appointment.status
#         }
#     }), 201


# @patients.route('/<int:patient_id>/appointments/<int:appointment_id>', methods=['PUT'])
# def reschedule_appointment(patient_id, appointment_id):
#     """Reschedule an appointment and notify the patient via email."""
#     data = request.json
#     if not data:
#         return jsonify({'message': 'Request body cannot be empty'}), 400

#     appointment = Appointment.query.get(appointment_id)
#     if not appointment or appointment.patient_id != patient_id:
#         return jsonify({'message': 'Appointment not found'}), 404

#     try:
#         new_datetime = datetime.strptime(
#             f"{data['date']} {data['time']}", "%Y-%m-%d %H:%M"
#         )
#         if new_datetime < datetime.now():
#             return jsonify({'message': 'Date cannot be in the past'}), 400
#     except ValueError:
#         return jsonify({'message': 'Invalid date or time format. Use YYYY-MM-DD HH:MM'}), 400

#     patient = Patient.query.get(patient_id)
#     if not patient:
#         return jsonify({'message': 'Patient not found'}), 404

#     appointment.date = new_datetime
#     db.session.commit()

#     send_email(
#         'Appointment Rescheduling Notification',
#         patient.email,
#         f'Your appointment has been rescheduled for {data["date"]} at {data["time"]}.'
#     )

#     return jsonify({'appointment': {
#         'appointmentId': appointment.appointment_id,
#         'doctorId': appointment.doctor_id,
#         'date': appointment.date.strftime("%Y-%m-%d"),
#         'time': appointment.date.strftime("%H:%M"),
#         'status': appointment.status
#     }}), 200


# @patients.route('/<int:patient_id>/appointments/<int:appointment_id>', methods=['DELETE'])
# def cancel_appointment(patient_id, appointment_id):
#     """Cancel an appointment and notify the patient via email."""

#     appointment = Appointment.query.get(appointment_id)
#     if not appointment or appointment.patient_id != patient_id:
#         return jsonify({'message': 'Appointment not found'}), 404

#     patient = Patient.query.get(patient_id)
#     if not patient:
#         return jsonify({'message': 'Patient not found'}), 404

#     send_email(
#         'Appointment Cancellation Notification',
#         patient.email,
#         f'Your appointment for {appointment.date.strftime("%Y-%m-%d")} at {appointment.date.strftime("%H:%M")} has been cancelled.'
#     )

#     db.session.delete(appointment)
#     db.session.commit()

#     return jsonify({'message': 'Appointment cancelled successfully'}), 200


# @patients.route('/<int:patient_id>/medical-history', methods=['GET'])
# def view_medical_history(patient_id):
#     """Retrieve the complete medical history of a patient."""

#     patient = Patient.query.get(patient_id)
#     if not patient:
#         return jsonify({'message': 'Patient not found'}), 404

#     visits = Visit.query.filter_by(patient_id=patient_id).order_by(Visit.date.desc()).all()
#     if not visits:
#         return jsonify({'message': 'No medical history found'}), 404

#     medical_history = []
#     for visit in visits:
#         visit_data = {
#             'visitId': visit.id,
#             'patient': {
#                 'patientId': patient.patient_id,
#                 'firstName': patient.firstname,
#                 'lastName': patient.lastname,
#                 'email': patient.email,
#                 'phone': patient.phone
#             },
#             'date': visit.date.strftime("%Y-%m-%d"),
#             'doctor': {
#                 'doctorId': visit.doctor.doctor_id,
#                 'firstName': visit.doctor.firstname,
#                 'lastName': visit.doctor.lastname,
#                 'specialization': visit.doctor.specialization
#             },
#             'diagnosis': visit.diagnosis,
#             'prescription': visit.prescription,
#             'payment': {
#                 'amountPaid': visit.amount_paid,
#                 'insuranceCover': visit.insurance_cover,
#                 'insuranceNumber': visit.insurance_number
#             }
#         }
#         medical_history.append(visit_data)

#     return jsonify({'medical_history': medical_history}), 200
