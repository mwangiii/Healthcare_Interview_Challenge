from flask_restx import Namespace
from app.doctors.models import Doctor
from app.auth.routes import UserRegister, UserLogin

doctor_namespace = Namespace('doctors', description='Doctors related operations')


@doctor_namespace.route('/register')
class DoctorRegister(UserRegister):
    """
    Handles doctor registration.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")


@doctor_namespace.route('/login')
class DoctorLogin(UserLogin):
    """
    Handles doctor login.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(model=Doctor, role="doctor")
