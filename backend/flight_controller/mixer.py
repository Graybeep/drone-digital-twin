class MotorMixer:
    def __init__(self):
        pass
        
    def mix(self, throttle, roll_cmd, pitch_cmd, yaw_cmd):
        """
        Converts FC commands into motor throttle percentages (0.0 to 1.0).
        Layout: 1=FR(CCW), 2=RL(CCW), 3=FL(CW), 4=RR(CW)
        """
        # Motor 1: Front-Right
        m1 = throttle - roll_cmd - pitch_cmd + yaw_cmd
        # Motor 2: Rear-Left
        m2 = throttle + roll_cmd + pitch_cmd + yaw_cmd
        # Motor 3: Front-Left
        m3 = throttle + roll_cmd - pitch_cmd - yaw_cmd
        # Motor 4: Rear-Right
        m4 = throttle - roll_cmd + pitch_cmd - yaw_cmd
        
        # Clamp between 0.0 and 1.0
        return [
            max(0.0, min(1.0, m1)),
            max(0.0, min(1.0, m2)),
            max(0.0, min(1.0, m3)),
            max(0.0, min(1.0, m4))
        ]
