from flask_restx import fields
from app import api

# 📌 Appointment Model Schema
appointment_model = api.model("Appointment", {
    "appointmentId": fields.Integer(description="Unique appointment ID"),
    "patientId": fields.Integer(description="Patient ID"),
    "doctorId": fields.Integer(description="Doctor ID"),
    "date": fields.String(description="Appointment date (YYYY-MM-DD)", example="2025-04-05"),
    "time": fields.String(description="Appointment time (HH:MM)", example="14:30"),
    "status": fields.String(description="Appointment status", example="booked")
})

# 📌 Schema for Retrieving Multiple Appointments
appointments_list_model = api.model("AppointmentsList", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Appointments retrieved successfully"),
    "data": fields.Nested(api.model("AppointmentsData", {
        "appointments": fields.List(fields.Nested(appointment_model))
    }))
})

# 📌 Schema for Booking an Appointment
book_appointment_model = api.model("BookAppointment", {
    "date": fields.String(required=True, description="Appointment date (YYYY-MM-DD)", example="2025-04-05"),
    "time": fields.String(required=True, description="Appointment time (HH:MM)", example="14:30"),
    "doctor_id": fields.Integer(required=True, description="Doctor ID")
})

# 📌 Schema for Rescheduling an Appointment
reschedule_appointment_model = api.model("RescheduleAppointment", {
    "date": fields.String(required=True, description="New appointment date (YYYY-MM-DD)", example="2025-04-10"),
    "time": fields.String(required=True, description="New appointment time (HH:MM)", example="16:00")
})

# 📌 Schema for Appointment Cancellation Response
cancel_appointment_response_model = api.model("CancelAppointmentResponse", {
    "status": fields.String(example="success"),
    "message": fields.String(example="Appointment cancelled successfully"),
    "data": fields.Nested(api.model("CancelledAppointmentData", {
        "appointmentId": fields.Integer(description="Cancelled Appointment ID")
    }))
})

# 📌 Schema for Error Responses
error_response_model = api.model("ErrorResponse", {
    "status": fields.String(example="error"),
    "message": fields.String(example="Invalid input"),
    "errors": fields.List(fields.String(example="Missing required fields"))
})
