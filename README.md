# Real-Time Multi-Agent Disaster Response Engine

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-purple.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)

> **Architected for autonomous real-time crisis management using advanced Multi-Agent Machine Learning ecosystems.**

## 📌 Project Overview
Built to resolve unstructured, rapidly changing crisis environments. This project simulates a catastrophe (modeled off the 2018 Kerala Floods) and uses a **LangGraph-driven Multi-Agent System (MAS)** to intercept real-time sensor streams and orchestrate human evacuation and medical response. 

The core engineering focus of this project is **Concurrency & Conflict Resolution** — ensuring multiple AI actors can coordinate safely without overlapping critical infrastructure bounds.

## 🧠 System Architecture

1. **Event-Driven Telemetry (FastAPI & WebSockets)** 📡
   - Background tasks concurrently generate mock geographic anomalies (Water levels, Seismic Activity). 
   - State is seamlessly pushed to WebSockets for sub-second UI updates.
2. **LangGraph State Machine (Decentralized AI)** 🤖
   - `Environmental Analyst`: Identifies disaster classification and assesses Threat Zones dynamically.
   - `Logistics Planner`: Queries available structural resources and plans topological evacuation routes.
   - `Medical Agent`: Dedicated sub-agent enforcing strict survival prioritization grids.
   - `Supervisor Node`: **A custom conflict-resolution algorithm** that monitors the graph execution edge routing. If the Medical and Logistics agents request overlapping physical bandwidth, the Supervisor enforces synchronization.
3. **Reactive Visualization (React & Leaflet)** 🗺️
   - Fully headless rendering. Live AI decisions mutate GeoJSON polygons bounding the Threat Zones in real-time.

## 🚀 How to Run locally

### 1. Database & Environment
You will need an active MongoDB connection and an OpenAI API Key.
```bash
# Set in your environment or .env
OPENAI_API_KEY=sk-...
MONGO_URI=mongodb://localhost:27017
```
*(Note: A seamless fallback executes mocked local responses if API keys drop, ensuring 100% demo uptime).*

### 2. Start the Backend (Engine)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Start the Frontend (Command Center Dash)
```powershell
cd frontend
npm install
npm run dev
```

## 👨‍💻 Author
**Pavan (Sai Pavan)**
- GitHub: [@Saipavanavsp](https://github.com/Saipavanavsp)
- Specialization: applied-ML ecosystems, Multi-Agent pipelines, and robust backend engineering.
