import heapq
from typing import List, Dict, Tuple

# Mock graph of roads in Kerala region
# Nodes are zones or coordinates (e.g. Z1, Z2, Z3)
# Edge weights are travel times or distances
ROAD_GRAPH = {
    "Kochi": {"Thrissur": 80, "Alappuzha": 55, "Kottayam": 65},
    "Thrissur": {"Kochi": 80, "Palakkad": 70, "Malappuram": 90},
    "Alappuzha": {"Kochi": 55, "Kottayam": 45, "Kollam": 85},
    "Palakkad": {"Thrissur": 70, "Malappuram": 80, "Coimbatore": 50},
    "Kottayam": {"Kochi": 65, "Alappuzha": 45, "Idukki": 95},
    "Malappuram": {"Thrissur": 90, "Palakkad": 80, "Kozhikode": 55},
    "Kollam": {"Alappuzha": 85, "Trivandrum": 65},
    "Idukki": {"Kottayam": 95},
    "Kozhikode": {"Malappuram": 55},
    "Trivandrum": {"Kollam": 65},
    "Coimbatore": {"Palakkad": 50}
}

class RoutingService:
    def __init__(self):
        self.graph = ROAD_GRAPH
        self.blocked_roads = set()

    def update_road_status(self, u: str, v: str, status: str):
        """Block or unblock a road segment."""
        edge = tuple(sorted([u, v]))
        if status == "blocked":
            self.blocked_roads.add(edge)
        elif status == "clear" and edge in self.blocked_roads:
            self.blocked_roads.remove(edge)

    def get_shortest_safe_path(self, start: str, end: str) -> Tuple[List[str], int]:
        """
        Dijkstra's shortest path algorithm that avoids blocked edges.
        Returns a tuple: (path_list, total_distance)
        """
        if start not in self.graph or end not in self.graph:
            return ([], float('inf'))

        distances = {node: float('inf') for node in self.graph}
        distances[start] = 0
        previous_nodes = {node: None for node in self.graph}
        pq = [(0, start)]

        while pq:
            current_distance, current_node = heapq.heappop(pq)

            if current_distance > distances[current_node]:
                continue

            if current_node == end:
                break

            for neighbor, weight in self.graph[current_node].items():
                edge = tuple(sorted([current_node, neighbor]))
                
                # Check if road is blocked
                if edge in self.blocked_roads:
                    continue
                
                distance = current_distance + weight

                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(pq, (distance, neighbor))

        # Reconstruct path
        path = []
        curr = end
        while curr is not None:
            path.append(curr)
            curr = previous_nodes[curr]
            
        path.reverse()

        if path[0] == start:
            return (path, distances[end])
        return ([], float('inf'))

routing_service = RoutingService()
