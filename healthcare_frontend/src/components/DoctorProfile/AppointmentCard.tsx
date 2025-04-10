import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';

interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string | null;
  date: string;
  time: string;
  status: string;
}

const AppointmentCard: React.FC = () => {
  const { authToken } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = React.useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAppointments(result.data.appointments || []);
      } else {
        setError('Failed to fetch appointments');
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      setError('An error occurred while fetching appointments');
      console.error('Error fetching appointments:', error);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchAppointments();
    }
  }, [fetchAppointments, authToken]);

  const handleDelete = async (appointmentId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/cancel/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        setAppointments(appointments.filter((appt) => appt.appointmentId !== appointmentId));
        alert('Appointment cancelled successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to cancel appointment:', errorData.message);
        alert(errorData.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('An error occurred while cancelling the appointment.');
    }
  };

  const handleReschedule = async (appointmentId: string) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM):');

    if (!newDate || !newTime) {
      alert('Date and time are required to reschedule an appointment.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/reschedule/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ date: newDate, time: newTime })
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt.appointmentId === appointmentId ? { ...appt, ...updatedAppointment.data } : appt
          )
        );
        alert('Appointment rescheduled successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to reschedule appointment:', errorData.message);
        alert(errorData.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      alert('An error occurred while rescheduling the appointment.');
    }
  };

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Appointments</h3>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map((appt) => (
          <div
            key={appt.appointmentId}
            className="border-l-4 p-3 rounded-lg bg-gray-50 border-medical-primary"
          >
            <div className="text-xs text-gray-500 mb-2">{appt.date}</div>
            <div className="text-xs font-bold mb-2">{appt.time}</div>
            <h4 className="font-semibold mb-1">Appointment</h4>
            <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full mb-2">
              {appt.status}
            </div>
            <div className="flex justify-between mt-2">
              <button
                className="text-xs text-red-500"
                onClick={() => handleDelete(appt.appointmentId)}
              >
                Cancel
              </button>
              <button
                className="text-xs text-medical-primary"
                onClick={() => handleReschedule(appt.appointmentId)}
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCard;
