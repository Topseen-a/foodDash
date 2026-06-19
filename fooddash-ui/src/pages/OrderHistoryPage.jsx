import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { getMyOrders } from "../api/endpoints";


function StatusBadge({ status }) {
  const s = {
    RECEIVED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-yellow-100 text-yellow-700",
    READY: "bg-green-100 text-green-700",
    DELIVERED: "bg-gray-100 text-gray-600",
    PICKED_UP: "bg-gray-100 text-gray-600",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold ${s[status] || ""}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}


export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // getMyOrders()
    //   .then(({ data }) => setOrders(data.data))
    //   .finally(() => setLoading(false));
  }, []);
  if (loading)
    return <div className="text-center py-20">Loading orders...</div>;
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.type} • {order.items?.length} items
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-bold text-orange-500"
                  >
                    ₦{order.total_amount?.toFixed(2)}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
