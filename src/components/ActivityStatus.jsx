import { useState, useEffect } from 'react';

export default function ActivityStatus() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const updateStatus = () => {
      // Get current hour in UTC+5 (Uzbekistan Time)
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const uzTime = new Date(utc + (3600000 * 5));
      const hour = uzTime.getHours();

      if (hour >= 0 && hour < 7) setStatus('Sleeping... 😴');
      else if (hour >= 7 && hour < 8) setStatus('Waking up & Breakfast ☕');
      else if (hour >= 8 && hour < 9) setStatus('On the way to school 🚌');
      else if (hour >= 9 && hour < 13) setStatus('At School / Learning 📚');
      else if (hour >= 13 && hour < 14) setStatus('Lunch Time 🍱');
      else if (hour >= 14 && hour < 18) setStatus('Coding & Building Projects 💻');
      else if (hour >= 18 && hour < 19) setStatus("Solving Rubik's Cube / Chess 🧩");
      else if (hour >= 19 && hour < 20) setStatus('Dinner Time 🍕');
      else if (hour >= 20 && hour < 22) setStatus('Listening to Music & Relaxing 🎧');
      else setStatus('Bored / Late Night Coding 🌙');
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center space-x-3 bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark px-5 py-3 rounded-full shadow-sm backdrop-blur-md hover:border-accent transition-colors duration-300">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#08CB00] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#08CB00]"></span>
      </span>
      <span className="text-sm font-bold font-martian tracking-wider text-primary-text dark:text-primary-text-dark opacity-90">{status}</span>
    </div>
  );
}
