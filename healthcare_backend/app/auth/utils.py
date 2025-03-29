import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_jwt_token(user_id, role):
  """
  Generate a JWT token for a user.
  
  Args:
      user_id (int): The ID of the user (patient, doctor, or admin).
      role (str): The role of the user ("patient", "doctor", or "admin").
  
  Returns:
  """
  try:
      payload = {
          "exp": datetime.utcnow() + timedelta(hours=1),
          "iat": datetime.utcnow(),
          "sub": str(user_id),
          "role": role
      }
      jwt_token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")
      return jwt_token
  except Exception as e:
      print(f"JWT Generation Error: {e}")
      return None
