import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app import db


class Patient(db.Model):
    """
    Represents a patient in the healthcare system.
    """
    __tablename__ = 'patients'

    patient_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    firstname = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="patient")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self):
        return f"<Patient {self.firstname} {self.lastname}>"
