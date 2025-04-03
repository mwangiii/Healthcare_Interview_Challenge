from flask_restx import Namespace, Resource
from flask import request, jsonify
from app.appointments.models import Appointment
from app import db
from datetime import datetime
from utils.mail import send_email
from utils.error_list import add_error_to_list
from app.appointments.schemas import (
    appointment_model,
    book_appointment_model,
    cancel_appointment_response_model,
    reschedule_appointment_model,
    error_response_model,
    appointments_list_model
)

# Namespace for appointments
appointment_namespace = Namespace("appointments", description="Appointments related operations")

appointment_namespace.add_model("Appointment", appointment_model)
appointment_namespace.add_model("BookAppointment", book_appointment_model)
appointment_namespace.add_model("RescheduleAppointment", reschedule_appointment_model)
appointment_namespace.add_model("CancelAppointmentResponse", cancel_appointment_response_model)
appointment_namespace.add_model("ErrorResponse", error_response_model)
appointment_namespace.add_model("AppointmentsList", appointments_list_model)

@appointment_namespace.route("/")
class AppointmentsResource(Resource):
    @appointment_namespace.response(200, "Success", appointments_list_model)
    @appointment_namespace.response(404, "No appointments found", error_response_model)
    def get(self):
        """
        Get all appointments
        """
        appointments = Appointment.query.all()
        if not appointments:
            return {"status": "error", "message": "No appointments found"}, 404
        
        appointment_list = [
            {
                "appointmentId": appointment.id,
                "patientId": appointment.patient_id,
                "doctorId": appointment.doctor_id,
                "date": appointment.date.strftime("%Y-%m-%d"),
                "time": appointment.time.strftime("%H:%M"),
                "status": appointment.status
            }
            for appointment in appointments
        ]
        
        return {
            "status": "success",
            "message": "Appointments retrieved successfully",
            "data": {"appointments": appointment_list}
        }, 200

@appointment_namespace.route("/book")
class BookAppointmentResource(Resource):
    @appointment_namespace.expect(book_appointment_model)
    @appointment_namespace.response(201, "Appointment booked successfully", appointment_model)
    @appointment_namespace.response(400, "Invalid input", error_response_model)
    @appointment_namespace.response(409, "Appointment already exists", error_response_model)
    def post(self):
        """
        Book an appointment
        """
        data = request.get_json()
        errors = []
        
        if not data:
            add_error_to_list(errors, "data", "No input data provided")
            return {"status": "error", "message": "Invalid input", "errors": errors}, 400

        date = data.get("date")
        time = data.get("time")
        doctor_id = data.get("doctor_id")

        try:
            appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
            appointment_time = datetime.strptime(time, "%H:%M").time()
        except ValueError as e:
            return {"status": "error", "message": str(e)}, 400

        existing_appointment = Appointment.query.filter_by(
            date=appointment_date,
            time=appointment_time,
            doctor_id=doctor_id
        ).first()

        if existing_appointment:
            return {"status": "error", "message": "Appointment already exists"}, 409

        new_appointment = Appointment(
            patient_id=1,  # Replace with actual patient ID from session
            doctor_id=doctor_id,
            date=appointment_date,
            time=appointment_time,
            status="booked"
        )

        db.session.add(new_appointment)
        db.session.commit()

        send_email(
            subject="Appointment Confirmation",
            body=f"Your appointment is booked for {date} at {time}."
        )

        return {
            "status": "success",
            "message": "Appointment booked successfully",
            "data": {
                "appointmentId": new_appointment.id,
                "patientId": new_appointment.patient_id,
                "doctorId": new_appointment.doctor_id,
                "date": new_appointment.date.strftime("%Y-%m-%d"),
                "time": new_appointment.time.strftime("%H:%M"),
                "status": new_appointment.status
            }
        }, 201

@appointment_namespace.route("/cancel/<int:appointment_id>")
class CancelAppointmentResource(Resource):
    @appointment_namespace.response(200, "Appointment cancelled successfully", cancel_appointment_response_model)
    @appointment_namespace.response(404, "Appointment not found", error_response_model)
    def delete(self, appointment_id):
        """
        Cancel an appointment
        """
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return {"status": "error", "message": f"Appointment with ID {appointment_id} not found"}, 404

        db.session.delete(appointment)
        db.session.commit()

        send_email(
            subject="Appointment Cancellation",
            body=f"Your appointment has been cancelled."
        )

        return {
            "status": "success",
            "message": "Appointment cancelled successfully",
            "data": {"appointmentId": appointment_id}
        }, 200
