import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: 2015, avg: 70, personal: 65 },
  { year: 2016, avg: 75, personal: 90 },
  { year: 2017, avg: 73, personal: 78 },
  { year: 2018, avg: 78, personal: 62 },
  { year: 2019, avg: 80, personal: 95 },
];

type TimePeriod = 'D' | 'W' | 'M' | 'Y';

const HealthCurveCard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('M');

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Health Curve</h3>
        
        <div className="flex space-x-2">
          {(['D', 'W', 'M', 'Y'] as TimePeriod[]).map((period) => (
            <button
              key={period}
              className={`h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center ${
                selectedPeriod === period
                  ? 'bg-medical-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="avg" 
              stroke="#B8E8E8" 
              strokeWidth={3}
              dot={{ stroke: '#B8E8E8', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ stroke: '#B8E8E8', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="personal" 
              stroke="#0B9A9A" 
              strokeWidth={3}
              dot={{ stroke: '#0B9A9A', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ stroke: '#0B9A9A', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center mt-2 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-xs text-gray-500">Average</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-medical-primary mr-2"></div>
          <span className="text-xs text-gray-500">My Data</span>
        </div>
      </div>
    </div>
  );
};

export default HealthCurveCard;