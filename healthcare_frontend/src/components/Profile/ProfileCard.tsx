import React from 'react';
import { Droplets } from 'lucide-react';

const ProfileCard: React.FC = () => {
  return (
    <div className="medical-card">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-medical-primary">
          <img 
            src="/lovable-uploads/c9f97cc7-e70a-4565-973d-7d50429b695d.png" 
            alt="Bess Willis" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="text-lg font-semibold">Bess Willis</h3>
        <p className="text-sm text-gray-500">29 years, California</p>
        
        <div className="grid grid-cols-3 w-full mt-6 gap-2">
          <div className="text-center p-2">
            <div className="bg-medical-light p-2 rounded-lg mb-2 flex justify-center">
              <Droplets className="h-5 w-5 text-medical-primary" />
            </div>
            <p className="text-xs text-gray-500">Blood Type</p>
            <p className="font-semibold">B</p>
          </div>
          
          <div className="text-center p-2">
            <div className="bg-medical-light p-2 rounded-lg mb-2 flex justify-center">
              <span className="text-medical-primary font-bold">cm</span>
            </div>
            <p className="text-xs text-gray-500">Height</p>
            <p className="font-semibold">170 <span className="text-xs">cm</span></p>
          </div>
          
          <div className="text-center p-2">
            <div className="bg-medical-light p-2 rounded-lg mb-2 flex justify-center">
              <span className="text-medical-primary font-bold">kg</span>
            </div>
            <p className="text-xs text-gray-500">Weight</p>
            <p className="font-semibold">60 <span className="text-xs">kg</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
