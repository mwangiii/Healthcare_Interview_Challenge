import { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';

const Profile = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    weight: '',
    height: '',
    blood_group: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          setProfile({
            image: result.data.image || '',
            name: result.data.name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            age: result.data.age?.toString() || '',
            weight: result.data.weight?.toString() || '',
            height: result.data.height?.toString() || '',
            blood_group: result.data.blood_group || ''
          });

          if (result.data.image) setProfileImage(result.data.image);
          setIsNewProfile(!result.data.name || !result.data.email);
        } else if (response.status === 404) {
          setIsNewProfile(true);
        } else {
          setError('Failed to load profile data');
        }
      } catch {
        setError('An error occurred while loading your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        setProfile((prev) => ({ ...prev, image: base64String }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const profileData = {
        ...profile,
        age: profile.age ? parseInt(profile.age, 10) : null,
        weight: profile.weight ? parseFloat(profile.weight) : null,
        height: profile.height ? parseFloat(profile.height) : null
      };

      const method = isNewProfile ? 'POST' : 'PUT';

      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/profile`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(isNewProfile ? 'Profile created successfully!' : 'Profile updated successfully!');
        setIsNewProfile(false);
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch{
      setError('An error occurred while saving your profile');
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (successMessage) {
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-medical-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNewProfile ? 'Complete Your Profile' : 'Your Profile'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isNewProfile
            ? 'Please complete your profile information to get started.'
            : 'Update your personal information and medical details.'}
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-gray-400">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </div>
          <label className="cursor-pointer bg-medical-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="0"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Medical Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                name="blood_group"
                value={profile.blood_group}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-medical-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
