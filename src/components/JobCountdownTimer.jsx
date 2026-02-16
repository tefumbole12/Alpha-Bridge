
import React, { useState, useEffect } from 'react';
import { getTimeUntilDeadline } from '@/services/jobsService';
import { Clock } from 'lucide-react';

const JobCountdownTimer = ({ deadline, className }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilDeadline(deadline));

  useEffect(() => {
    if (!deadline) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilDeadline(deadline));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) return null;

  if (timeLeft.expired) {
    return (
      <div className={`text-red-600 font-bold flex items-center gap-1 ${className}`}>
        <Clock className="w-4 h-4" /> Closed
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 text-[#003D82] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm ${className}`}>
      <Clock className="w-4 h-4" />
      <span>
        {timeLeft.days} days, {timeLeft.hours} hours remaining
      </span>
    </div>
  );
};

export default JobCountdownTimer;
