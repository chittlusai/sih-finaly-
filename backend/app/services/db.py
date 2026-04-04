from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[settings.MONGO_DB_NAME]
            self.states_collection = self.db["simulation_states"]
            self.resources_collection = self.db["resources"]
            logger.info("MongoDB client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB client: {e}")
            self.db = None
            self.states_collection = None
            self.resources_collection = None

    async def save_state(self, state_dict: dict):
        if self.states_collection is not None:
            try:
                await self.states_collection.insert_one(state_dict)
            except Exception as e:
                logger.error(f"Could not save state to MongoDB: {e}")
        else:
            if not hasattr(self, 'mock_states'):
                self.mock_states = []
            self.mock_states.append(state_dict)
            self.mock_states = self.mock_states[-50:]  # keep last 50
            logger.info("Mock DB: State saved in memory.")

    async def get_recent_states(self, limit: int = 50):
        if self.states_collection is not None:
            try:
                cursor = self.states_collection.find().sort("created_at", -1).limit(limit)
                states = await cursor.to_list(length=limit)
                # Ensure ObjectId is cleaned up for JSON serialize
                for s in states:
                    if "_id" in s:
                        del s["_id"]
                return states
            except Exception as e:
                logger.error(f"Could not fetch states from MongoDB: {e}")
                return []
        else:
            return getattr(self, 'mock_states', [])[::-1]

    async def get_available_resources(self):
        if self.resources_collection is not None:
            try:
                cursor = self.resources_collection.find({"status": "available"})
                return await cursor.to_list(length=100)
            except Exception as e:
                logger.error(f"Error fetching resources: {e}")
        
        # Fallback mock data if DB isn't running
        return [
            {"type": "Shelter", "name": "Relief Camp Alpha", "location": "Kochi", "capacity": 500},
            {"type": "Ambulance", "name": "Medical Unit 1", "location": "Alappuzha", "status": "available"}
        ]

db_service = DatabaseService()
