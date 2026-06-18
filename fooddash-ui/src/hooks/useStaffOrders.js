import { useState, useEffect, useRef } from 'react';
// import { getTodaysOrders } from '../api/endpoints';
// Polls for today's orders every 10 seconds.
// refresh() forces an immediate re-fetch after a status change.
export function useStaffOrders(statusFilter = '') {
    const [orders, setOrders]
        = useState([]);
    const [loading, setLoading] = useState(true);
    const intervalRef
        = useRef(null);
    const fetchOrders = async () => {
        try {
            // const { data } = await getTodaysOrders();
            // const filtered = statusFilter ?
            //     data.data.filter(o => o.status === statusFilter) : data.data;
            // setOrders(filtered);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(() => {
        fetchOrders();
        intervalRef.current = setInterval(fetchOrders, 10000);
        return () => clearInterval(intervalRef.current);
    }, [statusFilter]);
    return { orders, loading, refresh: fetchOrders };
}