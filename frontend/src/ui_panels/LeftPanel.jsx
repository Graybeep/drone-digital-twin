import React from 'react';
import { Battery, Signal, Compass, AlertCircle } from 'lucide-react';

export default function LeftPanel({ telemetry }) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl">
      <h2 className="text-slate-300 font-semibold mb-4 border-b border-slate-700 pb-2 uppercase tracking-wider text-sm flex items-center gap-2">
        <AlertCircle size={16} /> Status Overview
      </h2>
      
      {telemetry ? (
        <div className="flex-1 flex flex-col gap-6">
          {/* Main Status */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Flight Mode</span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${telemetry.fc ? 'bg-indigo-900 text-indigo-300' : 'bg-rose-900 text-rose-300'}`}>
                {telemetry.fc ? 'PID STABILIZED' : 'MANUAL (PASSTHROUGH)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Connection</span>
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><Signal size={14} /> EXCELLENT</span>
            </div>
          </div>

          {/* Kinematics */}
          <div>
             <h3 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-1"><Compass size={14}/> Kinematics</h3>
             <div className="space-y-2 font-mono text-sm pl-2 border-l-2 border-slate-700">
               <div className="flex justify-between">
                 <span className="text-slate-400">Alt (Z):</span>
                 <span className="text-slate-200">{telemetry.physics.z.toFixed(2)} m</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Roll:</span>
                 <span className="text-slate-200">{(telemetry.physics.roll * (180/Math.PI)).toFixed(1)}°</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Pitch:</span>
                 <span className="text-slate-200">{(telemetry.physics.pitch * (180/Math.PI)).toFixed(1)}°</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Yaw:</span>
                 <span className="text-slate-200">{(telemetry.physics.yaw * (180/Math.PI)).toFixed(1)}°</span>
               </div>
             </div>
          </div>

          {/* Virtual Battery */}
          <div className="mt-auto">
             <div className="flex justify-between items-center mb-1">
               <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1"><Battery size={12}/> Battery (Sim)</span>
               <span className="text-emerald-400 font-mono text-xs">100% (25.2V)</span>
             </div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-full"></div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
          Waiting for telemetry...
        </div>
      )}
    </div>
  );
}
