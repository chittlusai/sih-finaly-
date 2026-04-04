from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SensorData(BaseModel):
    sensor_id: str
    location: str
    latitude: float
    longitude: float
    sensor_type: str  # e.g., "water_level", "seismic"
    value: float
    unit: str
    timestamp: str

class AgentResponse(BaseModel):
    agent_name: str
    disaster_type: str
    severity: str  # High, Medium, Low
    recommended_zone: str  # Red, Orange, Yellow, Green
    action_plan: str
    ambulance_id: Optional[str] = None
    safe_route: Optional[List[str]] = None
    shelter_id: Optional[str] = None
    raw_thought_process: str
    timestamp: str

class SimulationState(BaseModel):
    event_id: str
    sensor_data: SensorData
    agent_responses: List[AgentResponse]
    resolved_plan: Optional[str] = None
    created_at: datetime
