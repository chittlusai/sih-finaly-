import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { DisasterMap } from './components/DisasterMap';
import { AgentFeed } from './components/AgentFeed';
import {
    Activity,
    History,
    Map,
    Bot,
    ShieldAlert,
    Radio,
    Users,
    Package,
    Clock,
    Navigation,
    AlertTriangle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    LogOut,
    UserPlus
} from 'lucide-react';
import './App.css';

function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError('Enter your email and password.');
            return;
        }

        if (!email.includes('@')) {
            setError('Enter a valid email address.');
            return;
        }

        if (remember) {
            localStorage.setItem('commandXLoggedIn', 'true');
            localStorage.setItem('commandXUser', email);
        }

        onLogin(email);
    };

    return (
        <div className="login-page">

            <div className="tactical-grid"></div>

            <div className="login-left">

                <div className="login-brand">
                    <div className="login-shield">
                        <ShieldAlert size={34} />
                    </div>

                    <div>
                        <h1>COMMAND-X</h1>
                        <span>TACTICAL DISASTER RESPONSE</span>
                    </div>
                </div>

                <div className="login-message">
                    <span className="login-kicker">
                        <Radio size={14} />
                        SECURE OPERATIONS NETWORK
                    </span>

                    <h2>
                        Intelligent Response.
                        <br />
                        <span>Critical Decisions.</span>
                    </h2>

                    <p>
                        AI-powered disaster monitoring, threat analysis
                        and emergency response coordination.
                    </p>

                    <div className="security-status">
                        <span className="security-dot"></span>
                        SECURE COMMAND CHANNEL
                    </div>
                </div>

            </div>

            <div className="login-card">

                <div className="login-card-header">
                    <div className="login-icon">
                        <Lock size={21} />
                    </div>

                    <div>
                        <h2>Command Login</h2>
                        <p>Authorized personnel only</p>
                    </div>
                </div>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>

                    <div className="login-input">
                        <Mail size={17} />

                        <input
                            type="email"
                            placeholder="operator@command-x.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                        />
                    </div>

                    <label>Password</label>

                    <div className="login-input">
                        <Lock size={17} />

                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter secure password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={17} />
                            ) : (
                                <Eye size={17} />
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="login-error">
                            <AlertTriangle size={14} />
                            {error}
                        </div>
                    )}

                    <div className="login-options">

                        <label className="remember">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) =>
                                    setRemember(e.target.checked)
                                }
                            />
                            <span>Remember session</span>
                        </label>

                        <button
                            type="button"
                            className="forgot-button"
                            onClick={() =>
                                alert(
                                    'Contact the system administrator to reset your password.'
                                )
                            }
                        >
                            Forgot password?
                        </button>

                    </div>

                    <button className="login-button" type="submit">
                        <ShieldAlert size={18} />
                        ENTER COMMAND CENTER
                    </button>

                </form>

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <button
                    className="register-button"
                    onClick={() =>
                        alert(
                            'Registration will be connected to the backend in the next phase.'
                        )
                    }
                >
                    <UserPlus size={16} />
                    REQUEST OPERATOR ACCESS
                </button>

                <div className="login-footer">
                    <span className="green-dot"></span>
                    ENCRYPTED CONNECTION
                    <span>•</span>
                    COMMAND-X v1.0
                </div>

            </div>
        </div>
    );
}


function Dashboard({ onLogout }) {

    const { messages, currentState } = useWebSocket(
        'ws://localhost:8000/ws/simulation'
    );

    const isOnline = Boolean(currentState);

    const location =
        currentState?.sensor_data?.location || 'Monitoring Area';

    const sensorValue =
        currentState?.sensor_data?.value ?? '--';

    const sensorUnit =
        currentState?.sensor_data?.unit || '';

    const sensorType =
        currentState?.sensor_data?.sensor_type || 'Sensor';

    const response =
        currentState?.resolved_plan ||
        'Waiting for AI response...';

    return (
        <div className="command-app">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        <ShieldAlert size={25} />
                    </div>

                    <div>
                        <h2>COMMAND-X</h2>
                        <span>TACTICAL RESPONSE</span>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <div className="nav-item active">
                        <Activity size={19} />
                        <span>Overview</span>
                    </div>

                    <div className="nav-item">
                        <Map size={19} />
                        <span>Live Map</span>
                    </div>

                    <div className="nav-item">
                        <Bot size={19} />
                        <span>AI Agents</span>
                    </div>

                    <div className="nav-item">
                        <Users size={19} />
                        <span>Response Teams</span>
                    </div>

                    <div className="nav-item">
                        <Package size={19} />
                        <span>Resources</span>
                    </div>

                    <div className="nav-item">
                        <History size={19} />
                        <span>Audit History</span>
                    </div>

                </nav>

                <div className="sidebar-bottom">

                    <div className="system-mini">

                        <span
                            className={`mini-dot ${
                                isOnline ? 'online' : 'offline'
                            }`}
                        />

                        <div>
                            <strong>
                                {isOnline
                                    ? 'SYSTEM ONLINE'
                                    : 'SYSTEM OFFLINE'}
                            </strong>

                            <small>
                                Command Center
                            </small>
                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={onLogout}
                    >
                        <LogOut size={16} />
                        LOG OUT
                    </button>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main-content">

                <header className="top-header">

                    <div>

                        <div className="eyebrow">
                            <Radio size={15} />
                            REAL-TIME OPERATIONS
                        </div>

                        <h1>Disaster Command Center</h1>

                        <p>
                            AI-powered emergency monitoring and
                            response coordination
                        </p>

                    </div>

                    <div
                        className={`connection ${
                            isOnline
                                ? 'connection-online'
                                : ''
                        }`}
                    >

                        <span className="connection-dot" />

                        <div>
                            <strong>
                                {isOnline ? 'LIVE' : 'WAITING'}
                            </strong>

                            <small>
                                {isOnline
                                    ? 'Receiving telemetry'
                                    : 'Connecting to response engine'}
                            </small>
                        </div>

                    </div>

                </header>

                {/* STATISTICS */}
                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon red">
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <span>ACTIVE INCIDENTS</span>
                            <strong>
                                {isOnline ? '01' : '00'}
                            </strong>
                        </div>

                        <small className="stat-live">
                            {isOnline ? 'LIVE' : 'STANDBY'}
                        </small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            <Bot size={20} />
                        </div>

                        <div>
                            <span>AI AGENTS</span>
                            <strong>04</strong>
                        </div>

                        <small>ACTIVE</small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon green">
                            <Users size={20} />
                        </div>

                        <div>
                            <span>RESPONSE TEAMS</span>
                            <strong>08</strong>
                        </div>

                        <small>AVAILABLE</small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon orange">
                            <Clock size={20} />
                        </div>

                        <div>
                            <span>RESPONSE TIME</span>
                            <strong>02:14</strong>
                        </div>

                        <small>AVG.</small>

                    </div>

                </section>

                {/* OPERATIONS */}
                <section className="operations-grid">

                    <div className="panel agent-panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-kicker">
                                    INTELLIGENCE
                                </span>

                                <h2>
                                    <Bot size={19} />
                                    AI Agent Activity
                                </h2>

                            </div>

                            <span className="live-badge">
                                ● LIVE
                            </span>

                        </div>

                        <div className="agent-feed-container">
                            <AgentFeed messages={messages} />
                        </div>

                    </div>

                    <div className="panel map-panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-kicker">
                                    GEOSPATIAL
                                </span>

                                <h2>
                                    <Map size={19} />
                                    Live Response Map
                                </h2>

                            </div>

                            <div className="map-status">
                                <span />
                                LIVE TRACKING
                            </div>

                        </div>

                        <div className="map-container">

                            <DisasterMap
                                currentState={currentState}
                            />

                            <div className="map-overlay">

                                <div className="map-location">
                                    <Navigation size={14} />
                                    {location}
                                </div>

                                <div className="map-legend">

                                    <div>
                                        <span className="legend-dot danger" />
                                        Incident
                                    </div>

                                    <div>
                                        <span className="legend-dot team" />
                                        Response Team
                                    </div>

                                    <div>
                                        <span className="legend-dot safe" />
                                        Safe Zone
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* INCIDENT */}
                <section className="bottom-grid">

                    <div className="panel incident-panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-kicker">
                                    CURRENT INCIDENT
                                </span>

                                <h2>
                                    <AlertTriangle size={19} />
                                    Critical Threat
                                </h2>

                            </div>

                            <button
                                className="audit-button"
                                onClick={async () => {

                                    try {

                                        const res =
                                            await fetch(
                                                'http://localhost:8000/api/history'
                                            );

                                        const data =
                                            await res.json();

                                        alert(
                                            `Fetched ${
                                                data.history?.length || 0
                                            } audit ticks from system memory.`
                                        );

                                        console.log(
                                            data.history
                                        );

                                    } catch {

                                        alert(
                                            'Backend is not connected yet.'
                                        );

                                    }

                                }}
                            >
                                <History size={16} />
                                Audit Timeline
                            </button>

                        </div>

                        <div className="incident-details">

                            <div className="detail-box">
                                <span>LOCATION</span>
                                <strong>{location}</strong>
                            </div>

                            <div className="detail-box">
                                <span>SENSOR TYPE</span>
                                <strong>{sensorType}</strong>
                            </div>

                            <div className="detail-box">
                                <span>READING</span>
                                <strong>
                                    {sensorValue} {sensorUnit}
                                </strong>
                            </div>

                            <div className="response-box">
                                <span>AI RESPONSE PLAN</span>
                                <p>{response}</p>
                            </div>

                        </div>

                    </div>

                </section>

                <footer className="command-footer">

                    <span>
                        COMMAND-X • TACTICAL DISASTER RESPONSE
                    </span>

                    <span>
                        <span className="footer-dot" />
                        SYSTEM MONITORING
                    </span>

                </footer>

            </main>

        </div>
    );
}


function App() {

    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem('commandXLoggedIn') === 'true'
    );

    const handleLogin = (email) => {
        setLoggedIn(true);
        localStorage.setItem('commandXUser', email);
    };

    const handleLogout = () => {
        localStorage.removeItem('commandXLoggedIn');
        localStorage.removeItem('commandXUser');
        setLoggedIn(false);
    };

    if (!loggedIn) {
        return (
            <LoginScreen
                onLogin={handleLogin}
            />
        );
    }

    return (
        <Dashboard
            onLogout={handleLogout}
        />
    );
}

export default App;