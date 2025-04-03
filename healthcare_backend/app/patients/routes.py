from flask_restx import Namespace
from app.auth.routes import UserRegister, UserLogin
from app.patients.models import Patient

patient_namespace = Namespace('patients', description='Patients related operations')


@patient_namespace.route('/register')
class PatientRegister(UserRegister):
    """Handles patient registration."""

    def __init__(self, *args, **kwargs):
        super().__init__(model=Patient, role="patient")


@patient_namespace.route('/login')
class PatientLogin(UserLogin):
    """Handles patient login."""

    def __init__(self, *args, **kwargs):
        super().__init__(model=Patient, role="patient")
