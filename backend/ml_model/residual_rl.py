import numpy as np

class ResidualRLController:
    def __init__(self):
        # Simulate an MLP Policy Network
        self.ml_weight = 0.8 
        
    def predict(self, current_roll, current_pitch, gyro_p, gyro_q, wind_force):
        """
        Takes sensor states and outputs a residual (feed-forward) correction.
        """
        # Feature Extraction 
        features = [current_roll, current_pitch, gyro_p, gyro_q, wind_force[0], wind_force[1]]
        
        # Simulated Network Inference
        # Wind X (pushing positive X axis) -> drone must tilt negative (lean into wind)
        # Wind Y (pushing positive Y axis) -> drone must tilt negative
        
        # Our physics model: 
        # roll positive tilts right (positive X thrust component). If wind pushes +X, drone needs -roll to fight it.
        w_wind_x = -0.15 
        w_wind_y = -0.15 
        
        residual_roll = wind_force[0] * w_wind_x
        residual_pitch = wind_force[1] * w_wind_y
        residual_yaw = 0.0 
        
        return {
            "residual_roll": residual_roll * self.ml_weight,
            "residual_pitch": residual_pitch * self.ml_weight,
            "residual_yaw": residual_yaw * self.ml_weight,
            "features": features
        }
