class PIDController:
    def __init__(self, kp, ki, kd, out_min=-1.0, out_max=1.0):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        
        self.out_min = out_min
        self.out_max = out_max
        
        self.integral = 0.0
        self.previous_error = 0.0
        
    def update(self, setpoint, measured_value, dt):
        if dt <= 0:
            return 0.0
            
        error = setpoint - measured_value
        
        self.integral += error * dt
        # Anti-windup
        self.integral = max(min(self.integral, self.out_max), self.out_min)
        
        derivative = (error - self.previous_error) / dt
        self.previous_error = error
        
        output = (self.kp * error) + (self.ki * self.integral) + (self.kd * derivative)
        
        return max(min(output, self.out_max), self.out_min)
