import React from 'react';
import { ArrowRight } from 'lucide-react';

const ExaminationsCard: React.FC = () => {
  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Examinations</h3>
        <button className="text-xs text-medical-primary flex items-center">
          See All
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-l-4 border-medical-primary p-3 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">25 Jul 2025</div>
          <h4 className="font-semibold mb-1">Hypertensive crisis</h4>
          <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full">
            Ongoing treatment
          </div>
        </div>
        
        <div className="border-l-4 border-medical-warning p-3 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">19 Jun 2025</div>
          <h4 className="font-semibold mb-1">Osteoporosis</h4>
          <div className="text-xs inline-block px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
            Recovered
          </div>
        </div>
        
        <div className="border-l-4 border-medical-primary p-3 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">25 Apr 2025</div>
          <h4 className="font-semibold mb-1">Hypertensive crisis</h4>
          <div className="text-xs inline-block px-2 py-1 bg-medical-light text-medical-primary rounded-full">
            Examination
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationsCard;