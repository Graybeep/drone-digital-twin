from .pid import PIDController
from .mixer import MotorMixer
from ml_model.residual_rl import ResidualRLController

class FlightController:
    def __init__(self):
        # Base PID gains
        self.pid_roll = PIDController(kp=1.5, ki=0.0, kd=0.5)
        self.pid_pitch = PIDController(kp=1.5, ki=0.0, kd=0.5)
        self.pid_yaw_rate = PIDController(kp=1.0, ki=0.0, kd=0.0)
        
        self.mixer = MotorMixer()
        self.ml_model = ResidualRLController()
        
    def update(self, target_roll, target_pitch, target_yaw_rate, target_throttle, 
               current_roll, current_pitch, current_yaw_rate, 
               gyro_p, gyro_q, wind_force, dt, mode="pid"):
               
        # Base PID calculation
        pid_roll_cmd = self.pid_roll.update(target_roll, current_roll, dt)
        pid_pitch_cmd = self.pid_pitch.update(target_pitch, current_pitch, dt)
        pid_yaw_cmd = self.pid_yaw_rate.update(target_yaw_rate, current_yaw_rate, dt)
        
        ml_data = None
        roll_cmd = pid_roll_cmd
        pitch_cmd = pid_pitch_cmd
        yaw_cmd = pid_yaw_cmd
        
        # Apply Machine Learning Residuals
        if mode == "ml":
            ml_data = self.ml_model.predict(current_roll, current_pitch, gyro_p, gyro_q, wind_force)
            
            # Combine signals (Residual RL)
            roll_cmd = pid_roll_cmd + ml_data["residual_roll"]
            pitch_cmd = pid_pitch_cmd + ml_data["residual_pitch"]
            yaw_cmd = pid_yaw_cmd + ml_data["residual_yaw"]
        
        # Motor Mixing
        motor_throttles = self.mixer.mix(target_throttle, roll_cmd, pitch_cmd, yaw_cmd)
        
        return {
            "motor_throttles": motor_throttles,
            "pid_roll_out": pid_roll_cmd,
            "pid_pitch_out": pid_pitch_cmd,
            "pid_yaw_out": pid_yaw_cmd,
            "final_roll_cmd": roll_cmd,
            "final_pitch_cmd": pitch_cmd,
            "ml_data": ml_data
        }
