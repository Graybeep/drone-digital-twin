import React from 'react';
import { BrainCircuit, Cpu, Wind, Navigation } from 'lucide-react';

export default function MLPipeline({ telemetry }) {
  if (!telemetry || !telemetry.fc || !telemetry.fc.ml_data) {
    return (
      <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl justify-center items-center">
        <BrainCircuit size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm text-center">ML Visualization<br/>Inactive</p>
        <p className="text-slate-600 text-[10px] mt-2">Switch to ML RL mode to view.</p>
      </div>
    );
  }

  const ml = telemetry.fc.ml_data;
  
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-purple-500/30 p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 animate-pulse pointer-events-none"></div>
      
      <h2 className="text-slate-300 font-semibold mb-2 border-b border-purple-500/30 pb-2 uppercase tracking-wider text-[10px] flex items-center gap-2 relative z-10">
        <BrainCircuit size={14} className="text-purple-400" /> "AI Thinking" Pipeline
      </h2>
      
      <div className="flex-1 flex flex-col justify-between relative z-10 mt-2">
         {/* Layer 1: Inputs */}
         <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Sensor State Input</span>
            <div className="flex justify-between text-[10px] font-mono text-slate-300">
               <span>Roll: {(ml.features[0]*57.3).toFixed(1)}°</span>
               <span>Pitch: {(ml.features[1]*57.3).toFixed(1)}°</span>
               <span>p: {ml.features[2].toFixed(1)}</span>
               <span>q: {ml.features[3].toFixed(1)}</span>
            </div>
         </div>
         
         {/* Connecting Line */}
         <div className="w-0.5 h-3 bg-purple-500/50 mx-auto"></div>

         {/* Layer 2: External Disturbance Observer */}
         <div className="bg-slate-950/50 p-2 rounded border border-cyan-900/50 flex justify-between items-center">
            <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider flex items-center gap-1"><Wind size={10}/> Disturbance</span>
            <div className="text-[10px] font-mono text-cyan-400">
               Wx: {ml.features[4].toFixed(1)} | Wy: {ml.features[5].toFixed(1)}
            </div>
         </div>
         
         {/* Connecting Line */}
         <div className="w-0.5 h-3 bg-purple-500/50 mx-auto"></div>

         {/* Layer 3: Neural Network */}
         <div className="bg-purple-950/30 p-2 rounded border border-purple-500/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors"></div>
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                 <Cpu size={10}/> Residual RL Policy (PPO)
               </span>
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></div>
                 <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '150ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '300ms'}}></div>
               </div>
            </div>
         </div>

         {/* Connecting Line */}
         <div className="w-0.5 h-3 bg-purple-500/50 mx-auto"></div>

         {/* Layer 4: Output Correction */}
         <div className="bg-indigo-950/30 p-2 rounded border border-indigo-500/50">
            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-1 block flex items-center gap-1">
              <Navigation size={10}/> Feed-forward Correction
            </span>
            <div className="flex justify-between text-[10px] font-mono font-bold">
               <span className="text-emerald-400">+{(ml.residual_roll).toFixed(3)} Roll</span>
               <span className="text-rose-400">+{(ml.residual_pitch).toFixed(3)} Pitch</span>
            </div>
         </div>
      </div>
    </div>
  );
}
