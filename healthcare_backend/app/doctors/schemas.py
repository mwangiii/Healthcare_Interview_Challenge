from flask_restx import fields
from app import api

BAD_REQUEST_RESPONSE = {"status": "Bad Request", "message": "Invalid input"}
NOT_FOUND_RESPONSE = {"status": "Not Found", "message": "Resource not found"}
INTERNAL_SERVER_ERROR_RESPONSE = {
    "status": "Internal Server Error",
    "message": "An error occurred"
}

#: Base model for common attributes between Patient and Doctor
base_user_model = api.model("BaseUser", {
    "first_name": fields.String(required=True, description="First name"),
    "last_name": fields.String(required=True, description="Last name"),
    "email": fields.String(required=True, description="Email address"),
    "phone": fields.String(required=True, description="Phone number"),
    "date_of_birth": fields.String(required=True, description="Date of birth"),
    "password": fields.String(required=True, description="Password")
})

#: Doctor-specific fields
doctor_model = api.model("DoctorInfo", {
    "doctorId": fields.Integer(description="Doctor ID"),
    "specialization": fields.String(description="Specialization"),
    "license_number": fields.String(description="Medical license number"),
    **base_user_model.fields
})

#: Request model for Doctor Registration
doctor_register_model = api.inherit("DoctorRegister", base_user_model, {
    "specialization": fields.String(required=True, description="Specialization"),
    "license_number": fields.String(required=True, description="Medical license number")
})

#: Response model for Doctor Info
doctor_info_model = api.model("DoctorInfoResponse", {
    "doctorId": fields.Integer(description="Doctor ID"),
    "specialization": fields.String(description="Specialization"),
    "license_number": fields.String(description="Medical license number"),
    **base_user_model.fields
})

#: Authentication response model (Doctor)
doctor_auth_response_model = api.model("DoctorAuthResponse", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Login/Registration successful"),
    "data": fields.Nested(api.model("DoctorAuthData", {
        "accessToken": fields.String(description="JWT access token"),
        "doctor": fields.Nested(doctor_info_model)
    }))
})

#: Request model for Doctor Login
doctor_login_model = api.model("DoctorLogin", {
    "email": fields.String(required=True, description="Doctor's email"),
    "password": fields.String(required=True, description="Doctor's password")
})

#: Request model for Changing Doctor's Password
doctor_change_password_model = api.model("DoctorChangePassword", {
    "new_password": fields.String(required=True, description="New password")
})

#: Appointment request and response models (for Doctor)
appointment_model = api.model("Appointment", {
    "appointmentId": fields.Integer(description="Appointment ID"),
    "doctorId": fields.Integer(description="Doctor ID"),
    "date": fields.String(description="Date of appointment (YYYY-MM-DD)"),
    "time": fields.String(description="Time of appointment (HH:MM)"),
    "status": fields.String(description="Appointment status")
})

#: Request model for Booking an Appointment (for Doctor)
book_appointment_model = api.model("BookAppointment", {
    "date": fields.String(required=True, description="Appointment date (YYYY-MM-DD)"),
    "time": fields.String(required=True, description="Appointment time (HH:MM)"),
    "doctor_id": fields.Integer(required=True, description="Doctor ID")
})

#: Response model for Booking an Appointment (for Doctor)
appointment_details_model = api.model("AppointmentDetails", {
    "appointmentId": fields.Integer(description="Appointment ID"),
    "doctorId": fields.Integer(description="Doctor ID"),
    "date": fields.String(description="Date of appointment (YYYY-MM-DD)"),
    "time": fields.String(description="Time of appointment (HH:MM)"),
    "status": fields.String(description="Appointment status")
})

#: Response model for Rescheduling an Appointment
reschedule_appointment_model = api.model("RescheduleAppointment", {
    "date": fields.String(required=True, description="New appointment date (YYYY-MM-DD)"),
    "time": fields.String(required=True, description="New appointment time (HH:MM)")
})

#: Response model for Canceling an Appointment
cancel_appointment_model = api.model("CancelAppointmentResponse", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Appointment cancelled successfully"),
    "data": fields.Nested(api.model("CancelledAppointmentData", {
        "appointmentId": fields.Integer(description="Cancelled Appointment ID")
    }))
})
