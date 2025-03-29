"""This module contains all the routes for the patients blueprint"""
from flask import Blueprint, request, jsonify
from auth.utils import generate_jwt_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.utils.mail import send_email

patients = Blueprint('patients', __name__ , url_prefix='/patients')


@patients.route('/login', methods=['POST'])
def login():
    data = request.json

    # Check if the request body is empty
    if not data:
        return jsonify({'message': 'Request body cannot be empty'}), 400
    
    # Check if the required fields are in the request body
    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    # check if the user exists in the database using the email
    email = data['email']
    password = data['password']
    existing_patient = Patient.query.filter_by(email=email).first()
    if not existing_patient:
        return jsonify({'message': 'User not found'}), 404
    
    # Compare the hashed password in the database with the password provided
    if not check_password_hash(existing_patient.password, password):
        return jsonify({'message': 'Invalid password'}), 400
      
    jwt_token = generate_jwt_token(existing_patient.patient_id)

    response_successful = {
        "status": "success",
        "message": "Login successful",
        "data": {
            "accessToken": jwt_token,
            "patient": {
                "patientId": existing_patient.patient_id,
                "firstName": existing_patient.firstname,
                "lastName": existing_patient.lastname,
                "email": existing_patient.email,
                "phone": existing_patient.phone
            }
        }
    }
    return jsonify(response_successful), 200


@patients.route('/<patient_id>/change-password', methods=['PUT'])
def change_password(patient_id):
    data = request.json

    # Check if the request body is empty
    if not data:
        return jsonify({'message': 'Request body cannot be empty'}), 400
    
    # check if the user exists in the database using their email
    existing_patient = Patient.query.filter_by(patient_id=patient_id).first()
    if not existing_patient:
        return jsonify({'message': 'User not found'}), 404
    

    # get the new password from the request body and hash it then save it to the database
    new_password = data['new_password']
    existing_patient.password = generate_password_hash(new_password)
    db.session.commit()

    # if successful, send an email to the user
    email_subject = 'Password Change Notification'
    email_body = 'Your password has been changed successfully.'
    send_email(email_subject, existing_patient.email, email_body)    
    
    return jsonify({'message': 'Password changed successfully'})

@patients.route('/<patient_id>/appointments', methods=['GET'])
def view_all_appointments(patient_id):
    return jsonify({'appointments': 'All appointments'})

@patients.route('/<patient_id>/appointments/<appointment_id>', methods=['GET'])
def view_appointment_details(patient_id, appointment_id):
    return jsonify({'appointment': 'Appointment details'})

@patients.route('/<patient_id>/appointments', methods=['POST'])
def book_appointment(patient_id):
    return jsonify({'message': 'Appointment booked successfully'})

@patients.route('/<patient_id>/appointments/<appointment_id>', methods=['PUT'])
def reschedule_appointment(patient_id, appointment_id):
    return jsonify({'message': 'Appointment rescheduled successfully'})

@patients.route('/<patient_id>/appointments/<appointment_id>', methods=['DELETE'])
def cancel_appointment(patient_id, appointment_id):
    return jsonify({'message': 'Appointment cancelled successfully'})

@patients.route('/<patient_id>/medical-history', methods=['GET'])
def view_medical_history(patient_id):
    return jsonify({'medical_history': 'All past visits with diagnosis & prescriptions'})



