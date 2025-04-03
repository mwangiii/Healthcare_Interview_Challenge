import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app import db


class Appointment(db.Model):
    appointment_id = Column(UUID, primary_key=True, default=uuid.uuid4, unique=True)
    patient_id = Column(UUID, ForeignKey('patients.patient_id'), nullable=False)  # Change to UUID
    doctor_id = Column(UUID, ForeignKey('doctors.doctor_id'), nullable=False)  # Use 'doctor_id' here
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    status = Column(String(50), default='booked')
    created_at = Column(DateTime, default=datetime.utcnow)

    # Define the relationship to the Doctor model
    doctor = relationship("Doctor", back_populates="appointments")  # Reverse relationship defined in Doctor model
    patient = relationship("Patient", back_populates="appointments")  # Relationship to Patient model

    def __repr__(self):
        return f"<Appointment {self.appointment_id}>"
