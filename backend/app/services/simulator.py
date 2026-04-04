import asyncio
import random
from datetime import datetime
import uuid
import logging
from app.agents.graph import app_graph
from app.services.db import db_service
from app.models.schemas import SimulationState, SensorData

logger = logging.getLogger(__name__)

subscribers = set()

def get_kerala_flood_mock_data():
    """Returns mock sensor data inspired by 2018 Kerala Floods."""
    latitudes = [9.9312, 10.5276, 9.5916, 10.8505]
    longitudes = [76.2673, 76.2144, 76.5222, 76.2711]
    locations = ["Kochi", "Thrissur", "Alappuzha", "Palakkad"]
    idx = random.randint(0, 3)
    
    # Randomly rapidly increasing water levels
    water_level = round(random.uniform(2.0, 10.5), 2)
    return {
        "sensor_id": f"WL-{random.randint(100,999)}",
        "location": locations[idx],
        "latitude": latitudes[idx],
        "longitude": longitudes[idx],
        "sensor_type": "water_level",
        "value": water_level,
        "unit": "meters",
        "timestamp": datetime.utcnow().isoformat()
    }

async def run_simulation_cycle():
    """Runs a single simulation cycle over LangGraph."""
    sensor_data = get_kerala_flood_mock_data()
    resources = await db_service.get_available_resources()
    
    state = {
        "sensor_data": sensor_data,
        "resources": resources,
    }
    
    logger.info(f"Triggering Simulation Cycle for Sensor: {sensor_data['sensor_id']} at {sensor_data['location']}")
    
    try:
        final_state = await asyncio.to_thread(app_graph.invoke, state)
    except Exception as e:
        logger.error(f"LangGraph failed: {e}")
        return None

    all_responses = final_state.get("all_responses", [])
    
    sim_state = SimulationState(
        event_id=str(uuid.uuid4()),
        sensor_data=SensorData(**sensor_data),
        agent_responses=all_responses,
        resolved_plan=final_state.get("final_plan", {}).get("action_plan", "No final plan."),
        created_at=datetime.utcnow()
    )
    
    state_dict = sim_state.model_dump()
    await db_service.save_state(state_dict)
    
    # Broadcast to all websocket connections
    if subscribers:
        import json
        message = sim_state.model_dump_json()
        await broadcast(message)
    
async def broadcast(message: str):
    for ws in list(subscribers):
        try:
            await ws.send_text(message)
        except Exception:
            subscribers.remove(ws)

async def simulation_loop():
    """Background task constantly generating data."""
    while True:
        await asyncio.sleep(5)  # Every 5 seconds
        await run_simulation_cycle()
