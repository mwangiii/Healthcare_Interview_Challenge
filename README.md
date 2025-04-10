# TIBERBU Healthcare Challenge

This project is a full-stack healthcare application designed to manage patient and doctor profiles, appointments, and other healthcare-related functionalities. The application consists of a **React TypeScript** frontend and a **Flask** backend.

## Live Application

You can access the live application here: [TIBERBU Healthcare App](https://healthcare-frontend-virid.vercel.app/)

The backend is hosted on **Koyeb** and is available in a duplicated repository: [Backend Repository](https://github.com/mwangiii/backend-health-care-interview-challenge)

The documentation is on:https://wide-koi-kevinwangi-5f264f79.koyeb.app/api/docs
---

## Project Structure

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

### Backend
- **Framework**: Flask
- **Database**: SQLAlchemy
- **Authentication**: Flask-JWT-Extended
- **Caching**: Flask-Caching with Redis
- **Hosting**: Koyeb

---

## GETTING STARTED

### BACKEND SETUP

1. Clone the backend repository:
   ```bash
   git clone https://github.com/mwangiii/Healthcare_Interview_Challenge
   cd healthcare-backend
   ```
2. Create and activate a virtual environment:
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    ```
3. Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
4. Run the Flask application:
  ```bash
  python run.py
  ```
_The backend will be available at http://127.0.0.1:5000._

## FRONTEND SETUP
1. Clone the frontend repository:
  ```bash
  git clone https://github.com/mwangiii/Healthcare_Interview_Challenge
  cd healthcare_frontend
  ```
2. Install dependencies:
  ```bash
  yarn install
  ```
3. Start the development server:
  ```bash
  yarn dev
  ```
_The frontend will be available at http://127.0.0.1:5173._

## FEATURES
FRONTEND  
**Authentication**: Separate login and signup for patients and doctors.  
**Profile Management**: Patients and doctors can view and update their profiles.  
**Appointments**: Patients can book appointments with doctors.  
**Responsive Design**: Optimized for both desktop and mobile devices.  
BACKEND  
**RESTful API**: Endpoints for managing users, appointments, and profiles.  
**Caching**: Redis caching for frequently accessed data.  
**JWT Authentication**: Secure token-based authentication.  
**Swagger Documentation**: API documentation available at _/api/docs._  


