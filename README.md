# 🚁 Drone Digital Twin — ML Stabilization Simulator

A professional-grade **Digital Twin** and **Ground Control Station** for simulating drone flight dynamics, PID control, and Machine Learning-based stabilization — all running in your browser.

Built as an engineering research project to study and visualize how Reinforcement Learning can augment traditional PID controllers to stabilize a quadcopter against environmental disturbances like wind gusts and turbulence.

![Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-3D-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

| Feature | Description |
|---|---|
| **3D Digital Twin** | Real-time 3D drone model rendered with Three.js. Propellers spin proportionally to motor RPM. |
| **Newton-Euler Physics Engine** | Rigid body simulation with gravity, thrust, torque, and aerodynamic drag. |
| **PID Flight Controller** | Decoupled Roll/Pitch/Yaw PID loops with a standard X-frame motor mixer. |
| **Residual RL (Machine Learning)** | A simulated PPO policy network that injects feed-forward corrections to fight wind disturbances. |
| **Live Telemetry Dashboard** | Professional UI inspired by QGroundControl / DJI Ground Station. |
| **Real-time Graphs** | Scrolling Recharts visualizations of Attitude, Motor Throttle, and PID output at 60fps. |
| **Virtual RC Transmitter** | Fly with your keyboard (WASD + Arrows) or plug in an Xbox/PS controller via the Gamepad API. |
| **Wind Simulator** | Click a button to throw calm, mild, or storm-level wind gusts at the drone in real-time. |
| **ML Pipeline Visualization** | Watch the AI "think" — see features enter the neural network and corrections flow out. |
| **Sensor Noise Simulation** | IMU readings include configurable Gaussian noise for realistic sensor fusion challenges. |

---

## 🏗️ Architecture

```
┌─────────────────────────┐         WebSocket (60Hz)        ┌──────────────────────────┐
│   Python Backend        │ ──────────────────────────────► │   React Frontend         │
│                         │                                 │                          │
│  ┌───────────────────┐  │         REST API (20Hz)         │  ┌────────────────────┐  │
│  │ Physics Engine    │  │ ◄────────────────────────────── │  │ RC Controller      │  │
│  │ Wind Engine       │  │                                 │  │ Wind Controller    │  │
│  │ PID Controller    │  │                                 │  │ 3D Canvas          │  │
│  │ ML RL Model       │  │                                 │  │ Live Graphs        │  │
│  │ Motor Simulation  │  │                                 │  │ ML Pipeline Viz    │  │
│  │ IMU Sensor Sim    │  │                                 │  └────────────────────┘  │
│  └───────────────────┘  │                                 │                          │
│  FastAPI + Uvicorn      │                                 │  Vite + TailwindCSS      │
└─────────────────────────┘                                 └──────────────────────────┘
```

---

## 📂 Project Structure

```
drone-digital-twin/
├── backend/
│   ├── main.py                          # FastAPI server & WebSocket telemetry loop
│   ├── physics_engine/
│   │   └── kinematics.py                # Newton-Euler rigid body dynamics
│   ├── motor_simulation/
│   │   └── motors.py                    # ESC & brushless motor thrust model
│   ├── sensor_simulation/
│   │   └── imu.py                       # IMU sensor with Gaussian noise
│   ├── wind_engine/
│   │   └── wind.py                      # Aerodynamic wind forces & turbulence
│   ├── flight_controller/
│   │   ├── pid.py                       # Generic PID controller class
│   │   ├── mixer.py                     # Quadcopter X-frame motor mixer
│   │   └── fc.py                        # Flight controller (PID + ML integration)
│   └── ml_model/
│       └── residual_rl.py               # Simulated Residual RL policy network
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Main dashboard layout & WebSocket client
│   │   ├── index.css                    # TailwindCSS entry
│   │   ├── digital_twin/
│   │   │   └── DroneCanvas.jsx          # 3D Three.js drone model
│   │   ├── controller/
│   │   │   └── RCController.jsx         # Virtual RC transmitter (Keyboard + Gamepad)
│   │   ├── ui_panels/
│   │   │   ├── LeftPanel.jsx            # Status overview
│   │   │   ├── RightPanel.jsx           # Raw telemetry data
│   │   │   ├── BottomPanel.jsx          # Live scrolling graphs
│   │   │   ├── MLPipeline.jsx           # AI thinking visualization
│   │   │   └── WindController.jsx       # Environment simulator buttons
│   │   └── graphs/
│   │       └── LiveGraph.jsx            # Recharts live graph component
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)

### 1. Clone the Repository

```bash
git clone https://github.com/Graybeep/drone-digital-twin.git
cd drone-digital-twin
```

### 2. Setup the Backend

```bash
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

pip install fastapi uvicorn websockets pydantic numpy
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

### 4. Run the Application

You need **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd drone-digital-twin
.\venv\Scripts\Activate.ps1   # or source venv/bin/activate
cd backend
python main.py
```
> Server starts at `http://localhost:8000`

**Terminal 2 — Frontend:**
```bash
cd drone-digital-twin/frontend
npm run dev
```
> Opens at `http://localhost:5173`

---

## 🎮 Controls

| Input | Action |
|---|---|
| `W` / `S` | Increase / Decrease Throttle |
| `A` / `D` | Yaw Left / Right |
| `Arrow Up` / `Down` | Pitch Forward / Backward |
| `Arrow Left` / `Right` | Roll Left / Right |
| **Xbox/PS Controller** | Full dual-stick analog support via Gamepad API |

### Flight Modes

| Mode | Description |
|---|---|
| **MANUAL** | Raw stick inputs bypass PID. Direct motor control. |
| **PID** | Classic PID stabilization. The FC auto-levels the drone. |
| **ML RL** | PID + Machine Learning residuals. The AI actively fights wind. |

---

## 🧠 How the ML Stabilization Works

This project implements a **Residual Reinforcement Learning** architecture:

1. The **PID controller** provides the baseline stability (it knows the physics model).
2. The **ML model** (simulating a PPO-trained policy) observes the wind disturbance and outputs a small **residual correction** that is added on top of the PID output.
3. This means the ML doesn't replace the PID — it **augments** it with a feed-forward signal that reacts to disturbances *before* the drone drifts.

```
Final Command = PID Output + ML Residual Correction
```

This is the same architecture used in cutting-edge research papers like:
- *"Residual Policy Learning"* (Silver et al., 2018)
- *"Learning Agile Flight"* (Hwangbo et al., 2017)

---

## 📡 Communication Latency Analysis

This project also includes a detailed engineering analysis of drone communication protocols, comparing:

- Wi-Fi, Bluetooth, RF, LoRa, Crossfire (TBS), and **ExpressLRS (ELRS)**

**Conclusion:** ExpressLRS at 1000Hz packet rate delivers **< 2ms** stick-to-FC latency, making it the best choice for low-latency research drones.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Physics & ML Backend | Python, FastAPI, Uvicorn, NumPy |
| Real-time Communication | WebSockets (60Hz telemetry), REST API (20Hz control) |
| 3D Rendering | Three.js, @react-three/fiber, @react-three/drei |
| Frontend Framework | React 18, Vite |
| Styling | TailwindCSS |
| Charts | Recharts |
| Icons | Lucide React |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Inspired by **QGroundControl**, **DJI Ground Station**, and **Mission Planner**
- Physics model based on Newton-Euler rigid body dynamics for quadrotors
- ML architecture inspired by Residual Policy Learning research

---

> Built with ❤️ as an engineering research project for drone ML stabilization.
