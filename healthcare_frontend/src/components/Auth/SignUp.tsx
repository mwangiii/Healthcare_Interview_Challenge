import React, { useState } from 'react';
import usePasswordToogle from './usePasswordToogle';

interface SignUpProps {
  onSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });
  const [PasswordInputType, Icon, toggleVisibility] = usePasswordToogle();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Account created successfully. Please log in.');
        onSuccess();
      } else {
        const data = await response.json();
        alert(`Signup failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div id="SignUp" className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <div className="flex flex-row space-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="m-1 p-4 w-[130px] border border-gray-300 rounded-full"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="m-1 p-4 w-[130px] border border-gray-300 rounded-full"
              required
            />
          </div>

          <div className="flex flex-col mt-4 h-[60vh]">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="m-1 p-4 w-[300px] border border-gray-300 rounded-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="m-1 p-4 w-[300px] border border-gray-300 rounded-full"
              required
            />

            <div className="relative">
              <input
                type={PasswordInputType}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="m-1 p-4 w-[300px] border border-gray-300 rounded-full pr-12"
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleVisibility}
              >
                <Icon className="w-5 h-5 text-gray-500" />
              </span>
            </div>

            <div className="relative">
              <input
                type={PasswordInputType}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="m-1 p-4 w-[300px] border border-gray-300 rounded-full pr-12"
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleVisibility}
              >
                <Icon className="w-5 h-5 text-gray-500" />
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-700 text-center">
              I agree with the terms and policy
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 w-[150px] p-3 rounded-full text-white bg-medical-primary hover:bg-cyan-800 transition border border-white"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
