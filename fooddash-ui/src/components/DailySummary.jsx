import { useState, useEffect } from "react";
import api from "../api/client";


export default function DailySummary() {
    const [s, setS] = useState(null);
    useEffect(() => {
    api.get("/staff/summary").then(({ data }) => setS(data.data));
    }, []);
    if (!s) return null;
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-500 text-white rounded-xl p-4">
                <p className="text-3xl font-bold">{s.total_orders}</p>
                <p className="text-sm opacity-80">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
                <p className="text-3xl font-bold text-orange-500">
                ₦{s.total_revenue?.toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">Revenue</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
                <p className="text-3xl font-bold text-yellow-500">
                {s.by_status?.PREPARING || 0}
                </p>
                <p className="text-sm text-gray-500">In Kitchen</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
                <p className="text-3xl font-bold text-green-500">
                {s.by_status?.READY || 0}
                </p>
                <p className="text-sm text-gray-500">Ready</p>
            </div>
        </div>
    );
}
