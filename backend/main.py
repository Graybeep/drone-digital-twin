import asyncio
import time
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from physics_engine.kinematics import DronePhysics
from motor_simulation.motors import MotorSim
from sensor_simulation.imu import IMUSensor
from wind_engine.wind import WindEngine
from flight_controller.fc import FlightController

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

physics = DronePhysics()
motors = MotorSim()
imu = IMUSensor()
wind = WindEngine()
fc = FlightController()

# Global target commands from RC/User
class ControlState:
    throttle: float = 0.0
    roll: float = 0.0
    pitch: float = 0.0
    yaw_rate: float = 0.0
    mode: str = "manual" # "manual", "pid", "ml"

rc_state = ControlState()
current_motor_throttles = [0.0, 0.0, 0.0, 0.0]

class RCInput(BaseModel):
    throttle: float
    roll: float
    pitch: float
    yaw_rate: float
    mode: str = "pid"

@app.post("/api/rc")
async def set_rc(input_data: RCInput):
    rc_state.throttle = input_data.throttle
    rc_state.roll = input_data.roll
    rc_state.pitch = input_data.pitch
    rc_state.yaw_rate = input_data.yaw_rate
    rc_state.mode = input_data.mode
    return {"status": "ok"}

class WindInput(BaseModel):
    vx: float
    vy: float
    vz: float
    turbulence: float

@app.post("/api/wind")
async def set_wind(input_data: WindInput):
    wind.set_wind(input_data.vx, input_data.vy, input_data.vz, input_data.turbulence)
    return {"status": "ok"}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    last_time = time.time()
    try:
        while True:
            current_time = time.time()
            dt = current_time - last_time
            
            if dt < 0.016:
                await asyncio.sleep(0.016 - dt)
                continue
                
            last_time = current_time
            
            # Read noisy sensors to feed into FC
            sensor_data = imu.read(physics)
            
            fc_output = None
            global current_motor_throttles
            
            # Get wind forces
            wind_force = wind.get_wind_force()
            
            if rc_state.mode == "manual":
                # Completely bypass FC, pass RC directly to motor mixer
                current_motor_throttles = fc.mixer.mix(rc_state.throttle, rc_state.roll, rc_state.pitch, rc_state.yaw_rate)
            elif rc_state.mode in ["pid", "ml"]:
                # Run Flight Controller
                fc_output = fc.update(
                    target_roll=rc_state.roll,
                    target_pitch=rc_state.pitch,
                    target_yaw_rate=rc_state.yaw_rate,
                    target_throttle=rc_state.throttle,
                    current_roll=sensor_data["roll"],
                    current_pitch=sensor_data["pitch"],
                    current_yaw_rate=sensor_data["yaw_rate"],
                    gyro_p=sensor_data["roll_rate"],
                    gyro_q=sensor_data["pitch_rate"],
                    wind_force=wind_force,
                    dt=dt,
                    mode=rc_state.mode
                )
                current_motor_throttles = fc_output["motor_throttles"]

            
            # Physics Step
            thrusts = [motors.get_thrust(t) for t in current_motor_throttles]
            physics.update(dt, thrusts, wind_force)
            
            # Package telemetry
            packet = {
                "physics": {
                    "x": physics.x,
                    "y": physics.y,
                    "z": physics.z,
                    "vx": physics.vx,
                    "vy": physics.vy,
                    "vz": physics.vz,
                    "roll": physics.roll,
                    "pitch": physics.pitch,
                    "yaw": physics.yaw
                },
                "sensors": sensor_data,
                "motors": current_motor_throttles,
                "fc": fc_output,
                "wind": {
                    "vx": wind.base_wind[0],
                    "vy": wind.base_wind[1],
                    "vz": wind.base_wind[2],
                    "force": wind_force
                }
            }
            
            await websocket.send_text(json.dumps(packet))
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in telemetry loop: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
