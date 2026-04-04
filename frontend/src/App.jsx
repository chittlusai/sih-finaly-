import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { DisasterMap } from './components/DisasterMap';
import { AgentFeed } from './components/AgentFeed';
import { Activity } from 'lucide-react';
import './App.css';

function App() {
    // Attempting to connect to local backend WebSocket
    const { messages, currentState } = useWebSocket('ws://localhost:8000/ws/simulation');

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="flex-center">
                    <Activity className="header-icon pulse-icon" />
                    <h1>Disaster Response Engine</h1>
                </div>
                <div className="status-indicator">
                    <span className={`dot ${currentState ? 'online' : 'offline'}`}></span>
                    <span>{currentState ? 'System Online: Receiving telemetry' : 'Waiting for connection...'}</span>
                </div>
            </header>

            <main className="dashboard">
                <section className="dashboard-left">
                    <AgentFeed messages={messages} />
                </section>
                <section className="dashboard-right">
                    <div className="map-wrapper glass-panel">
                        <DisasterMap currentState={currentState} />
                    </div>
                    {currentState && (
                        <div className="current-status-bar glass-panel">
                            <h3>Current Critical Threat</h3>
                            <div className="threat-content">
                                <p><strong>Location:</strong> {currentState.sensor_data.location}</p>
                                <p><strong>Sensor Data:</strong> {currentState.sensor_data.value} {currentState.sensor_data.unit} ({currentState.sensor_data.sensor_type})</p>
                                <p className="attention-text"><strong>Response:</strong> {currentState.resolved_plan}</p>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
