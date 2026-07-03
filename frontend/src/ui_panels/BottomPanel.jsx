import React from 'react';
import LiveGraph from '../graphs/LiveGraph';

export default function BottomPanel({ history }) {
  // history is an array of data points: { time, roll, pitch, m1, m2, m3, m4, pid_roll, pid_pitch }
  return (
    <div className="h-40 w-full bg-slate-900 rounded-xl border border-slate-800 p-3 shadow-xl flex gap-4">
      {/* Graph 1: Attitude (Roll/Pitch) */}
      <div className="flex-1 h-full bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
         <LiveGraph 
            title="Attitude (Degrees)"
            data={history} 
            yDomain={[-45, 45]}
            lines={[
              { dataKey: 'roll', stroke: '#3b82f6', name: 'Roll' },
              { dataKey: 'pitch', stroke: '#ef4444', name: 'Pitch' }
            ]} 
         />
      </div>

      {/* Graph 2: Motors */}
      <div className="flex-1 h-full bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
         <LiveGraph 
            title="Motor Throttle (%)"
            data={history} 
            yDomain={[0, 100]}
            lines={[
              { dataKey: 'm1', stroke: '#10b981', name: 'FR' },
              { dataKey: 'm2', stroke: '#8b5cf6', name: 'RL' },
              { dataKey: 'm3', stroke: '#f59e0b', name: 'FL' },
              { dataKey: 'm4', stroke: '#06b6d4', name: 'RR' }
            ]} 
         />
      </div>

      {/* Graph 3: PID Outputs */}
      <div className="flex-1 h-full bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
         <LiveGraph 
            title="PID Correction"
            data={history} 
            yDomain={[-1, 1]}
            lines={[
              { dataKey: 'pid_roll', stroke: '#3b82f6', name: 'Roll Cmd' },
              { dataKey: 'pid_pitch', stroke: '#ef4444', name: 'Pitch Cmd' }
            ]} 
         />
      </div>
    </div>
  );
}
