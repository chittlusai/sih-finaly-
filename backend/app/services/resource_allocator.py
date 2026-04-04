import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class ResourceAllocator:
    def __init__(self):
        # Local mock cache, typically populated by the DB Service
        self.shelters = [
            {"shelter_id": "SH_01", "name": "Kochi Central School", "capacity": 200, "current_occupancy": 50, "location": "Kochi"},
            {"shelter_id": "SH_02", "name": "Alappuzha Stadium", "capacity": 500, "current_occupancy": 480, "location": "Alappuzha"},
            {"shelter_id": "SH_03", "name": "Thrissur Town Hall", "capacity": 300, "current_occupancy": 100, "location": "Thrissur"}
        ]
        self.ambulances = [
            {"ambulance_id": "AMB_01", "status": "available", "location": "Kochi"},
            {"ambulance_id": "AMB_02", "status": "available", "location": "Kottayam"},
            {"ambulance_id": "AMB_03", "status": "in-use", "location": "Alappuzha"}
        ]

    def find_nearest_available_ambulance(self, target_location: str) -> Optional[Dict]:
        """Simple greedy allocator picking the nearest available ambulance."""
        available = [a for a in self.ambulances if a["status"] == "available"]
        if not available:
            return None
        
        # Real logic would use the RoutingService to find minimum distance
        # For mock simplicity, we prioritize exact match, then just pick the first available.
        exact_matches = [a for a in available if a["location"] == target_location]
        if exact_matches:
            return exact_matches[0]
        return available[0]

    def find_capable_shelter(self, required_capacity: int) -> Optional[Dict]:
        """Finds a shelter that can fit the required capacity."""
        for s in self.shelters:
            available_slots = s["capacity"] - s["current_occupancy"]
            if available_slots >= required_capacity:
                return s
        return None

    def allocate_force(self, severity: str, disaster_type: str) -> Dict[str, int]:
        """Determines how many units of response teams to send based on standardized rules."""
        if severity.upper() == "HIGH" or severity.upper() == "RED":
            return {"ambulances": 3, "relief_teams": 2, "inspection_teams": 0}
        elif severity.upper() == "MEDIUM" or severity.upper() == "ORANGE":
            return {"ambulances": 1, "relief_teams": 1, "inspection_teams": 1}
        else:
            return {"ambulances": 0, "relief_teams": 0, "inspection_teams": 1}

resource_allocator = ResourceAllocator()
