import React, { useState } from 'react';
import { GoalIcon as GoogleIcon } from 'lucide-react';
import usePasswordToogle from '../usePasswordToogle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { toast } from '../../../hooks/use-toast';

const LogIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [PasswordInputType, Icon, toggleVisibility] = usePasswordToogle();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const LoginResponse = await fetch(`${import.meta.env.VITE_API_URL}/doctors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          employee_id: parseInt(employeeId, 10),
          password
        })
      });

      if (LoginResponse.ok) {
        const data = await LoginResponse.json();
        const token = data.data.accessToken;
        login(token);

        toast({
          title: 'Login successful!',
          description: 'Redirecting to your dashboard...'
        });

        navigate('/doctor-dashboard');
      } else {
        const errorData = await LoginResponse.json();
        const message = errorData?.message?.toLowerCase();

        if (message.includes('not found')) {
          toast({
            title: 'Login Failed',
            description: 'Doctor not found!'
          });
        } else if (message.includes('password') || message.includes('email')) {
          toast({
            title: 'Login Failed',
            description: 'Wrong password, email, or employee ID!'
          });
        } else {
          toast({
            title: 'Login Failed',
            description: 'Please check your credentials.'
          });
        }
      }
    } catch {
      toast({
        title: 'Something went wrong!',
        description: 'Please try again later.'
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div id="Login" className="flex flex-col items-center justify-center mt-6">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          name="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="m-1 p-4 w-[250px] border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="EmployeeId"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="m-1 p-4 w-[250px] border border-gray-300 rounded-md"
        />
        <div className="relative w-[250px] m-1">
          <input
            type={PasswordInputType}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 w-full border border-gray-300 rounded-md pr-12"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleVisibility}
          >
            <Icon className="w-5 h-5 text-gray-500" />
          </span>
        </div>
        <p className="text-sm mt-2 text-gray-600 flex justify-between w-[250px]">
          <span>Remember me</span>
          <span className="cursor-pointer hover:underline">Forgot password</span>
        </p>
        <button
          type="submit"
          className="mt-4 w-[150px] p-3 rounded-md text-white bg-medical-primary hover:bg-cyan-800 transition border border-white"
        >
          Log In
        </button>
        <p className="flex items-center gap-2 mt-4 text-gray-700">
          <span>Sign in with Google:</span>
          <GoogleIcon className="w-5 h-5" />
        </p>
      </form>
    </div>
  );
};

export default LogIn;
