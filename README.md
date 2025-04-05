# Signal-X: AI-powered Smart Traffic Management System

<p align="center">
  <em>AI-powered Smart Traffic Management System</em>
</p>|

<div align="center">
  <a href="https://signal-x-zkh5.vercel.app/"target="_blank">
    <img src="https://img.shields.io/badge/Live%20Now-0066FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Now">
  </a>
  <br><br>
  <p style="font-size: 16px; color: #666;">Click the button above to visit the live version of the Signal-X project hosted on Vercel.</p>
</div>

<div align ="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-green.svg)](https://flask.palletsprojects.com/)

</div>

## 🌟 Overview

Signal-X is an AI-driven smart traffic management system that uses YOLO-based vehicle detection, Arduino-controlled signals, and MapMyIndia’s geospatial analytics to optimize traffic flow in real-time. It prioritizes emergency vehicles, prevents congestion, and enhances road safety through dynamic signal adjustments using live video feeds. Scalable and future-ready, Signal-X is adaptable for cities of all sizes, making urban commuting smarter and more efficient.


## 🚧 Problem Statement

### ❗ The Urban Gridlock Crisis

With rapid urbanization and an ever-increasing number of vehicles, cities are choking under **intense traffic congestion**. What should be smooth commutes turn into daily nightmares, leading to:

- ⏱️ **Wasted Time** stuck in endless queues  
- ⛽ **Higher Fuel Consumption** and rising transportation costs  
- 🌫️ **Increased Pollution** and carbon emissions  
- 🚨 **Delayed Emergency Responses** for ambulances, fire trucks, and police  
- 😠 **Driver Frustration** and rising road rage incidents  

---

### 🚦 The Flaws of Conventional Traffic Lights

Traditional traffic systems follow **fixed-timer logic**, blindly rotating signals **without considering real-time traffic flow**. This outdated mechanism leads to:

- 🟢 **Green lights on empty roads**, wasting valuable intersection time  
- 🔴 **Vehicle pile-ups in busy lanes**, creating bottlenecks  
- 🚑 **Emergency vehicles stuck**, unable to move swiftly through intersections  
- 🧍‍♂️ **Manual control dependency**, requiring more manpower  
- 🧠 **No AI, No Adaptability**, making systems unresponsive and inefficient  

---

### 🧠 The Need for a Smarter Solution

To truly **revolutionize urban mobility**, we need a system that is:

- ✅ **AI-powered** and capable of dynamic decision-making  
- 🌐 **IoT-integrated** for real-time traffic sensing  
- 🗺️ **Geospatially aware** for adaptive routing  
- ⚙️ **Automated & Scalable**, reducing human dependency  

> It’s time to move beyond timers and take the **smart route** to traffic management.

---


## 💡 Our Solution – Signal-X

**Signal-X** is an AI-driven Smart Traffic Management System that transforms urban mobility using the power of **computer vision**, **IoT**, and **geospatial intelligence**. Designed to be **scalable**, **real-time**, and **intelligent**, Signal-X optimizes traffic flow, reduces congestion, and ensures faster emergency response through dynamic signal control.

---

### 🚀 Key Features

- 🧠 **AI-Powered Traffic Analysis**  
  YOLOv8-based object detection continuously monitors vehicle flow across all junction lanes.

- ⏱️ **Dynamic Signal Adjustment**  
  Adaptive signal control based on real-time congestion and traffic density patterns.

- 🌐 **IoT Integration**  
  Raspberry Pi/Arduino-based controllers ensure seamless traffic light control and emergency detection.

- 🗺️ **Geospatial Intelligence**  
  Integration with MapMyIndia's API offers live congestion updates and smart rerouting.

- 🚑 **Emergency Vehicle Prioritization**  
  Automatically detects emergency vehicles (ambulance, fire brigade, police) and gives them green-light priority.

- 🔮 **Congestion Prediction**  
  AI models analyze historical + real-time data to predict and prevent traffic bottlenecks.

---

## 🧩 How Signal-X Works – Workflow

Signal-X operates through a seamless, AI-driven pipeline that integrates video processing, intelligent decision-making, and hardware-level execution.

---

### ⚙️ Step-by-Step Workflow

1. 🎥 **Live Data Collection**  
   - RTSP streams from **CCTV cameras and drones** provide real-time traffic video feeds.

2. 🗺️ **Traffic API Integration**  
   - Feeds are passed to **MapMyIndia Traffic API** for real-time congestion data enrichment.

3. 🧠 **Vehicle Detection using YOLOv8**  
   - Vehicles are identified and classified into 5 categories:  
     🚑 Ambulance, 🧬 Organ Transport, 🚒 Fire Brigade, 🚓 Police, 🆘 Disaster Units

4. 🔄 **Real-Time Multiprocessing**  
   - Uses Python’s **multiprocessing** to analyze **all four lanes** at a junction simultaneously for accurate density analysis.

5. 🧮 **Smart Signal Optimization**  
   - A custom AI model determines the optimal green-light timing using:  
     - 📊 **Vehicle Density**  
     - 🕓 **Historical Traffic Patterns** (via Reinforcement Learning)  
     - 📡 **Live API Congestion Data**

6. 🔌 **IoT-Based Hardware Integration**  
   - Arduino module integrated into the junction system.  
   - If an emergency vehicle is detected, **immediate green signal** is activated and maintained until it passes.

7. 🖥️ **Real-Time Dashboard (React)**  
   - Officers monitor and visualize traffic flow and system decisions via a **React-based dashboard** in real-time.

---

### 🎯 Why Signal-X?

> Unlike traditional fixed-timer systems, Signal-X uses **real-time intelligence and automation** to enhance traffic efficiency, reduce delays, and save lives.

✅ Smart  
✅ Scalable  
✅ Emergency-Ready  
✅ Real-Time  
✅ AI-Optimized  

## 🔧 Technical Architecture

### Components Overview

1. **Data Collection Layer**
   - CCTV cameras & drones capture live video feeds
   - Microphone sensors detect emergency vehicle sirens
   - IoT devices (Raspberry Pi & Arduino) process sensor inputs

2. **AI Processing Layer**
   - YOLOv8 for vehicle detection and classification
   - DeepSORT for vehicle tracking
   - OpenCV for image processing
   - Flask for API management

3. **Backend Processing**
   - MongoDB for data storage
   - WebSocket for real-time communication
   - Traffic analysis algorithms

4. **Frontend Dashboard**
   - React-based responsive interface
   - Real-time traffic analytics visualization
   - MapMyIndia integration for geospatial display

5. **Signal Control System**
   - Priority-based signal switching for emergency vehicles
   - Adaptive traffic light control based on congestion analysis

## 💻 Technology Stack

### Frontend
- **React** - UI library for building the dashboard
- **MapMyIndia SDK** - For maps integration and geospatial visualization
- **WebSocket** - For real-time communication with the backend

### Backend
- **Flask** - Python web framework for the API
- **MongoDB** - Database for storing traffic data and patterns
- **WebSocket** - For real-time data transmission

### AI & Computer Vision
- **YOLOv8** - For real-time object detection
- **DeepSORT** - For object tracking
- **OpenCV** - For image processing
- **Python** - Primary programming language

### Hardware
- **Raspberry Pi** - For edge computing and signal control
- **Arduino** - For sensor integration
- **CCTV Cameras** - For traffic monitoring

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js and npm
- MongoDB
- MapMyIndia API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArshTiwari2004/Signal-X.git
   cd signal-X
   ```
2. **Setup Frontend**
    ```bash
    cd traffic-monitoring/frontend/web/signalx-web
    npm install
    ```
3. **Create a .env file in the root of the frontend directory with:**
    ```bash
    VITE_MAPPLS_SDK_KEY=your_mapmy_india_sdk_key
    ```
4. **Start the development server:**
    ```
    npm run dev
    ```
5.  **Setup Backend - Create and activate a virtual environment:**
    ```
    python -m venv venv
    venv\Scripts\activate  # Windows
    source venv/bin/activate  # Linux/Mac
    ```
6. **Install the required packages:**
    ```
    pip install -r requirements.txt
    ```
7. **Start the Flask server:**
    ```
    python backend/flask_api.py
    ```
8. **For running the Expo project on mobile**
   ```
   cd mobile-app/signalx-mobile
   npm i
   npx expo start
   ```

# Project Structure

```bash
signal-x/
├── Arduino_code/
│   ├── sketch_Camera/
│   │   └── sketch_Camera.ino           # Controls CCTV pan/tilt
│   └── sketch_LED_Buzzer/
│       └── sketch_LED_Buzzer.ino       # Controls signal lights & alarms
│
├── mobile-app/
│   ├── mobile-backend/
│   │   ├── config/
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   └── dotenv.js               # API keys config
│   │   ├── models/
│   │   │   ├── Incident.js             # Report schema
│   │   │   └── User.js                 # Auth schema
│   │   └── routes/
│   │       ├── authRoutes.js           # Login/register endpoints
│   │       └── incidentRoutes.js       # Report submission
│   │
│   └── signalx-mobile/
│       ├── components/
│       │   ├── EmergencyAlert.js       # Siren detection UI
│       │   └── LiveTrafficLight.js     # Real-time signal status
│       └── screens/
│           ├── HomeScreen.js           # Main dashboard
│           └── ReportScreen.js         # Incident form
│
├── traffic-monitoring/
│   ├── backend/
│   │   ├── templates/                  # Admin panel HTML
│   │   ├── ambulance_detection.py      # Priority vehicle logic
│   │   └── traffic_control.py          # Signal timing algorithms
│   │
│   ├── frontend/
│   │   └── web/
│   │       └── signalx-web/
│   │           └── src/
│   │               ├── components/     # Reusable UI elements
│   │               ├── pages/          # Route-specific pages
│   │               └── routes/         # Navigation config
│   │
│   ├── models/                         # AI models
│   │   ├── yolov8n.pt                 # Vehicle detection weights
│   │   └── siren_detection.h5         # Audio classification
│   │
│   ├── simulations/                    # Traffic simulations
│   │   ├── rippling_effect.py         # Congestion spread model
│   │   └── traffic_simulator.py       # Junction flow simulator
│   │
│   ├── utils/                          # Utility scripts
│   │  
│   │                  
│   │
│   ├── alert.wav                      # Emergency sound
│   ├── dashboard.png                  # Admin UI mockup
│   └── README.md                      # Setup instructions

```




## 🖼️ Snippets 
*Landing page of Signal-X*
![Landingpage](Landingpage.png)

*Dashboard of Signal-X*
![Dashboard](dashboard.png)

*Auth workflow*
![userflow](userflow.png)

*Snapshots of the Citizen App*
![Snapshots](Snapshots.png)





## 🔮 Future Enhancements

- AI-powered license plate recognition 
- Reinforcement learning can optimize signal patterns dynamically based on historical and real-time traffic flow
- Detect accidents or vehicle breakdowns.


## 🤝 Contributing
#### Contributions are welcome! Please feel free to submit a Pull Request.

- Fork the repository
- Create your feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add some amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request
