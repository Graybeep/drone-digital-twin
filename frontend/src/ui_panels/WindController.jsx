import React, { useState } from 'react';
import { Wind, CloudLightning, Sun } from 'lucide-react';

export default function WindController() {
  const [activeWeather, setActiveWeather] = useState('calm'); // calm, mild, storm

  const triggerWind = (mode) => {
    setActiveWeather(mode);
    
    let vx = 0;
    let vy = 0;
    let intensity = 0;

    if (mode === 'mild') {
       vx = 2.0; // 2 m/s
       vy = 1.0;
       intensity = 0.5; // low turbulence
    } else if (mode === 'storm') {
       vx = 8.0; // 8 m/s strong wind
       vy = 4.0;
       intensity = 3.0; // high turbulence
    }

    fetch('http://localhost:8000/api/wind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vx, vy, intensity })
    }).catch(e => console.error("Wind API Error", e));
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col shadow-xl">
       <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border-l-2 border-cyan-500 pl-2 mb-3">
         <Wind size={12} className="text-cyan-500"/> Environment Simulator
       </span>
       
       <div className="grid grid-cols-3 gap-2 h-full">
         <button 
            onClick={() => triggerWind('calm')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${activeWeather === 'calm' ? 'bg-amber-900/50 border-amber-500/50 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
         >
            <Sun size={18} className="mb-1" />
            <span className="text-[9px] font-bold">CALM</span>
         </button>
         
         <button 
            onClick={() => triggerWind('mild')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${activeWeather === 'mild' ? 'bg-cyan-900/50 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
         >
            <Wind size={18} className="mb-1" />
            <span className="text-[9px] font-bold">MILD BREEZE</span>
         </button>

         <button 
            onClick={() => triggerWind('storm')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${activeWeather === 'storm' ? 'bg-rose-900/50 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
         >
            <CloudLightning size={18} className="mb-1" />
            <span className="text-[9px] font-bold">STORM GUSTS</span>
         </button>
       </div>
    </div>
  );
}
