import React, { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Circle,
    Popup,
    useMap
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

// Kerala center
const KERALA_CENTER = [10.5276, 76.2144];

const colorMap = {
    Red: '#ff4444',
    Orange: '#ffbb33',
    Yellow: '#ffeb3b',
    Green: '#00C851'
};

// Automatically move map to latest incident
function MapUpdater({ center }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 9, {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, map]);

    return null;
}

export function DisasterMap({ currentState }) {
    const [zones, setZones] = useState([]);

    useEffect(() => {
        if (!currentState || !currentState.sensor_data) {
            return;
        }

        const {
            latitude,
            longitude,
            location,
            value
        } = currentState.sensor_data;

        // Safety check for coordinates
        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
        ) {
            return;
        }

        const agents = currentState.agent_responses || [];

        const envAgent = agents.find(
            (agent) =>
                agent.agent_name === 'Environmental Analyst'
        );

        const recommendedZone =
            envAgent?.recommended_zone || 'Green';

        const radius = Math.min(
            Math.max((Number(value) || 1) * 5000, 5000),
            50000
        );

        setZones((prev) => {
            const newZone = {
                id:
                    currentState.event_id ||
                    `${latitude}-${longitude}-${Date.now()}`,

                lat: latitude,
                lng: longitude,

                radius: radius,

                color:
                    colorMap[recommendedZone] ||
                    '#33b5e5',

                locationName:
                    location || 'Unknown Location',

                severity:
                    envAgent?.severity || 'Unknown',

                details:
                    currentState.resolved_plan ||
                    'Emergency response plan active.'
            };

            // Keep latest 5 incidents
            return [...prev, newZone].slice(-5);
        });
    }, [currentState]);

    const latestCenter =
        zones.length > 0
            ? [
                zones[zones.length - 1].lat,
                zones[zones.length - 1].lng
            ]
            : KERALA_CENTER;

    return (
        <div className="map-container">

            <MapContainer
                center={KERALA_CENTER}
                zoom={8}
                scrollWheelZoom={true}
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '12px'
                }}
            >

                {/* OpenStreetMap - NO API KEY REQUIRED */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapUpdater center={latestCenter} />

                {zones.map((zone) => (
                    <Circle
                        key={zone.id}
                        center={[
                            zone.lat,
                            zone.lng
                        ]}
                        radius={zone.radius}
                        pathOptions={{
                            fillColor: zone.color,
                            color: zone.color,
                            weight: 2,
                            fillOpacity: 0.4
                        }}
                    >
                        <Popup className="premium-popup">

                            <div className="popup-content">

                                <strong>
                                    {zone.locationName}
                                    {' '}Threat Zone
                                </strong>

                                <br />

                                Severity:{' '}

                                <span
                                    style={{
                                        color: zone.color,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {zone.severity}
                                </span>

                                <p>
                                    {zone.details}
                                </p>

                            </div>

                        </Popup>
                    </Circle>
                ))}

            </MapContainer>

        </div>
    );
}