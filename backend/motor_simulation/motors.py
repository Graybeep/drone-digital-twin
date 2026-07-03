class MotorSim:
    def __init__(self):
        # max thrust per motor in Newtons (approx 1kg thrust per motor for 5-inch drone = ~9.81N)
        self.max_thrust = 10.0
        
    def get_thrust(self, throttle_pct):
        """
        Calculates thrust based on throttle percentage.
        throttle_pct: float from 0.0 to 1.0
        Returns thrust in Newtons.
        """
        # Ensure throttle is clamped between 0 and 1
        throttle_pct = max(0.0, min(1.0, float(throttle_pct)))
        
        # Simulating roughly quadratic thrust curve relative to throttle percentage
        # T = max_thrust * (throttle)^1.5
        return self.max_thrust * (throttle_pct ** 1.5)
