import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './components/Profile/DashBoard'
import AuthForm from './pages/Authform';

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} /> 
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
    )
}

export default App
