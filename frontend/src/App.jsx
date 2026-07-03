import React, { useState, useEffect, useRef, useCallback } from 'react';
import DroneCanvas from './digital_twin/DroneCanvas';
import LeftPanel from './ui_panels/LeftPanel';
import RightPanel from './ui_panels/RightPanel';
import BottomPanel from './ui_panels/BottomPanel';
import MLPipeline from './ui_panels/MLPipeline';
import WindController from './ui_panels/WindController';
import RCController from './controller/RCController';

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [flightMode, setFlightMode] = useState('pid');
  
  const historyRef = useRef([]); 
  
  // Throttle backend API calls so we don't overwhelm FastAPI with 60 POSTs per second
  const lastApiCall = useRef(0);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/telemetry');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTelemetry(data);
      
      const now = new Date().getTime();
      const newPoint = {
        time: now,
        roll: data.physics.roll * (180/Math.PI),
        pitch: data.physics.pitch * (180/Math.PI),
        m1: data.motors[0] * 100,
        m2: data.motors[1] * 100,
        m3: data.motors[2] * 100,
        m4: data.motors[3] * 100,
        pid_roll: data.fc ? data.fc.pid_roll_out : 0,
        pid_pitch: data.fc ? data.fc.pid_pitch_out : 0
      };
      
      historyRef.current.push(newPoint);
      if (historyRef.current.length > 100) historyRef.current.shift();
      
      setHistory([...historyRef.current]);
    };

    ws.onclose = () => setTelemetry(null);
    return () => ws.close();
  }, []);

  const handleControlUpdate = useCallback((controlData) => {
    const now = Date.now();
    // Send to backend at ~20Hz (every 50ms)
    if (now - lastApiCall.current > 50) {
      lastApiCall.current = now;
      fetch('http://localhost:8000/api/rc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(controlData)
      }).catch(e => console.error("API Error", e));
    }
  }, []);

  const handleModeChange = (mode) => {
    setFlightMode(mode);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 p-6 flex flex-col font-sans overflow-hidden">
      <header className="mb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Drone Digital Twin</h1>
          <p className="text-slate-400 text-sm mt-1">ML Stabilization Simulation Environment</p>
        </div>
        <div className="flex gap-4">
           <div className={`px-4 py-2 rounded-lg border text-sm font-mono flex items-center gap-2 ${telemetry ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-300' : 'bg-rose-900/50 border-rose-700/50 text-rose-300'}`}>
              <div className={`w-2 h-2 rounded-full ${telemetry ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></div>
              Backend: {telemetry ? 'CONNECTED' : 'DISCONNECTED'}
           </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
             <div className="shrink-0 h-48">
                <LeftPanel telemetry={telemetry} />
             </div>
             <div className="flex-1 min-h-0">
                <MLPipeline telemetry={telemetry} />
             </div>
             {/* Embed the RC Controller beneath the left panel */}
             <div className="shrink-0">
                <RCController 
                   onControlUpdate={handleControlUpdate} 
                   currentMode={flightMode} 
                   onModeChange={handleModeChange} 
                />
             </div>
          </div>
          
          <div className="col-span-6 h-full flex flex-col relative rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800/50 overflow-hidden">
             <DroneCanvas telemetry={telemetry} />
          </div>
          
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
             <div className="flex-1 min-h-0">
                <RightPanel telemetry={telemetry} />
             </div>
             <div className="shrink-0 h-28">
                <WindController />
             </div>
          </div>
        </div>
        
        <div className="shrink-0">
           <BottomPanel history={history} />
        </div>
      </main>
    </div>
  );
}

export default App;
