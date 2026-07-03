import random

class IMUSensor:
    def __init__(self):
        # Gaussian noise standard deviations
        self.accel_noise = 0.05 # m/s^2 noise
        self.gyro_noise = 0.01  # rad/s noise

    def read(self, physics):
        """
        Reads the true physics state and adds noise to simulate real sensors.
        """
        return {
            "roll": physics.roll + random.gauss(0, self.gyro_noise),
            "pitch": physics.pitch + random.gauss(0, self.gyro_noise),
            "yaw": physics.yaw + random.gauss(0, self.gyro_noise),
            "roll_rate": physics.p + random.gauss(0, self.gyro_noise),
            "pitch_rate": physics.q + random.gauss(0, self.gyro_noise),
            "yaw_rate": physics.r + random.gauss(0, self.gyro_noise),
            "accel_x": random.gauss(0, self.accel_noise),
            "accel_y": random.gauss(0, self.accel_noise),
            "accel_z": (9.81 if physics.z <= 0 else physics.vz) + random.gauss(0, self.accel_noise) 
        }
