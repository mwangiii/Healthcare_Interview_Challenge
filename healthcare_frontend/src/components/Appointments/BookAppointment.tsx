import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const BookAppointment = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  interface Doctor {
    doctor_id: string;
    firstname: string;
    lastname: string;
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/doctors/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data.data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to fetch doctors. Please try again.');
      }
    };

    fetchDoctors();
  }, [authToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.doctor) newErrors.doctor = 'Doctor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/book`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          doctor: formData.doctor || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      <div className="mb-4">
        <label className="text-gray-600">Select Doctor</label>
        <select
          name="doctor"
          value={formData.doctor}
          onChange={handleInputChange}
          className="bg-gray-100 rounded-md p-3 w-full mt-1 outline-none"
        >
          <option value="">Please select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {`${doctor.firstname} ${doctor.lastname}`}
            </option>
          ))}
        </select>
        {errors.doctor && <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>}
      </div>

      <div className="mb-4">
        <label className="text-gray-600">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="bg-gray-100 rounded-md p-3 w-full mt-1 outline-none"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <div className="mb-4">
        <label className="text-gray-600">Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          className="bg-gray-100 rounded-md p-3 w-full mt-1 outline-none"
        />
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-md w-full"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookAppointment;
