import React, { useState } from 'react';
import { Heart, UserCircle, Calendar } from 'lucide-react';

import Profile from "./Profile";
import ProfileCard from './ProfileCard';
import NotificationsCard from './NotificationCard';
import ExaminationsCard from './AppointmentCard';
import SetAvailability from './SetAvailability'; // Import the SetAvailability component

const DoctorDashboard: React.FC = () => {
  const [section, setSection] = useState<'home' | 'profile' | 'availability'>('home');

  return (
    <div className="flex min-h-screen bg-medical-secondary">
      {/* Sidebar */}
      <div className="w-[100px] bg-medical-primary flex flex-col items-center py-6 text-white">
        {/* Sidebar Icons */}
        <div className="flex flex-col items-center gap-8 mt-4">
          <div onClick={() => setSection('home')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <Heart className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Home</span>
          </div>

          <div onClick={() => setSection('profile')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <UserCircle className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </div>

          <div onClick={() => setSection('availability')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Availability</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto">
        {section === 'home' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 space-y-6">
              <ProfileCard />
              <NotificationsCard />
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <ExaminationsCard />
            </div>
          </div>
        )}
        {section === 'profile' && <Profile />}
        {section === 'availability' && <SetAvailability />}
      </div>
    </div>
  );
};

export default DoctorDashboard;
