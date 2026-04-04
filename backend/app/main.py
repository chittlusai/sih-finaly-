from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging

from app.api.websockets import router as websocket_router
from app.services.simulator import simulation_loop
from app.services.db import db_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Disaster Response Engine")

# Allow connecting from any origin (React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router)

@app.on_event("startup")
async def startup_event():
    # Start the simulation background task
    asyncio.create_task(simulation_loop())
    logger.info("Simulation loop started!")

@app.get("/")
def read_root():
    return {"message": "Disaster Response Engine is running"}

@app.get("/api/history")
async def get_history():
    states = await db_service.get_recent_states(limit=10)
    return {"history": states}
