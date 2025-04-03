from flask_restx import fields
from app import api

BAD_REQUEST_RESPONSE = {"status": "Bad Request", "message": "Invalid input"}
NOT_FOUND_RESPONSE = {"status": "Not Found", "message": "Resource not found"}
INTERNAL_SERVER_ERROR_RESPONSE = {
    "status": "Internal Server Error",
    "message": "An error occurred"
}

register_model = api.model("Register", {
    "first_name": fields.String(required=True, description="First name"),
    "last_name": fields.String(required=True, description="Last name"),
    "email": fields.String(required=True, description="Email address"),
    "phone": fields.String(required=True, description="Phone number"),
    "date_of_birth": fields.String(required=True, description="Date of birth"),
    "password": fields.String(required=True, description="Password")
})

patient_model = api.model("PatientInfo", {
    "patientId": fields.Integer(description="Patient ID"),
    "first_name": fields.String(description="First name"),
    "last_name": fields.String(description="Last name"),
    "email": fields.String(description="Email address"),
    "phone": fields.String(description="Phone number"),
    "date_of_birth": fields.String(description="Date of birth")
})

auth_response_model = api.model("AuthResponse", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Login/Registration successful"),
    "data": fields.Nested(api.model("AuthData", {
        "accessToken": fields.String(description="JWT access token"),
        "patient": fields.Nested(patient_model)
    }))
})

login_model = api.model("Login", {
    "email": fields.String(required=True, description="Patient's email"),
    "password": fields.String(required=True, description="Patient's password")
})

change_password_model = api.model("ChangePassword", {
    "new_password": fields.String(required=True, description="New password")
})

appointment_model = api.model("Appointment", {
    "appointmentId": fields.Integer(description="Appointment ID"),
    "doctorId": fields.Integer(description="Doctor ID"),
    "date": fields.String(description="Date of appointment (YYYY-MM-DD)"),
    "time": fields.String(description="Time of appointment (HH:MM)"),
    "status": fields.String(description="Appointment status")
})

book_appointment_model = api.model("BookAppointment", {
    "date": fields.String(required=True, description="Appointment date (YYYY-MM-DD)"),
    "time": fields.String(required=True, description="Appointment time (HH:MM)"),
    "doctor_id": fields.Integer(required=True, description="Doctor ID")
})

appointment_details_model = api.model("AppointmentDetails", {
    "appointmentId": fields.Integer(description="Appointment ID"),
    "doctorId": fields.Integer(description="Doctor ID"),
    "date": fields.String(description="Date of appointment (YYYY-MM-DD)"),
    "time": fields.String(description="Time of appointment (HH:MM)"),
    "status": fields.String(description="Appointment status")
})

reschedule_appointment_model = api.model("RescheduleAppointment", {
    "date": fields.String(required=True, description="New appointment date (YYYY-MM-DD)"),
    "time": fields.String(required=True, description="New appointment time (HH:MM)")
})

cancel_appointment_model = api.model("CancelAppointmentResponse", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Appointment cancelled successfully"),
    "data": fields.Nested(api.model("CancelledAppointmentData", {
        "appointmentId": fields.Integer(description="Cancelled Appointment ID")
    }))
})
