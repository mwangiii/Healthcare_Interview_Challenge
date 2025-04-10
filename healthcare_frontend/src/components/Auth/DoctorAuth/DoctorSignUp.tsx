import React, { useState } from 'react';
import usePasswordToogle from '../usePasswordToogle';
import { useToast } from '../../../hooks/use-toast';

interface SignUpProps {
  onSuccess: () => void;
}

const DoctorSignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });

  const [PasswordInputType, Icon, toggleVisibility] = usePasswordToogle();
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.'
      });
      return;
    }

    try {
      const signUpResponse = await fetch(`${import.meta.env.VITE_API_URL}/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          email: formData.email,
          specialization: formData.specialization,
          password: formData.password
        })
      });

      const result = await signUpResponse.json();

      if (!signUpResponse.ok) {
        if (result.errors) {
          setErrors(result.errors.map((err: { field: string; message: string }) => `${err.field}: ${err.message}`));
        } else {
          setErrors(['Something went wrong. Please try again later.']);
        }
      } else {
        toast({
          title: 'Sign up successful!',
          description: 'You can now log in to your account.'
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setErrors(['Something went wrong. Please try again later.']);
    }
  };

  return (
    <div id="DoctorSignUp" className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <div className="flex flex-row space-x-2">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className="m-1 p-4 w-[130px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="m-1 p-4 w-[130px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition"
              required
            />
          </div>

          <div className="flex flex-col mt-4 h-[60vh]">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="m-1 p-4 w-[300px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="m-1 p-4 w-[300px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition"
              required
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="m-1 p-4 w-[300px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition"
              required
            />

            <div className="relative">
              <input
                type={PasswordInputType}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="m-1 p-4 w-[300px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition pr-12"
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
                className="m-1 p-4 w-[300px] border border-gray-300 rounded-md shadow-md focus:shadow-lg focus:ring-2 focus:ring-medical-primary transition pr-12"
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
                className="mt-4 w-[150px] p-3 rounded-md text-white bg-medical-primary hover:bg-cyan-800 transition border border-white"
              >
                Sign up
              </button>
            </div>

            {errors.length > 0 && (
              <div className="mt-4 text-red-500 text-center text-sm">
                {errors.map((error, idx) => (
                  <p key={idx}>{error}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorSignUp;
