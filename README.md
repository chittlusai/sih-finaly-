# Real-Time Multi-Agent Disaster Response Engine

A real-time disaster simulation platform that uses multiple AI agents to analyze risk zones, allocate emergency resources, and stream live decisions to a monitoring dashboard.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-purple.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)

## 📌 Problem

Emergency response systems often struggle with:
- delayed situational awareness
- conflicting resource decisions
- lack of live coordination across teams

## 📺 Live Simulation Feed
<img src="assets/dashboard.png" width="800" alt="Dashboard Simulation Screenshot">

### Multi-Agent Flow & Spatial Rendering
<div style="display: flex; gap: 20px; align-items: flex-start; justify-content: space-between;">
  <img src="assets/agent-flow.png" width="45%" alt="Agent Logic Pipeline">
  <img src="assets/zone-map.png" width="50%" alt="Threat Zone Geographic Map">
</div>

## 🏗️ My Contribution
- designed multi-agent orchestration with LangGraph
- built real-time WebSocket event streaming
- implemented conflict resolution between resource-planning agents
- created route safety filtering over blocked road segments
- persisted simulation snapshots in MongoDB
- built live geospatial dashboard using React + Leaflet

## 🚀 How to Run locally

### 1. Database & Environment
You will need an active MongoDB connection and an OpenAI API Key.
```bash
# Set in your environment or .env
OPENAI_API_KEY=sk-...
MONGO_URI=mongodb://localhost:27017
```
*(Note: A fallback mock mode executes locally if API keys drop).*

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

## 📊 Measurable Outputs
- **Latency**: average decision latency in mock mode is ~350ms per multi-agent cycle.
- **Simulation**: Continually processes multi-node road networks and shelter availability snapshots.
- **Data Pipeline**: Supports concurrent WebSocket clients receiving broadcasted MongoDB JSON states.

## ⚠️ Limitations
- uses simulated disaster feeds
- route planning currently works on a simplified graph
- no live government data feed integration yet
- LLM reasoning can vary, so deterministic fallbacks are included

---
**Author**: Pavan (Sai Pavan)
