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
    UserPlus,
    Send,
    Truck,
    HeartPulse,
    Droplets,
    CheckCircle,
    MessageSquare
} from 'lucide-react';

import './App.css';


/* =========================================================
   LOGIN SCREEN
========================================================= */

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
            localStorage.setItem(
                'commandXLoggedIn',
                'true'
            );
        }

        localStorage.setItem(
            'commandXUser',
            email
        );

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
                        <span>
                            TACTICAL DISASTER RESPONSE
                        </span>
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
                        AI-powered disaster monitoring,
                        threat analysis and emergency
                        response coordination.
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
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
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
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            {showPassword
                                ? <EyeOff size={17} />
                                : <Eye size={17} />
                            }
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
                                    setRemember(
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                Remember session
                            </span>

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


                    <button
                        className="login-button"
                        type="submit"
                    >

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
                            'Operator registration will be connected to the backend in the next phase.'
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


/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
    title,
    subtitle,
    icon
}) {

    return (

        <header className="top-header">

            <div>

                <div className="eyebrow">

                    <Radio size={15} />

                    REAL-TIME OPERATIONS

                </div>

                <h1>

                    {icon}

                    {title}

                </h1>

                <p>
                    {subtitle}
                </p>

            </div>


            <div className="connection connection-online">

                <span className="connection-dot"></span>

                <div>

                    <strong>LIVE</strong>

                    <small>
                        Receiving telemetry
                    </small>

                </div>

            </div>

        </header>
    );
}


/* =========================================================
   OVERVIEW PAGE
========================================================= */

function OverviewPage({
    currentState,
    messages
}) {

    const isOnline = Boolean(currentState);

    const location =
        currentState?.sensor_data?.location ||
        'Monitoring Area';

    const sensorValue =
        currentState?.sensor_data?.value ??
        '--';

    const sensorUnit =
        currentState?.sensor_data?.unit ||
        '';

    const sensorType =
        currentState?.sensor_data?.sensor_type ||
        'Sensor';

    const response =
        currentState?.resolved_plan ||
        'Waiting for AI response...';

    return (

        <>

            <PageHeader
                title="Disaster Command Center"
                subtitle="AI-powered emergency monitoring and response coordination"
            />


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

                    <small>
                        {isOnline
                            ? 'LIVE'
                            : 'STANDBY'}
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

                        <AgentFeed
                            messages={messages}
                        />

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

                            <span></span>

                            LIVE TRACKING

                        </div>

                    </div>


                    <div className="map-container">

                        <DisasterMap
                            currentState={
                                currentState
                            }
                        />

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

                    </div>


                    <div className="incident-details">

                        <div className="detail-box">

                            <span>LOCATION</span>

                            <strong>
                                {location}
                            </strong>

                        </div>


                        <div className="detail-box">

                            <span>SENSOR TYPE</span>

                            <strong>
                                {sensorType}
                            </strong>

                        </div>


                        <div className="detail-box">

                            <span>READING</span>

                            <strong>
                                {sensorValue} {sensorUnit}
                            </strong>

                        </div>


                        <div className="response-box">

                            <span>
                                AI RESPONSE PLAN
                            </span>

                            <p>
                                {response}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </>
    );
}


/* =========================================================
   LIVE MAP PAGE
========================================================= */

function LiveMapPage({ currentState }) {

    const location =
        currentState?.sensor_data?.location ||
        'Monitoring Area';

    return (

        <>

            <PageHeader
                title="Live Response Map"
                subtitle="Real-time disaster location and threat-zone monitoring"
            />


            <div
                className="panel"
                style={{
                    height: '650px',
                    marginTop: '20px'
                }}
            >

                <div className="panel-header">

                    <div>

                        <span className="panel-kicker">
                            GEOSPATIAL INTELLIGENCE
                        </span>

                        <h2>
                            <Map size={19} />
                            {location}
                        </h2>

                    </div>

                    <div className="map-status">

                        <span></span>

                        LIVE TRACKING

                    </div>

                </div>


                <div
                    style={{
                        height: 'calc(100% - 80px)',
                        overflow: 'hidden'
                    }}
                >

                    <DisasterMap
                        currentState={
                            currentState
                        }
                    />

                </div>

            </div>

        </>
    );
}


/* =========================================================
   AI AGENTS PAGE + CHAT
========================================================= */

function AIAgentsPage({ currentState }) {

    const [chatMessages, setChatMessages] =
        useState([
            {
                sender: 'ai',
                text:
                    'COMMAND-X AI online. Ask me about the current disaster, threat level, affected location, response teams, resources, or emergency actions.'
            }
        ]);

    const [input, setInput] =
        useState('');


    const generateResponse = (question) => {

        const q =
            question.toLowerCase();

        const location =
            currentState?.sensor_data?.location ||
            'the monitored area';

        if (
            q.includes('threat') ||
            q.includes('severity') ||
            q.includes('danger')
        ) {

            return (
                'Current threat assessment: HIGH. ' +
                'Emergency response teams should remain active ' +
                'and continue monitoring the affected area.'
            );
        }


        if (
            q.includes('location') ||
            q.includes('where') ||
            q.includes('affected')
        ) {

            return (
                `The latest monitored incident is at ${location}. ` +
                'COMMAND-X is continuously receiving sensor telemetry.'
            );
        }


        if (
            q.includes('team') ||
            q.includes('response')
        ) {

            return (
                'Response teams should secure the affected area, ' +
                'assist vulnerable people, coordinate medical support, ' +
                'and maintain continuous communication.'
            );
        }


        if (
            q.includes('resource') ||
            q.includes('supply') ||
            q.includes('supplies')
        ) {

            return (
                'Recommended resources include medical supplies, ' +
                'emergency transport, rescue equipment, drinking water, ' +
                'and communication equipment.'
            );
        }


        if (
            q.includes('plan') ||
            q.includes('action')
        ) {

            return (
                'Recommended response plan: ' +
                '1. Assess the threat. ' +
                '2. Activate response teams. ' +
                '3. Move vulnerable people to safe areas. ' +
                '4. Coordinate medical support. ' +
                '5. Continue monitoring.'
            );
        }


        if (
            q.includes('summary') ||
            q.includes('summarize')
        ) {

            return (
                'COMMAND-X is monitoring a simulated disaster event. ' +
                'Environmental analysis, response coordination, ' +
                'and emergency monitoring are active.'
            );
        }


        return (
            'I can help you with threat analysis, affected locations, ' +
            'response teams, resources, emergency actions, and disaster planning.'
        );
    };


    const sendMessage = () => {

        const question =
            input.trim();

        if (!question) {
            return;
        }


        setChatMessages((prev) => [

            ...prev,

            {
                sender: 'user',
                text: question
            }

        ]);


        setInput('');


        setTimeout(() => {

            const answer =
                generateResponse(question);

            setChatMessages((prev) => [

                ...prev,

                {
                    sender: 'ai',
                    text: answer
                }

            ]);

        }, 600);
    };


    const handleKeyDown = (e) => {

        if (e.key === 'Enter') {
            sendMessage();
        }

    };


    const quickCommand = (text) => {

        setInput(text);

    };


    return (

        <>

            <PageHeader
                title="AI Agents"
                subtitle="AI-powered emergency monitoring and response coordination"
            />


            <section
                className="operations-grid"
                style={{
                    marginTop: '20px'
                }}
            >

                {/* CHAT */}

                <div
                    className="panel"
                    style={{
                        height: '620px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                    <div className="panel-header">

                        <div>

                            <span className="panel-kicker">
                                ARTIFICIAL INTELLIGENCE
                            </span>

                            <h2>
                                <MessageSquare size={19} />
                                COMMAND-X AI
                            </h2>

                        </div>

                        <span className="live-badge">
                            ● ONLINE
                        </span>

                    </div>


                    {/* CHAT AREA */}

                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '20px'
                        }}
                    >

                        {chatMessages.map(
                            (message, index) => (

                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            message.sender === 'user'
                                                ? 'flex-end'
                                                : 'flex-start',
                                        marginBottom: '15px'
                                    }}
                                >

                                    <div
                                        style={{
                                            maxWidth: '80%',
                                            padding: '13px 16px',
                                            borderRadius: '10px',
                                            background:
                                                message.sender === 'user'
                                                    ? 'rgba(155,220,84,0.18)'
                                                    : 'rgba(255,255,255,0.05)',
                                            border:
                                                '1px solid rgba(155,220,84,0.18)',
                                            color: '#e7f0df',
                                            lineHeight: '1.5',
                                            fontSize: '14px'
                                        }}
                                    >

                                        <small
                                            style={{
                                                display: 'block',
                                                color: '#91a57e',
                                                fontSize: '10px',
                                                marginBottom: '6px',
                                                fontWeight: 'bold'
                                            }}
                                        >

                                            {message.sender === 'user'
                                                ? 'YOU'
                                                : 'COMMAND-X AI'}

                                        </small>

                                        {message.text}

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* INPUT */}

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '15px',
                            borderTop:
                                '1px solid rgba(255,255,255,0.08)'
                        }}
                    >

                        <input
                            type="text"
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask COMMAND-X AI..."
                            style={{
                                flex: 1,
                                padding: '13px',
                                borderRadius: '8px',
                                border:
                                    '1px solid rgba(155,220,84,0.25)',
                                background: '#0a1209',
                                color: '#ffffff',
                                outline: 'none'
                            }}
                        />


                        <button
                            onClick={sendMessage}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '7px',
                                padding: '0 18px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#9bdc54',
                                color: '#071006',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >

                            <Send size={15} />

                            SEND

                        </button>

                    </div>

                </div>


                {/* AGENT STATUS */}

                <div className="panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-kicker">
                                AGENT STATUS
                            </span>

                            <h2>
                                <Activity size={19} />
                                Active Intelligence
                            </h2>

                        </div>

                    </div>


                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(2, 1fr)',
                            gap: '12px',
                            padding: '20px'
                        }}
                    >

                        <div className="status-card">

                            <small>
                                THREAT ANALYSIS
                            </small>

                            <strong>
                                ONLINE
                            </strong>

                        </div>


                        <div className="status-card">

                            <small>
                                RESOURCE AGENT
                            </small>

                            <strong>
                                ONLINE
                            </strong>

                        </div>


                        <div className="status-card">

                            <small>
                                RESPONSE AGENT
                            </small>

                            <strong>
                                ONLINE
                            </strong>

                        </div>


                        <div className="status-card">

                            <small>
                                COORDINATION AGENT
                            </small>

                            <strong>
                                ONLINE
                            </strong>

                        </div>

                    </div>


                    {/* QUICK COMMANDS */}

                    <div style={{ padding: '20px' }}>

                        <span className="panel-kicker">
                            QUICK COMMANDS
                        </span>


                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '15px'
                            }}
                        >

                            <button
                                className="quick-command"
                                onClick={() =>
                                    quickCommand(
                                        'What is the current threat level?'
                                    )
                                }
                            >
                                🚨 Current Threat Level
                            </button>


                            <button
                                className="quick-command"
                                onClick={() =>
                                    quickCommand(
                                        'Which location is affected?'
                                    )
                                }
                            >
                                📍 Affected Location
                            </button>


                            <button
                                className="quick-command"
                                onClick={() =>
                                    quickCommand(
                                        'What should the response team do?'
                                    )
                                }
                            >
                                🚑 Response Team Action
                            </button>


                            <button
                                className="quick-command"
                                onClick={() =>
                                    quickCommand(
                                        'Give me a disaster response plan'
                                    )
                                }
                            >
                                🧠 Generate Response Plan
                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </>
    );
}


/* =========================================================
   RESPONSE TEAMS PAGE
========================================================= */

function ResponseTeamsPage() {

    const teams = [

        {
            name: 'Rescue Team Alpha',
            type: 'SEARCH & RESCUE',
            status: 'READY',
            icon: Users
        },

        {
            name: 'Medical Unit 01',
            type: 'MEDICAL RESPONSE',
            status: 'READY',
            icon: HeartPulse
        },

        {
            name: 'Transport Team',
            type: 'EVACUATION',
            status: 'AVAILABLE',
            icon: Truck
        },

        {
            name: 'Water & Relief Unit',
            type: 'RELIEF SUPPORT',
            status: 'READY',
            icon: Droplets
        }

    ];


    return (

        <>

            <PageHeader
                title="Response Teams"
                subtitle="Emergency teams and field-unit coordination"
            />


            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(2, 1fr)',
                    gap: '18px',
                    marginTop: '20px'
                }}
            >

                {teams.map((team) => {

                    const Icon =
                        team.icon;

                    return (

                        <div
                            className="panel"
                            key={team.name}
                            style={{
                                padding: '22px'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}
                            >

                                <div
                                    className="stat-icon green"
                                >
                                    <Icon size={22} />
                                </div>


                                <div>

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        {team.name}
                                    </h2>

                                    <p
                                        style={{
                                            margin:
                                                '5px 0 0'
                                        }}
                                    >
                                        {team.type}
                                    </p>

                                </div>

                            </div>


                            <div
                                style={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >

                                <CheckCircle
                                    size={16}
                                />

                                <strong>
                                    {team.status}
                                </strong>

                            </div>

                        </div>

                    );

                })}

            </div>

        </>
    );
}


/* =========================================================
   RESOURCES PAGE
========================================================= */

function ResourcesPage() {

    const resources = [

        {
            name: 'Medical Supplies',
            available: '86%',
            icon: HeartPulse
        },

        {
            name: 'Emergency Vehicles',
            available: '72%',
            icon: Truck
        },

        {
            name: 'Drinking Water',
            available: '91%',
            icon: Droplets
        },

        {
            name: 'Rescue Equipment',
            available: '78%',
            icon: Package
        }

    ];


    return (

        <>

            <PageHeader
                title="Resources"
                subtitle="Emergency supplies and operational resources"
            />


            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(2, 1fr)',
                    gap: '18px',
                    marginTop: '20px'
                }}
            >

                {resources.map((resource) => {

                    const Icon =
                        resource.icon;

                    return (

                        <div
                            className="panel"
                            key={resource.name}
                            style={{
                                padding: '22px'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}
                            >

                                <div className="stat-icon blue">
                                    <Icon size={22} />
                                </div>

                                <div>

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        {resource.name}
                                    </h2>

                                    <p>
                                        Available inventory
                                    </p>

                                </div>

                            </div>


                            <div
                                style={{
                                    marginTop: '18px'
                                }}
                            >

                                <strong
                                    style={{
                                        fontSize: '24px'
                                    }}
                                >
                                    {resource.available}
                                </strong>

                            </div>

                        </div>

                    );

                })}

            </div>

        </>
    );
}


/* =========================================================
   AUDIT HISTORY PAGE
========================================================= */

function AuditHistoryPage() {

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(false);


    const loadHistory = async () => {

        setLoading(true);

        try {

            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response =
                await fetch(
                    `${API_BASE}/api/history`
                );

            const data =
                await response.json();

            setHistory(
                data.history || []
            );

        } catch (error) {

            console.error(
                'Audit history error:',
                error
            );

            setHistory([]);

        } finally {

            setLoading(false);

        }
    };


    return (

        <>

            <PageHeader
                title="Audit History"
                subtitle="System events and disaster-response activity"
            />


            <div
                className="panel"
                style={{
                    marginTop: '20px',
                    padding: '20px'
                }}
            >

                <div className="panel-header">

                    <div>

                        <span className="panel-kicker">
                            SYSTEM LOG
                        </span>

                        <h2>
                            <History size={19} />
                            Response Audit Timeline
                        </h2>

                    </div>


                    <button
                        className="login-button"
                        onClick={loadHistory}
                        style={{
                            width: 'auto',
                            padding: '10px 18px'
                        }}
                    >

                        <History size={15} />

                        {loading
                            ? 'LOADING...'
                            : 'REFRESH'}

                    </button>

                </div>


                {history.length === 0 ? (

                    <div
                        style={{
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >

                        <History size={35} />

                        <h3>
                            No audit records loaded
                        </h3>

                        <p>
                            Click REFRESH to retrieve
                            records from the backend.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: '20px'
                        }}
                    >

                        {history.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    style={{
                                        padding: '15px',
                                        borderBottom:
                                            '1px solid rgba(255,255,255,0.07)'
                                    }}
                                >

                                    <strong>
                                        Event {index + 1}
                                    </strong>

                                    <pre
                                        style={{
                                            whiteSpace:
                                                'pre-wrap',
                                            color:
                                                '#aebca3',
                                            fontSize:
                                                '12px'
                                        }}
                                    >
                                        {JSON.stringify(
                                            item,
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </>
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ onLogout }) {

    const API_BASE_ENV = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const WS_BASE = import.meta.env.VITE_WS_BASE_URL || API_BASE_ENV.replace(/^http/, 'ws');
    const {
        messages,
        currentState
    } = useWebSocket(
        `${WS_BASE}/ws/simulation`
    );


    const [activePage, setActivePage] =
        useState('Overview');


    const navigation = [

        {
            name: 'Overview',
            icon: Activity
        },

        {
            name: 'Live Map',
            icon: Map
        },

        {
            name: 'AI Agents',
            icon: Bot
        },

        {
            name: 'Response Teams',
            icon: Users
        },

        {
            name: 'Resources',
            icon: Package
        },

        {
            name: 'Audit History',
            icon: History
        }

    ];


    const renderPage = () => {

        switch (activePage) {

            case 'Live Map':

                return (
                    <LiveMapPage
                        currentState={
                            currentState
                        }
                    />
                );


            case 'AI Agents':

                return (
                    <AIAgentsPage
                        currentState={
                            currentState
                        }
                    />
                );


            case 'Response Teams':

                return (
                    <ResponseTeamsPage />
                );


            case 'Resources':

                return (
                    <ResourcesPage />
                );


            case 'Audit History':

                return (
                    <AuditHistoryPage />
                );


            default:

                return (
                    <OverviewPage
                        currentState={
                            currentState
                        }
                        messages={
                            messages
                        }
                    />
                );

        }
    };


    return (

        <div className="command-app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-icon">

                        <ShieldAlert size={25} />

                    </div>

                    <div>

                        <h2>
                            COMMAND-X
                        </h2>

                        <span>
                            TACTICAL RESPONSE
                        </span>

                    </div>

                </div>


                <nav className="sidebar-nav">

                    {navigation.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            const active =
                                activePage ===
                                item.name;

                            return (

                                <button
                                    key={item.name}
                                    className={
                                        `nav-item ${
                                            active
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={() =>
                                        setActivePage(
                                            item.name
                                        )
                                    }
                                >

                                    <Icon size={19} />

                                    <span>
                                        {item.name}
                                    </span>

                                </button>

                            );

                        }
                    )}

                </nav>


                <div className="sidebar-bottom">

                    <div className="system-mini">

                        <span
                            className={
                                `mini-dot ${
                                    currentState
                                        ? 'online'
                                        : 'offline'
                                }`
                            }
                        />

                        <div>

                            <strong>
                                {currentState
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

                {renderPage()}


                <footer className="command-footer">

                    <span>
                        COMMAND-X • TACTICAL DISASTER RESPONSE
                    </span>

                    <span>

                        <span className="footer-dot"></span>

                        SYSTEM MONITORING

                    </span>

                </footer>

            </main>

        </div>
    );
}


/* =========================================================
   APP
========================================================= */

function App() {

    const [loggedIn, setLoggedIn] =
        useState(
            localStorage.getItem(
                'commandXLoggedIn'
            ) === 'true'
        );


    const handleLogin = (email) => {

        setLoggedIn(true);

        localStorage.setItem(
            'commandXUser',
            email
        );

    };


    const handleLogout = () => {

        localStorage.removeItem(
            'commandXLoggedIn'
        );

        localStorage.removeItem(
            'commandXUser'
        );

        setLoggedIn(false);

    };


    if (!loggedIn) {

        return (
            <LoginScreen
                onLogin={
                    handleLogin
                }
            />
        );

    }


    return (

        <Dashboard
            onLogout={
                handleLogout
            }
        />

    );
}


export default App;