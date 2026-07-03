import math

class DronePhysics:
    def __init__(self):
        # Physical Constants for a 5-inch drone
        self.g = 9.81
        self.mass = 0.8 # kg
        self.L = 0.25 # Arm length in meters
        
        # Moments of inertia (approximate for a quadcopter)
        self.Ixx = 0.005
        self.Iyy = 0.005
        self.Izz = 0.010
        
        # State Vectors
        # Position (Inertial Frame)
        self.x = 0.0
        self.y = 0.0
        self.z = 0.0 # Altitude (positive is UP)
        
        # Velocity (Inertial Frame)
        self.vx = 0.0
        self.vy = 0.0
        self.vz = 0.0
        
        # Orientation (Euler Angles)
        self.roll = 0.0
        self.pitch = 0.0
        self.yaw = 0.0
        
        # Angular Velocity (Body Frame)
        self.p = 0.0
        self.q = 0.0
        self.r = 0.0

    def update(self, dt, motor_thrusts, wind_force=[0.0, 0.0, 0.0]):
        """
        Updates the physics state of the drone.
        motor_thrusts: [F1, F2, F3, F4] in Newtons
        wind_force: [Fx, Fy, Fz] in Newtons
        Layout: 1=Front-Right(CCW), 2=Rear-Left(CCW), 3=Front-Left(CW), 4=Rear-Right(CW)
        """
        F1, F2, F3, F4 = motor_thrusts
        
        # Total Thrust (in body Z axis, pushing UP)
        T = F1 + F2 + F3 + F4
        
        # Torques in body frame
        # Roll: Left motors (3, 2) push up, right motors (1, 4) push down
        tau_x = self.L * ((F3 + F2) - (F1 + F4))
        
        # Pitch: Rear motors (2, 4) push up, front motors (1, 3) push down
        tau_y = self.L * ((F2 + F4) - (F1 + F3))
        
        # Yaw: Reaction torque. CW motors (3, 4) vs CCW motors (1, 2)
        tau_z = 0.05 * ((F1 + F2) - (F3 + F4)) # Simplified yaw factor
        
        # Angular accelerations (Euler equations)
        p_dot = (tau_x - (self.Izz - self.Iyy) * self.q * self.r) / self.Ixx
        q_dot = (tau_y - (self.Ixx - self.Izz) * self.p * self.r) / self.Iyy
        r_dot = (tau_z - (self.Iyy - self.Ixx) * self.p * self.q) / self.Izz
        
        # Update angular velocities
        self.p += p_dot * dt
        self.q += q_dot * dt
        self.r += r_dot * dt
        
        # Integrate angular velocities to get Euler angles
        # (Assuming small angles for simplicity in Phase 1)
        self.roll += self.p * dt
        self.pitch += self.q * dt
        self.yaw += self.r * dt
        
        # Linear accelerations (Transforming body thrust to inertial frame)
        sr, cr = math.sin(self.roll), math.cos(self.roll)
        sp, cp = math.sin(self.pitch), math.cos(self.pitch)
        sy, cy = math.sin(self.yaw), math.cos(self.yaw)
        
        # Acceleration in inertial frame, adding wind force (a = F/m)
        ax = (T / self.mass) * (sr * sy + cr * cy * sp) + (wind_force[0] / self.mass)
        ay = (T / self.mass) * (cr * sy * sp - cy * sr) + (wind_force[1] / self.mass)
        az = (T / self.mass) * (cr * cp) - self.g + (wind_force[2] / self.mass)
        
        # Apply ground constraint
        if self.z <= 0 and az < 0:
            az = 0
            self.vz = 0
            self.z = 0
            # Ground friction (damps movement when landed)
            self.vx *= 0.9
            self.vy *= 0.9
            self.roll *= 0.9
            self.pitch *= 0.9
            self.p *= 0.9
            self.q *= 0.9
            
        # Update velocities and positions
        self.vx += ax * dt
        self.vy += ay * dt
        self.vz += az * dt
        
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.z += self.vz * dt
        
        # Hard floor clamp
        if self.z < 0:
            self.z = 0
