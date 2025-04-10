import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../Auth/AuthContext";

const Profile = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profile, setProfile] = useState({
    employee_id: "",
    firstname: "",
    lastname: "",
    specialization: "",
    image: "",
    email: "",
    phone: "",
  });

  // Fetch profile data function wrapped in useCallback
  const fetchProfile = useCallback(async () => {
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

      if (response.ok) {
        if (result.status === "success") {
          setProfile({
            employee_id: result.data.employee_id || "",
            firstname: result.data.firstname || "",
            lastname: result.data.lastname || "",
            specialization: result.data.specialization || "",
            image: result.data.image || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
          });

          if (result.data.image) {
            setProfileImage(result.data.image);
          }
        } else {
          setError("Failed to load profile data");
        }
      } else {
        setError("Failed to load profile data");
      }
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      phone: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
    setError(null);
    setSuccessMessage(null);
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      let imageData = profile.image;

      // If a new image has been selected, convert it to base64
      if (imageFile) {
        try {
          // Convert image to base64 string for API
          imageData = await convertImageToBase64(imageFile);
        } catch {
          setError("Failed to process image. Please try again.");
          return;
        }
      }

      // Update profile with new data
      const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/doctors/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          image: imageData,
          phone: profile.phone,
          // Keep other fields unchanged
          firstname: profile.firstname,
          lastname: profile.lastname,
          specialization: profile.specialization,
        }),
      });

      const updateResult = await updateResponse.json();

      if (updateResponse.ok && updateResult.status === "success") {
        setSuccessMessage("Profile updated successfully");
        setProfileImage(imageData);
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(null);
        
        // Refresh profile data
        fetchProfile();
      } else {
        setError(updateResult.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-medical-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600 mt-1">View and update your profile details.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="bg-medical-primary text-white px-4 py-2 rounded hover:bg-medical-dark transition-colors"
            type="button"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="mb-6 flex flex-col items-center">
          <div 
            className={`w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center relative ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={isEditing ? triggerFileInput : undefined}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-gray-400">
                {profile.firstname ? profile.firstname.charAt(0).toUpperCase() : "?"}
              </span>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            )}
          </div>
          
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-medical-primary text-sm hover:underline mb-4"
              >
                Upload new image
              </button>
            </>
          )}
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                name="doctor_id"
                value={profile.employee_id}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstname"
                value={profile.firstname}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={profile.lastname}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handlePhoneChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-medical-primary`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-dark transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;