import React from 'react';

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
          <span className="text-sm text-gray-500">
            You have no new notifications.
          </span>
        </div>
        </div>
      </div>
  );
};

export default NotificationsCard;
