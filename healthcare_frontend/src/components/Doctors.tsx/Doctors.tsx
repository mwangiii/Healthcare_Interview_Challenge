import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";

const Doctors = () => {
  interface Doctor {
    id: string;
    name: string;
    photo?: string;
    specialization?: string;
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  const fetchDoctors = async () => {
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
        setDoctors(data.data.doctors);
        setLoading(false);
      } else {
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    } catch (error) {
      setError(`An error occurred while fetching doctors: ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (doctors.length === 0) return <p>No doctors available.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Our Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="border-l-4 border-medical-primary p-3 rounded-lg bg-gray-50"
          >
            <img
              src={doctor.photo || "https://via.placeholder.com/150"}
              alt={doctor.name}
              className="w-16 h-16 rounded-full mb-4"
            />
            <h4 className="font-semibold mb-1">{doctor.name}</h4>
            <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full">
              {doctor.specialization || "General"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
