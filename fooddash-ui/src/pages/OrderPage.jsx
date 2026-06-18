import { useParams, Link } from "react-router-dom";
import { useOrderStatus } from "../hooks/useOrderStatus";
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
      className={`px-3 py-1 rounded-full text-sm font-bold
${s[status] || ""}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}
function StatusTracker({ status, type }) {
  const steps = [
    "RECEIVED",
    "PREPARING",
    "READY",
    type === "pickup" ? "PICKED_UP" : "DELIVERED",
  ];
  const current = steps.indexOf(status);
  return (
    <div className="flex items-center gap-2 my-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= current ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}
          >
            {i + 1}
          </div>
          <p
            className={`text-xs ml-2 font-medium flex-1 ${i <= current ? "text-orange-500" : "text-gray-400"}`}
          >
            {step.replace("_", " ")}
          </p>
        </div>
      ))}
    </div>
  );
}
export default function OrderPage() {
  const { id } = useParams();
  const { order } = useOrderStatus(id); // polling now, WebSocket in W3
  if (!order)
    return (
      <div className="text-center py-20 text-gray-400">Loading order...</div>
    );
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-500 text-sm capitalize">
              {order.type} order
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        {order.status !== "CANCELLED" && (
          <StatusTracker status={order.status} type={order.type} />
        )}
        {order.type === "delivery" && order.delivery_address && (
          <p className="text-sm text-gray-600 mb-4">
            📍 Delivering to:
            <strong>{order.delivery_address}</strong>
          </p>
        )}
        <div className="divide-y">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{item.menu_item.name}</p>
                {item.special_instructions && (
                  <p className="text-xs text-gray-400 italic">
                    {item.special_instructions}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">x{item.quantity}</p>
                <p className="font-bold text-orange-500">
                  ₦{(item.unit_price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-orange-500">
            ₦{order.total_amount?.toFixed(2)}
          </span>
        </div>
        <Link
          to="/"
          className="block text-center mt-6 text-orange-500 hover:underline"
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
