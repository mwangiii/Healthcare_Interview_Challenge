import React, { useState } from 'react';
import { User, Users, BarChart, Heart } from 'lucide-react';
import ProfileCard from './ProfileCard';
import HealthCurveCard from './HealthCurveCard';
import AdviceCard from './AdviceCard';
import NotificationsCard from './NotificationCard';
import ExaminationsCard from './AppointmentCard';
import TreatmentCard from '../../TreatmentCard';
import DoctorPage from '../../pages/DoctorsPage';
import ContactPage from '../../pages/ContactPage';
import TrackerPage from '../../pages/TrackerPage';

const Dashboard: React.FC = () => {
  const [section, setSection] = useState<'home' | 'doctors' | 'contact' | 'tracker'>('home');

  return (
    <div className="flex min-h-screen bg-medical-secondary">
      {/* Sidebar */}
      <div className="w-[100px] bg-medical-primary flex flex-col items-center py-6 text-white">
        <div className="sidebar-icon mb-10" onClick={() => setSection('home')}>
          <Heart className="h-6 w-6" />
        </div>

        <div className="flex flex-col items-center gap-8 mt-4">
          <div onClick={() => setSection('doctors')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <User className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Doctor</span>
          </div>

          <div onClick={() => setSection('contact')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Contact</span>
          </div>

          <div onClick={() => setSection('tracker')} className="cursor-pointer">
            <div className="sidebar-icon opacity-100">
              <BarChart className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Tracker</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto">
        {section === 'home' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Home page content */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              <ProfileCard />
              <NotificationsCard />
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <ExaminationsCard />
              <HealthCurveCard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TreatmentCard />
                <AdviceCard />
              </div>
            </div>
          </div>
        )}
        {section === 'doctors' && <DoctorPage />}
        {section === 'contact' && <ContactPage />}
        {section === 'tracker' && <TrackerPage />}
      </div>
    </div>
  );
};

export default Dashboard;