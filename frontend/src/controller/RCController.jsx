import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gamepad2, Keyboard } from 'lucide-react';

export default function RCController({ onControlUpdate, currentMode, onModeChange }) {
  const [inputType, setInputType] = useState('keyboard'); 
  
  // Joystick state 
  const [leftStick, setLeftStick] = useState({ x: 0, y: 0 });
  const [rightStick, setRightStick] = useState({ x: 0, y: 0 });

  const activeKeys = useRef(new Set());
  const animationFrameRef = useRef();

  const updateControls = useCallback(() => {
    let newLeft = { x: 0, y: leftStick.y }; 
    let newRight = { x: 0, y: 0 }; 
    
    // 1. Check Gamepad
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gamepadConnected = false;
    
    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i];
      if (gp && gp.connected) {
        gamepadConnected = true;
        if (inputType !== 'gamepad') setInputType('gamepad');
        
        const deadzone = 0.05;
        const applyDeadzone = (val) => Math.abs(val) < deadzone ? 0 : val;
        
        newLeft.x = applyDeadzone(gp.axes[0]);
        let throttleVal = (applyDeadzone(gp.axes[1]) * -0.5) + 0.5;
        newLeft.y = throttleVal;
        
        newRight.x = applyDeadzone(gp.axes[2]);
        newRight.y = applyDeadzone(gp.axes[3]); 
        
        // Debounced Mode switching via buttons (simple check for now)
        // (In a real app, track previous button state to trigger only on edge)
        
        break; 
      }
    }
    
    // 2. Check Keyboard
    if (!gamepadConnected) {
      if (inputType !== 'keyboard') setInputType('keyboard');
      
      const keys = activeKeys.current;
      
      if (keys.has('ArrowUp')) newRight.y = -1;    
      if (keys.has('ArrowDown')) newRight.y = 1;   
      if (keys.has('ArrowLeft')) newRight.x = -1;  
      if (keys.has('ArrowRight')) newRight.x = 1;  
      
      if (keys.has('a')) newLeft.x = -1; 
      if (keys.has('d')) newLeft.x = 1;  
      
      if (keys.has('w')) newLeft.y = Math.min(1.0, leftStick.y + 0.015);
      if (keys.has('s')) newLeft.y = Math.max(0.0, leftStick.y - 0.015);
    }
    
    setLeftStick(newLeft);
    setRightStick(newRight);
    
    onControlUpdate({
      throttle: newLeft.y,
      yaw_rate: newLeft.x * 3.14,  
      roll: newRight.x * 0.78,
      pitch: newRight.y * 0.78,
      mode: currentMode
    });
    
    animationFrameRef.current = requestAnimationFrame(updateControls);
  }, [leftStick.y, currentMode, inputType, onControlUpdate]);

  useEffect(() => {
    const handleKeyDown = (e) => activeKeys.current.add(e.key.toLowerCase().replace('arrow', 'Arrow'));
    const handleKeyUp = (e) => activeKeys.current.delete(e.key.toLowerCase().replace('arrow', 'Arrow'));
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    animationFrameRef.current = requestAnimationFrame(updateControls);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateControls]);

  const mapToPercent = (val, isThrottle=false) => {
    if (isThrottle) return `${(1 - val) * 100}%`;
    return `${((val + 1) / 2) * 100}%`;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col items-center shadow-xl">
       <div className="flex justify-between w-full mb-4 items-center">
         <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border-l-2 border-orange-500 pl-2">
           {inputType === 'gamepad' ? <Gamepad2 size={12} className="text-emerald-500"/> : <Keyboard size={12} className="text-blue-500"/>}
           RC Transmitter
         </span>
         <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
           <button onClick={() => onModeChange('manual')} className={`px-2 py-1 text-[9px] rounded font-bold transition-colors ${currentMode === 'manual' ? 'bg-rose-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>MANUAL</button>
           <button onClick={() => onModeChange('pid')} className={`px-2 py-1 text-[9px] rounded font-bold transition-colors ${currentMode === 'pid' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>PID</button>
           <button onClick={() => onModeChange('ml')} className={`px-2 py-1 text-[9px] rounded font-bold transition-colors ${currentMode === 'ml' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ML RL</button>
         </div>
       </div>

       <div className="flex gap-8 w-full justify-center mt-1 pb-4">
          <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-slate-800 relative shadow-inner">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800"></div>
             <div className="absolute left-1/2 top-0 w-[1px] h-full bg-slate-800"></div>
             <div 
               className="absolute w-6 h-6 bg-slate-600 rounded-full border border-slate-400 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
               style={{ left: mapToPercent(leftStick.x), top: mapToPercent(leftStick.y, true) }}
             >
                <div className="w-2 h-2 rounded-full border border-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
             </div>
             <div className="absolute -bottom-5 w-full text-center text-[9px] text-slate-500 font-mono">YAW / THR</div>
          </div>

          <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-slate-800 relative shadow-inner">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800"></div>
             <div className="absolute left-1/2 top-0 w-[1px] h-full bg-slate-800"></div>
             <div 
               className="absolute w-6 h-6 bg-slate-600 rounded-full border border-slate-400 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
               style={{ left: mapToPercent(rightStick.x), top: mapToPercent(rightStick.y) }}
             >
                <div className="w-2 h-2 rounded-full border border-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
             </div>
             <div className="absolute -bottom-5 w-full text-center text-[9px] text-slate-500 font-mono">ROLL / PIT</div>
          </div>
       </div>
    </div>
  );
}
