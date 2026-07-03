import React from 'react';
import { Cpu, Activity, Wind as WindIcon } from 'lucide-react';

export default function RightPanel({ telemetry }) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl">
      <h2 className="text-slate-300 font-semibold mb-4 border-b border-slate-700 pb-2 uppercase tracking-wider text-sm flex items-center gap-2">
        <Activity size={16} /> Telemetry Data
      </h2>
      
      {telemetry ? (
        <div className="font-mono text-sm space-y-6 text-slate-400 flex-1 overflow-y-auto pr-1">
           {/* IMU Sensors */}
           <div>
             <p className="text-slate-200 font-bold mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1 border-l-2 border-indigo-500 pl-2 bg-slate-800/30 py-1">
                <Cpu size={12} className="text-indigo-500"/> Raw IMU (Noisy)
             </p>
             <div className="space-y-1 pl-3 text-xs">
               <div className="flex justify-between"><span>Accel X:</span><span>{telemetry.sensors.accel_x.toFixed(2)} m/s²</span></div>
               <div className="flex justify-between"><span>Accel Y:</span><span>{telemetry.sensors.accel_y.toFixed(2)} m/s²</span></div>
               <div className="flex justify-between"><span>Accel Z:</span><span>{telemetry.sensors.accel_z.toFixed(2)} m/s²</span></div>
               <div className="h-1"></div>
               <div className="flex justify-between"><span>Gyro X (p):</span><span>{telemetry.sensors.roll_rate.toFixed(2)} rad/s</span></div>
               <div className="flex justify-between"><span>Gyro Y (q):</span><span>{telemetry.sensors.pitch_rate.toFixed(2)} rad/s</span></div>
               <div className="flex justify-between"><span>Gyro Z (r):</span><span>{telemetry.sensors.yaw_rate.toFixed(2)} rad/s</span></div>
             </div>
           </div>
           
           {/* Motors / ESC */}
           <div>
             <p className="text-slate-200 font-bold mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1 border-l-2 border-emerald-500 pl-2 bg-slate-800/30 py-1">
                <Activity size={12} className="text-emerald-500"/> ESC / Motor Throttle
             </p>
             <div className="space-y-1 pl-3 text-xs">
               <div className="flex justify-between"><span>M1 (FR):</span><span className="text-emerald-400">{(telemetry.motors[0]*100).toFixed(1)}%</span></div>
               <div className="flex justify-between"><span>M2 (RL):</span><span className="text-emerald-400">{(telemetry.motors[1]*100).toFixed(1)}%</span></div>
               <div className="flex justify-between"><span>M3 (FL):</span><span className="text-emerald-400">{(telemetry.motors[2]*100).toFixed(1)}%</span></div>
               <div className="flex justify-between"><span>M4 (RR):</span><span className="text-emerald-400">{(telemetry.motors[3]*100).toFixed(1)}%</span></div>
             </div>
           </div>

           {/* Wind */}
           <div>
             <p className="text-slate-200 font-bold mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1 border-l-2 border-cyan-500 pl-2 bg-slate-800/30 py-1">
                <WindIcon size={12} className="text-cyan-500"/> Wind Forces
             </p>
             <div className="space-y-1 pl-3 text-xs">
               <div className="flex justify-between"><span>Vel X:</span><span>{telemetry.wind.vx.toFixed(1)} m/s</span></div>
               <div className="flex justify-between"><span>Vel Y:</span><span>{telemetry.wind.vy.toFixed(1)} m/s</span></div>
               <div className="flex justify-between"><span>Force X:</span><span>{telemetry.wind.force[0].toFixed(2)} N</span></div>
               <div className="flex justify-between"><span>Force Y:</span><span>{telemetry.wind.force[1].toFixed(2)} N</span></div>
             </div>
           </div>
        </div>
      ) : (
        <p className="text-slate-500 text-sm italic">Waiting for telemetry...</p>
      )}
    </div>
  );
}
