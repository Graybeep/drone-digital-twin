import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Drone Component
const DroneModel = ({ telemetry }) => {
  const droneRef = useRef();
  
  // Propeller refs for spinning animation
  const propFR = useRef();
  const propRL = useRef();
  const propFL = useRef();
  const propRR = useRef();

  useFrame(() => {
    if (droneRef.current && telemetry) {
      // Sync 3D model rotation with backend physics
      // Note: Three.js uses XYZ order, typically Y is UP. 
      // Our backend uses Z as UP. We map backend (roll, pitch, yaw) to Three.js (x, z, y).
      droneRef.current.rotation.x = telemetry.physics.roll;
      // Negative pitch because pitch forward in backend maps to -Z rotation in this layout
      droneRef.current.rotation.z = -telemetry.physics.pitch; 
      droneRef.current.rotation.y = -telemetry.physics.yaw;
      
      // Altitude representation
      droneRef.current.position.y = Math.max(0.2, telemetry.physics.z);
      
      // Spin propellers based on motor throttle (telemetry.motors is [FR, RL, FL, RR])
      const motors = telemetry.motors || [0,0,0,0];
      const maxSpin = 0.5; // rad per frame
      if (propFR.current) propFR.current.rotation.y += motors[0] * maxSpin;
      if (propRL.current) propRL.current.rotation.y += motors[1] * maxSpin;
      if (propFL.current) propFL.current.rotation.y -= motors[2] * maxSpin; // CW
      if (propRR.current) propRR.current.rotation.y -= motors[3] * maxSpin; // CW
    }
  });

  return (
    <group ref={droneRef} position={[0, 0.2, 0]}>
      {/* Central Body */}
      <mesh>
        <boxGeometry args={[0.2, 0.05, 0.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      
      {/* Arms (X configuration) */}
      <mesh position={[0.15, 0, 0.15]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.15, 0, 0.15]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.15, 0, -0.15]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.15, 0, -0.15]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Propellers */}
      {/* FR */}
      <mesh ref={propFR} position={[0.25, 0.05, -0.25]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
      {/* RR */}
      <mesh ref={propRR} position={[0.25, 0.05, 0.25]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      {/* FL */}
      <mesh ref={propFL} position={[-0.25, 0.05, -0.25]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
      {/* RL */}
      <mesh ref={propRL} position={[-0.25, 0.05, 0.25]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export default function DroneCanvas({ telemetry }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative bg-slate-900">
      <Canvas camera={{ position: [1.5, 1, 1.5], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <DroneModel telemetry={telemetry} />
        
        <Grid 
          infiniteGrid 
          fadeDistance={10} 
          sectionColor="#334155"
          cellColor="#1e293b"
          position={[0, -0.01, 0]} 
        />
        <OrbitControls makeDefault maxPolarAngle={Math.PI/2 - 0.05} />
      </Canvas>
      
      {/* Overlay Status */}
      <div className="absolute top-4 left-4 flex gap-2 items-center">
         <div className={`w-3 h-3 rounded-full ${telemetry ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
         <span className="font-mono text-sm text-slate-300 font-bold tracking-widest">
           {telemetry ? 'LINK ESTABLISHED' : 'NO SIGNAL'}
         </span>
      </div>
    </div>
  );
}
