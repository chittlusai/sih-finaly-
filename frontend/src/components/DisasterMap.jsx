import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Kerala
const KERALA_CENTER = [10.5276, 76.2144];

const colorMap = {
    "Red": "#ff4444",
    "Orange": "#ffbb33",
    "Yellow": "#ffeb3b",
    "Green": "#00C851"
};

// Component to dynamically recenter map if latest event happens
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if(center) {
            map.flyTo(center, 9, { animate: true });
        }
    }, [center, map]);
    return null;
}

export function DisasterMap({ currentState }) {
    const [zones, setZones] = useState([]);

    useEffect(() => {
        if (currentState && currentState.sensor_data) {
            const { latitude, longitude, location, value } = currentState.sensor_data;
            
            // Assume the environmental agent's zone recommendation dictates color
            const envAgent = currentState.agent_responses.find(a => a.agent_name === "Environmental Analyst");
            const recommendedZone = envAgent ? envAgent.recommended_zone : "Green";
            
            setZones(prev => {
                // Keep only last 5 active threat zones to avoid clutter
                const newZones = [...prev, {
                    id: currentState.event_id,
                    lat: latitude,
                    lng: longitude,
                    radius: Math.min(value * 5000, 50000), // Dynamic radius based on value
                    color: colorMap[recommendedZone] || "#33b5e5",
                    locationName: location,
                    severity: envAgent ? envAgent.severity : "Unknown",
                    details: currentState.resolved_plan
                }];
                return newZones.slice(-5);
            });
        }
    }, [currentState]);

    const latestCenter = zones.length > 0 ? [zones[zones.length - 1].lat, zones[zones.length - 1].lng] : KERALA_CENTER;

    return (
        <div className="map-container">
            <MapContainer center={KERALA_CENTER} zoom={8} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                <MapUpdater center={latestCenter} />
                {zones.map(zone => (
                    <Circle
                        key={zone.id}
                        center={[zone.lat, zone.lng]}
                        pathOptions={{ 
                            fillColor: zone.color, 
                            color: zone.color, 
                            weight: 2, 
                            fillOpacity: 0.4 
                        }}
                        radius={zone.radius}
                    >
                        <Popup className="premium-popup">
                            <div className="popup-content">
                                <strong>{zone.locationName} Threat Zone</strong>
                                <br />Severity: <span style={{color: zone.color}}>{zone.severity}</span>
                                <p>{zone.details}</p>
                            </div>
                        </Popup>
                    </Circle>
                ))}
            </MapContainer>
        </div>
    );
}
