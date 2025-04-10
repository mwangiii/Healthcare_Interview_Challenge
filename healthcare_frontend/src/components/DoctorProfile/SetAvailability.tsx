import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SetAvailability: React.FC = () => {
  const { authToken } = useAuth();
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [daysAvailable, setDaysAvailable] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleCheckboxChange = (day: string) => {
    setDaysAvailable((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      availability_start: availabilityStart,
      availability_end: availabilityEnd,
      days_available: daysAvailable
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/doctors/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Availability updated successfully.');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch {
      setMessage('Failed to update availability.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Set Your Availability</h2>
      {message && <div className="mb-4 text-center text-sm text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">End Time</label>
          <input
            type="time"
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Days Available</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={daysAvailable.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default SetAvailability;
