import React from 'react';
import { User, Users, Calendar, BarChart, Heart, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import ProfileCard from './ProfileCard';
import NotificationsCard from './NotificationsCard';
import ExaminationsCard from './ExaminationsCard';
import HealthCurveCard from './HealthCurveCard';
import TreatmentCard from './TreatmentCard';
import AdviceCard from './AdviceCard';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-medical-secondary">
      {/* Sidebar */}
      <div className="w-[100px] bg-medical-primary flex flex-col items-center py-6 text-white">
        <div className="sidebar-icon mb-10">
          <Heart className="h-6 w-6" />
        </div>
        
        <div className="flex flex-col items-center gap-8 mt-4">
          <div className="sidebar-icon opacity-100">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Doctor</span>
          </div>
          
          <div className="sidebar-icon opacity-60 hover:opacity-100 transition-opacity">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Contact</span>
          </div>
          
          <div className="sidebar-icon opacity-60 hover:opacity-100 transition-opacity">
            <BarChart className="h-6 w-6" />
            <span className="text-xs mt-1">Tracker</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <ProfileCard />
            <NotificationsCard />
          </div>
          
          {/* Right Column */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            <ExaminationsCard />
            <HealthCurveCard />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TreatmentCard />
              <AdviceCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;