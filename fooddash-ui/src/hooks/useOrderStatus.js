// import { useState, useEffect, useRef } from 'react';
// import { getOrder } from '../api/endpoints';


// export function useOrderStatus(orderId) {
//     const [order, setOrder] = useState(null);
//     const intervalRef = useRef(null);
//     const TERMINAL = ['DELIVERED','PICKED_UP','CANCELLED'];


//     useEffect(() => {
//         if (!orderId) return;
//         const fetchOrder = async () => {
//         try {
//             const { data } = await getOrder(orderId);
//             setOrder(data.data);
//             if (TERMINAL.includes(data.data.status))
//                 clearInterval(intervalRef.current);
//         } catch (e) {
//             console.error('Polling error:', e);
//         }
//         };
//         fetchOrder();
//         intervalRef.current = setInterval(fetchOrder, 5000);
//         return () => clearInterval(intervalRef.current);
//         }, [orderId]);

//     return { order };
// }

import { useState, useEffect, useRef } from 'react';
import { getOrder } from '../api/endpoints';
// Replace the polling version with this WebSocket version.
// The interface (what it returns) is identical — OrderPage.jsx needs no changes.
export function useOrderStatus(orderId) {
    const [order, setOrder] = useState(null);
    const socketRef = useRef(null);
    useEffect(() => {
        if (!orderId) return;
        // Step 1 — fetch current order via REST immediately on mount
        getOrder(orderId).then(({ data }) => setOrder(data.data));
        // Step 2 — open WebSocket for instant live updates
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const wsUrl = apiBase.replace(/^http/, 'ws') + `/ws/orders/${orderId}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        socket.onopen = () => console.log('WS connected for order', orderId);
        socket.onclose = () => console.log('WS disconnected for order', orderId);
        socket.onerror = (e) => console.error('WS error:', e);
        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.data) setOrder(msg.data); // server sends { data: order }
            } catch { /* ignore parse errors */ }
        };
        return () => socket.close(); // cleanup on unmount or orderId change
    }, [orderId]);
    return { order };
}