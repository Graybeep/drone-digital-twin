import random

class WindEngine:
    def __init__(self):
        # Base wind velocity (m/s) in X, Y, Z directions
        self.base_wind = [0.0, 0.0, 0.0]
        self.turbulence_intensity = 0.0
        
    def set_wind(self, vx, vy, vz, turbulence):
        self.base_wind = [vx, vy, vz]
        self.turbulence_intensity = turbulence

    def get_wind_force(self, drone_area=0.05, drag_coeff=1.2, air_density=1.225):
        """
        Returns a force vector [Fx, Fy, Fz] applied to the drone by the wind.
        F = 0.5 * density * v^2 * Cd * Area
        """
        # Add turbulence
        wx = self.base_wind[0] + random.gauss(0, self.turbulence_intensity)
        wy = self.base_wind[1] + random.gauss(0, self.turbulence_intensity)
        wz = self.base_wind[2] + random.gauss(0, self.turbulence_intensity)
        
        # Calculate force for each axis (preserving sign)
        def calc_force(v):
            return 0.5 * air_density * (v * abs(v)) * drag_coeff * drone_area
            
        fx = calc_force(wx)
        fy = calc_force(wy)
        fz = calc_force(wz)
        
        return [fx, fy, fz]
