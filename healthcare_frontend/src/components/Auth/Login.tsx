import React, { useState } from 'react';
import { GoalIcon as GoogleIcon } from 'lucide-react';
import usePasswordToogle from './usePasswordToogle';
import { useNavigate } from 'react-router-dom';

const LogIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [PasswordInputType, Icon, toggleVisibility] = usePasswordToogle();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Logged in with', email, password);
    navigate('/dashboard');
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
          className="m-1 p-4 w-[250px] rounded-full border border-gray-300"
        />
        <div className="relative w-[250px] m-1">
          <input
            type={PasswordInputType}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 w-full rounded-full border border-gray-300 pr-12"
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
          className="mt-4 w-[150px] p-3 rounded-full text-white bg-medical-primary hover:bg-cyan-800 transition border border-white"
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
