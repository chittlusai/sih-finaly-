from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.simulator import subscribers
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws/simulation")
async def simulation_websocket(websocket: WebSocket):
    await websocket.accept()
    subscribers.add(websocket)
    logger.info(f"Client connected. Active subscribers: {len(subscribers)}")
    try:
        while True:
            # We don't expect data from client, but we must listen to detect disconnects
            await websocket.receive_text()
    except WebSocketDisconnect:
        subscribers.remove(websocket)
        logger.info(f"Client disconnected. Active subscribers: {len(subscribers)}")
