import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
// import { updateCartItem, removeCartItem, placeOrder } from "../api/endpoints";


export default function CartPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderType, setType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const total =
    cart?.items?.reduce((sum, i) => sum + i.menu_item.price * i.quantity, 0) ||
    0;


  const handleQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, { quantity: newQty });
      await refreshCart();
    } catch {
      alert("Could not update item");
    }
  };


  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await refreshCart();
    } catch {
      alert("Could not remove item");
    }
  };


  const handlePlaceOrder = async () => {
    if (orderType === "delivery" && !address.trim()) {
      setError("Enter a delivery address");
      return;
    }
    setError("");
    setPlacing(true);
    try {
    //   const { data } = await placeOrder({
    //     type: orderType,
    //     delivery_address: address,
    //   });
      await refreshCart();
      navigate(`/orders/${data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to placeorder");
    } finally {
      setPlacing(false);
    }
  };
  
  if (!cart || cart.items?.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-4">🛒 Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg"
        >
          Browse Menu
        </button>
      </div>
    );
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4 flex gap-4"
          >
            <div className="flex-1">
              <h3 className="font-bold">{item.menu_item.name}</h3>
              {item.special_instructions && (
                <p
                  className="text-sm text-gray-400italic"
                >
                  {item.special_instructions}
                </p>
              )}
              <p
                className="text-orange-500 font-bold mt-1"
              >
                ₦{(item.menu_item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQty(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded-full font-bold"
              >
                −
              </button>
              <span className="w-6 text-center font-bold">{item.quantity}</span>
              <button
                onClick={() => handleQty(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full font-bold"
              >
                +
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span
            className="text-orange-500"
          >
            ₦{total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg"
        >
          Place Order
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">
              How would you like your order?
            </h2>
            <div className="flex gap-4 mb-4">
              {["pickup", "delivery"].map((type) => (
                <button
                  key={type}
                  onClick={() => setType(type)}
                  className={`flex-1 py-2 rounded-lg border-2 capitalize font-medium ${orderType === type ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            {orderType === "delivery" && (
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full border rounded-lg px-4 py-2 mb-4"
              />
            )}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 font-bold"
              >
                {placing ? "Placing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
