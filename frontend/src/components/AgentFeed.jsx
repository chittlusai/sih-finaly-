import React from 'react';
import { ShieldAlert, BrainCircuit, Activity, Navigation, Menu } from 'lucide-react';

const agentIcons = {
    "Environmental Analyst": <Activity className="icon text-blue" />,
    "Logistics Planner": <Navigation className="icon text-green" />,
    "Medical Agent": <HeartIcon className="icon text-red" />,
    "Supervisor": <ShieldAlert className="icon text-purple" />
};

function HeartIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    );
}

export function AgentFeed({ messages }) {
    if (!messages || messages.length === 0) {
        return (
            <div className="agent-feed-container empty">
                <BrainCircuit className="pulse-icon" size={48} />
                <p>Waiting for agent transmissions...</p>
            </div>
        );
    }

    return (
        <div className="agent-feed-container">
            <h2>Live Agent Comms</h2>
            <div className="feed-scroll">
                {messages.map((eventState) => (
                    <div key={eventState.event_id} className="event-group">
                        <div className="event-header">
                            <span className="event-time">{new Date(eventState.created_at).toLocaleTimeString()}</span>
                            <span className="event-sensor">Sensor {eventState.sensor_data.location}</span>
                        </div>
                        {eventState.agent_responses.map((resp, idx) => (
                            <div key={idx} className={`agent-card fade-in`} style={{'--animation-order': idx}}>
                                <div className="agent-card-header">
                                    {agentIcons[resp.agent_name] || <BrainCircuit className="icon" />}
                                    <h3>{resp.agent_name}</h3>
                                    <span className={`severity-badge ${resp.severity.toLowerCase()}`}>{resp.severity}</span>
                                </div>
                                <div className="agent-card-body">
                                    <p className="internal-thought"><span>Thought:</span> {resp.raw_thought_process}</p>
                                    <p className="action-plan"><span>Action:</span> {resp.action_plan}</p>
                                </div>
                            </div>
                        ))}
                        <div className="resolved-plan">
                            <h4>Supervisor Final Plan</h4>
                            <p>{eventState.resolved_plan}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
