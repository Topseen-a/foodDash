import { useState } from "react";
import { updateOrderStatus } from "../api/endpoints";
import { useStaffOrders } from "../hooks/useStaffOrders";


// Maps each status to the action buttons visible on that order card.
const ACTIONS = {
    RECEIVED: [
      { label: "Start Preparing", status: "PREPARING", color: "bg-yellow-500" },
      { label: "Cancel", status: "CANCELLED", color: "bg-red-400" },
    ],
    PREPARING: [
      { label: "Mark Ready", status: "READY", color: "bg-green-500" },
      { label: "Cancel", status: "CANCELLED", color: "bg-red-400" },
    ],
    READY: [
      { label: "Delivered", status: "DELIVERED", color: "bg-blue-500" },
      { label: "Picked Up", status: "PICKED_UP", color: "bg-blue-500" },
    ],
};


function StatusBadge({ status }) {
    const s = {
    RECEIVED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-yellow-100 text-yellow-700",
    READY: "bg-green-100 text-green-700",
    DELIVERED: "bg-gray-200 text-gray-600",
    PICKED_UP: "bg-gray-200 text-gray-600",
    CANCELLED: "bg-red-100 text-red-600",
    };
    return (
        <span
        className={`px-2 py-0.5 rounded-full text-xs font-bold ${s[status] || ""}`}
        >
        {status?.replace("_", " ")}
        </span>
    );
}


function OrderCard({ order, onStatusChange }) {
    const [loading, setLoading] = useState(false);
    const actions = ACTIONS[order.status] || [];
    const handleAction = async (newStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus(order.id, { status: newStatus });
      onStatusChange();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
    };
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-bold text-lg">Order #{order.id}</p>
            <p className="text-sm text-gray-500 capitalize">
              {order.type} • {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="divide-y mb-3">
          {order.items?.map((item) => (
            <div key={item.id} className="py-1.5 flex justify-between text-sm">
              <span>
                {item.menu_item.name} × {item.quantity}
              </span>
              {item.special_instructions && (
                <span
                  className="text-gray-400 italic text-xs"
                >
                  {item.special_instructions}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span
            className="font-bold text-orange-500"
          >
            ₦{order.total_amount?.toFixed(2)}
          </span>
          <div className="flex gap-2">
            {actions.map((a) => (
              <button
                key={a.status}
                onClick={() => handleAction(a.status)}
                disabled={loading}
                className={`px-3 py-1.5 text-white rounded-lg text-sm font-medium${a.color} disabled:opacity-50`}
              >
                {loading ? "..." : a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
}


const FILTERS = ["", "RECEIVED", "PREPARING", "READY", "DELIVERED"];

const LABELS = {
    "": "All",
    RECEIVED: "Received",
    PREPARING: "Preparing",
    READY: "Ready",
    DELIVERED: "Done",
};


export default function StaffDashboard() {
    const [filter, setFilter] = useState("");
    const { orders, loading, refresh } = useStaffOrders(filter);
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Today's Orders</h1>
          <button
            onClick={refresh}
            className="text-sm text-orange-500 hover:underline"
          >
            ↻ Refresh
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium${filter === f ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {LABELS[f]}
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={refresh} />
            ))}
          </div>
        )}
      </div>
    );
}
