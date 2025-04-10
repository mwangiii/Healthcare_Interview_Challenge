import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth/AuthContext";

const Doctors = () => {
  interface Doctor {
    doctor_id: string;
    firstname: string;
    lastname: string;
    specialization?: string;
  }

  interface DoctorDetails {
    doctor_id: string;
    firstname: string;
    lastname: string;
    specialization?: string;
    availability_start?: string;
    availability_end?: string;
    days_available?: string[];
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { authToken } = useAuth();

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.data || []);
        setLoading(false);
      } else {
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    } catch (error) {
      setError(`An error occurred while fetching doctors: ${error}`);
      setLoading(false);
    }
  }, [authToken]);

  const fetchDoctorDetails = useCallback(async (doctorId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/doctors/${doctorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctorDetails(data.data);
      } else {
        console.error("Failed to fetch doctor details");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    } finally {
      setDetailsLoading(false);
    }
  }, [authToken]);

  const toggleDoctorDetails = (doctorId: string) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null);
      setDoctorDetails(null);
    } else {
      setExpandedDoctor(doctorId);
      fetchDoctorDetails(doctorId);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (doctors.length === 0) return <p>No doctors available.</p>;

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) return "N/A";
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days: string[] | undefined) => {
    if (!days || days.length === 0) return "Not specified";
    return days.join(", ");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Our Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.doctor_id}
            className="border-l-4 border-medical-primary p-4 rounded-lg bg-gray-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => toggleDoctorDetails(doctor.doctor_id)}
          >
            <h4 className="font-semibold mb-1">
              {doctor.firstname} {doctor.lastname}
            </h4>
            <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full">
              {doctor.specialization || "General"}
            </div>
            
            {expandedDoctor === doctor.doctor_id && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                {detailsLoading ? (
                  <p className="text-sm text-gray-500">Loading availability...</p>
                ) : doctorDetails ? (
                  <div className="text-sm">
                    <h5 className="font-medium mb-2">Availability</h5>
                    <p className="mb-1">
                      <span className="font-medium">Hours:</span> {formatTime(doctorDetails.availability_start)} - {formatTime(doctorDetails.availability_end)}
                    </p>
                    <p>
                      <span className="font-medium">Days:</span> {formatDays(doctorDetails.days_available)}
                    </p>
                    <button 
                      className="mt-3 px-3 py-1 bg-medical-primary text-white rounded-md text-sm hover:bg-opacity-90"
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No availability information found</p>
                )}
              </div>
            )}
            
            {expandedDoctor !== doctor.doctor_id && (
              <div className="mt-2 text-sm text-medical-primary font-medium">
                Click to view availability
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;