import React from 'react';
import { ArrowRight } from 'lucide-react';

const TreatmentCard: React.FC = () => {
  const days = [27, 28, 29, 30, 31, 1, 2];
  const currentDay = new Date().getDate();
  
  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Nearest Treatment</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">August 2025</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day) => (
            <div 
              key={day} 
              className={`py-2 rounded-lg text-sm ${
                day === currentDay
                  ? 'bg-medical-primary text-white'
                  : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <div className="w-2 h-10 bg-medical-primary rounded-full mr-3"></div>
        <div>
          <h4 className="font-medium">Abdominal ultrasound</h4>
          <p className="text-xs text-gray-500">Medical center "Healthy Life"</p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;