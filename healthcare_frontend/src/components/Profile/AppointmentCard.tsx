import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
// import { ArrowRight } from 'lucide-react';

interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
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
          Authorization: `Bearer ${authToken}`,
        },
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
    if(authToken) {
    fetchAppointments();
    }
  }, [fetchAppointments, authToken]);

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Appointments</h3>
        {/* <button className="text-xs text-medical-primary flex items-center">
          See All
          <ArrowRight className="w-3 h-3 ml-1" />
        </button> */}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map((appt) => (
          <div
            key={appt.appointmentId}
            className="border-l-4 border-medical-primary p-3 rounded-lg bg-gray-50"
          >
            <div className="text-xs text-gray-500 mb-2">{appt.date}</div>
            <div className="text-xs font-bold  mb-2">{appt.time}</div>
            <h4 className="font-semibold mb-1">Appointment</h4>
            <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full">
              {appt.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCard;
