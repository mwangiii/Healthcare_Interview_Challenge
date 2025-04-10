import React, { useState } from 'react';
import SignUp from '../components/Auth/PatientAuth/PatientSignUp';
import Login from '../components/Auth/PatientAuth/PatientLogin';

const PatientAuthForm: React.FC = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  const toggleForm = () => setIsLoginPage(prev => !prev);

  return (
    <div className="flex flex-col w-[1000px] items-center justify-center mt-12 box-border">
      <div className="relative flex w-[800px] overflow-hidden mr-5 rounded-[30px] bg-gray-100 shadow-lg">
        <div className="relative p-5 transition-all duration-500 ease-in-out">
          <h1 className="text-2xl font-bold mb-4">{isLoginPage ? 'Log In' : 'Sign Up'}</h1>
          {isLoginPage ? <Login /> : <SignUp onSuccess={toggleForm} />}
        </div>

        <div className="absolute top-0 left-[65%] w-[35%] h-full p-2.5 flex flex-col justify-center items-center text-center uppercase rounded-[200px_0_0_200px] transition-all duration-500 ease-in-out bg-gradient-to-r from-sky-100 to-medical-primary">
          <h1 className="text-lg font-bold">{isLoginPage ? 'Welcome Back!' : 'Hello Friend!'}</h1>
          <p className="text-sm mt-2">
            {isLoginPage
              ? 'Enter your personal details to use this site'
              : 'Register with your personal details to get started'}
          </p>
          <button
            onClick={toggleForm}
            className="mt-2 py-2 w-[150px] border border-white bg-medical-primary text-white rounded-md hover:bg-cyan-800 transition"
          >
            {isLoginPage ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAuthForm;
