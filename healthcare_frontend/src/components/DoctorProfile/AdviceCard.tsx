import React from 'react';
import { ExternalLink } from 'lucide-react';

const AdviceCard: React.FC = () => {
  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-gray-700 mb-6">Advice</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          The doctor service is online available on a 24-hour basis
        </p>
        
        <div className="text-sm">
          <span className="text-gray-500">More info via the</span>
          <div className="flex items-center text-medical-primary mt-1">
            <span className="font-medium">HealthCare.mobile</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-medical-primary rounded-full mr-2"></div>
            <span className="text-xs text-gray-500">Doctor Advice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;
