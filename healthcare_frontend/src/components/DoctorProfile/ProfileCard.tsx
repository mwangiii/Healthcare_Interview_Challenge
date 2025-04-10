import React, { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';
import { useAuth } from "../Auth/AuthContext";

interface ProfileData {
  image: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  employee_id: number;
  specialization: string;
}

const ProfileCard: React.FC = () => {
  const { authToken } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/doctors/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          setProfile(result.data);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  if (loading) {
    return (
      <div className="medical-card">
        <div className="flex flex-col items-center p-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-5 w-32 bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-4 w-40 bg-gray-100 animate-pulse mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="medical-card">
        <div className="flex flex-col items-center p-4">
          <p className="text-gray-500">Unable to load profile</p>
        </div>
      </div>
    );
  }

  // Get first letter of firstname for placeholder image
  const getInitial = () => {
    return profile.firstname ? profile.firstname.charAt(0).toUpperCase() : "P";
  };

  return (
    <div className="medical-card">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-medical-primary">
          {profile.image ? (
            <img
              src={profile.image}
              alt={`${profile.firstname} ${profile.lastname}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-medical-light flex items-center justify-center text-medical-primary font-bold text-2xl">
              {getInitial()}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold">{`${profile.firstname} ${profile.lastname}`}</h3>
        <p className="text-sm text-gray-500">
          Employee ID: {profile.employee_id}
        </p>
        <div className="grid grid-cols-1 w-full mt-6 gap-2">
          <div className="text-center p-2">
            <div className="bg-medical-light p-2 rounded-lg mb-2 flex justify-center">
              <Droplets className="h-5 w-5 text-medical-primary" />
            </div>
            <p className="text-xs text-gray-500">Specialization</p>
            <p className="font-semibold">{profile.specialization || "Not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;