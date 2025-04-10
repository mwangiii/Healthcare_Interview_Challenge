import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PatientDashboard from './components/PatientProfile/PatientDashBoard';
import DoctorDashboard from './components/DoctorProfile/DoctorDashBoard';
import PatientAuthForm from './pages/PatientAuthform';
import DoctorAuthForm from './pages/DoctorAuthForm';
import BookAppointmentPage from './pages/BookAppointmentPage';
import LandingPage from './pages/LandingPage';

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-auth" element={<PatientAuthForm />} /> 
          <Route path="/doctor-auth" element={<DoctorAuthForm />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
        </Routes>
      </Router>
    </>
    )
}

export default App
