from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import json
import logging
from app.agents.prompts import (
    ENVIRONMENTAL_ANALYST_PROMPT,
    LOGISTICS_PLANNER_PROMPT,
    MEDICAL_AGENT_PROMPT,
    SUPERVISOR_PROMPT
)
from app.core.config import settings
from app.models.schemas import AgentResponse

from app.services.routing import routing_service
from app.services.resource_allocator import resource_allocator

logger = logging.getLogger(__name__)

class DisasterState(TypedDict):
    sensor_data: Dict[str, Any]
    resources: List[Dict[str, Any]]
    environmental_assessment: Dict[str, Any]
    logistics_plan: Dict[str, Any]
    medical_plan: Dict[str, Any]
    final_plan: Dict[str, Any]
    all_responses: List[AgentResponse]

llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY, model="gpt-4o-mini").bind(response_format={"type": "json_object"})

def fallback_if_no_api_key(func):
    """Decorator to mock LLM if no API key is provided."""
    def wrapper(state: DisasterState):
        if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "":
            logger.warning("No API key provided. Using mock LLM response.")
            location = state["sensor_data"].get("location", "Kochi")
            severity = "High" if state["sensor_data"].get("value", 0) > 5 else "Medium"
            
            # Algorithmic integrations
            ambulance = resource_allocator.find_nearest_available_ambulance(location)
            shelter = resource_allocator.find_capable_shelter(100)
            
            # Simple routing attempt back to a hub (e.g. Kochi) if not already there
            safe_route, distance = routing_service.get_shortest_safe_path(location, "Kochi") if location != "Kochi" else (["Kochi"], 0)
            
            mock_res = {
                "disaster_type": "Flood" if state["sensor_data"].get("sensor_type") == "water_level" else "Earthquake",
                "severity": severity,
                "recommended_zone": "Red" if severity == "High" else "Orange",
                "raw_thought_process": "Algorithmic proxy thought due to missing API key.",
                "action_plan": f"Mocked action plan for {func.__name__}. Assigned units.",
                "ambulance_id": ambulance["ambulance_id"] if ambulance else None,
                "shelter_id": shelter["shelter_id"] if shelter else None,
                "safe_route": safe_route
            }
            
            # Map function name to the correct StateGraph key
            func_name_to_key = {
                "environmental_analyst": "environmental_assessment",
                "logistics_planner": "logistics_plan",
                "medical_agent": "medical_plan",
                "supervisor": "final_plan"
            }
            key = func_name_to_key.get(func.__name__, func.__name__)
            return {key: mock_res}
        return func(state)
    return wrapper

@fallback_if_no_api_key
def environmental_analyst(state: DisasterState):
    sensor_data = state["sensor_data"]
    messages = [
        SystemMessage(content=ENVIRONMENTAL_ANALYST_PROMPT),
        HumanMessage(content=f"Sensor Data:\n{json.dumps(sensor_data, indent=2)}")
    ]
    response = llm.invoke(messages)
    try:
        content = json.loads(response.content)
    except:
        content = {"action_plan": "Failed to parse JSON."}
    return {"environmental_assessment": content}

@fallback_if_no_api_key
def logistics_planner(state: DisasterState):
    env = state["environmental_assessment"]
    res = state["resources"]
    messages = [
        SystemMessage(content=LOGISTICS_PLANNER_PROMPT),
        HumanMessage(content=f"Env Assessment:\n{json.dumps(env)}\nAvailable Resources:\n{json.dumps(res)}")
    ]
    response = llm.invoke(messages)
    try:
        content = json.loads(response.content)
    except:
        content = {"action_plan": "Failed to parse JSON."}
    return {"logistics_plan": content}

@fallback_if_no_api_key
def medical_agent(state: DisasterState):
    env = state["environmental_assessment"]
    res = state["resources"]
    messages = [
        SystemMessage(content=MEDICAL_AGENT_PROMPT),
        HumanMessage(content=f"Env Assessment:\n{json.dumps(env)}\nAvailable Resources:\n{json.dumps(res)}")
    ]
    response = llm.invoke(messages)
    try:
        content = json.loads(response.content)
    except:
        content = {"action_plan": "Failed to parse JSON."}
    return {"medical_plan": content}

@fallback_if_no_api_key
def supervisor(state: DisasterState):
    logistics = state.get("logistics_plan", {})
    medical = state.get("medical_plan", {})
    messages = [
        SystemMessage(content=SUPERVISOR_PROMPT),
        HumanMessage(content=f"Logistics Plan:\n{json.dumps(logistics)}\nMedical Plan:\n{json.dumps(medical)}")
    ]
    response = llm.invoke(messages)
    try:
        content = json.loads(response.content)
    except:
        content = {"action_plan": "Failed to parse JSON."}
    return {"final_plan": content}


def build_response_list(state: DisasterState):
    from datetime import datetime
    responses = []
    keys_map = {
        "environmental_assessment": "Environmental Analyst",
        "logistics_plan": "Logistics Planner",
        "medical_plan": "Medical Agent",
        "final_plan": "Supervisor"
    }
    for key, name in keys_map.items():
        if key in state and state[key]:
            data = state[key]
            responses.append(AgentResponse(
                agent_name=name,
                disaster_type=data.get("disaster_type", "Unknown"),
                severity=data.get("severity", "Unknown"),
                recommended_zone=data.get("recommended_zone", "Unknown"),
                action_plan=data.get("action_plan", "Pending"),
                ambulance_id=data.get("ambulance_id"),
                safe_route=data.get("safe_route"),
                shelter_id=data.get("shelter_id"),
                raw_thought_process=data.get("raw_thought_process", "N/A"),
                timestamp=datetime.utcnow().isoformat()
            ))
    return {"all_responses": responses}

# Build the Graph
workflow = StateGraph(DisasterState)

workflow.add_node("environmental_assessment", environmental_analyst)
workflow.add_node("logistics_plan", logistics_planner)
workflow.add_node("medical_plan", medical_agent)
workflow.add_node("final_plan", supervisor)
workflow.add_node("build_response", build_response_list)

workflow.set_entry_point("environmental_assessment")
workflow.add_edge("environmental_assessment", "logistics_plan")
workflow.add_edge("environmental_assessment", "medical_plan")
workflow.add_edge("logistics_plan", "final_plan")
workflow.add_edge("medical_plan", "final_plan")
workflow.add_edge("final_plan", "build_response")
workflow.add_edge("build_response", END)

app_graph = workflow.compile()
