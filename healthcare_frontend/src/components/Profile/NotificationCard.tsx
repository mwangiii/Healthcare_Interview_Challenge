import React from 'react';
import { Clock, Plus } from 'lucide-react';

const NotificationsCard: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} Aug ${currentDate.getFullYear()}`;
  
  return (
    <div className="space-y-6">
      <div className="medical-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">Notifications</h3>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start">
              <div className="h-2 w-2 bg-medical-warning rounded-full mt-1.5 mr-2"></div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">Kognum</h4>
                  <span className="ml-auto text-xs text-gray-500">10mg</span>
                </div>
                
                <div className="flex text-xs text-gray-500 mt-1">
                  <span className="px-1 py-0.5 bg-gray-200 rounded mr-1">MON</span>
                  <span className="px-1 py-0.5 bg-gray-200 rounded mr-1">WED</span>
                  <span className="px-1 py-0.5 bg-gray-200 rounded mr-1">FRI</span>
                  <span className="px-1 py-0.5 bg-gray-200 rounded mr-1">SUN</span>
                </div>
                
                <p className="text-xs text-gray-600 mt-2">
                  <Clock className="inline-block w-3 h-3 mr-1" />
                  <span>2 times a day before food</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 p-3 rounded-lg">
            <div className="flex">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <img 
                  src="/lovable-uploads/c9f97cc7-e70a-4565-973d-7d50429b695d.png" 
                  alt="Dr. Isabella Rogers" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm">Dr. Isabella Rogers</h4>
                <p className="text-xs text-gray-500">Cardiologist Hospital Medical Center</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium">Surgeon</h5>
              <p className="text-xs text-gray-500">Appointment</p>
            </div>
            
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">{formattedDate}</span>
              <span className="text-xs text-gray-500">12:45 AM</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-medical-accent text-white p-3 rounded-lg">
              <h4 className="font-medium mb-1 text-sm">Insurance Card</h4>
              <p className="text-xs opacity-80">1234 5678 9012 3456</p>
              <p className="text-xs mt-2 opacity-80">Valid until 06/24</p>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center">
              <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center mb-1">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-500">Add card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCard;
