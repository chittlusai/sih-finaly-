import { useState, useEffect } from 'react';

export function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const [currentState, setCurrentState] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Connected to WebSocket:', url);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("New Event Received:", data);
                setCurrentState(data);
                
                // Keep the last 10 messages for feed
                setMessages(prev => {
                    const newMsg = [data, ...prev];
                    return newMsg.slice(0, 10);
                });
            } catch (err) {
                console.error("Failed to parse websocket message", err);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return { messages, currentState };
}
