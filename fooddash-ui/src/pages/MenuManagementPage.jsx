import { useState, useEffect } from "react";
import {
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  createCategory,
} from "../api/endpoints";
// MenuItemModal handles both CREATE (item=null) and EDIT (item=obj) in one component.
function MenuItemModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    category_id: item?.category_id || categories[0]?.id || "",
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    image_url: item?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price: Number(form.price),
      };
      item
        ? await updateMenuItem(item.id, payload)
        : await createMenuItem(payload);
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? "Edit Item" : "Add New Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
            }
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Item name"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Description"
            rows={2}
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="Price (₦)"
            className="w-full border rounded-lg px-4py-2"
            required
          />
          <input
            value={form.image_url}
            onChange={(e) =>
              setForm((p) => ({ ...p, image_url: e.target.value }))
            }
            placeholder="Image URL (optional)"
            className="w-full border rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function CategoryModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory({
        ...form,
        display_order: Number(form.display_order),
      });
      onSave();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Category name"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Description"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            value={form.display_order}
            onChange={(e) =>
              setForm((p) => ({ ...p, display_order: e.target.value }))
            }
            placeholder="Display order"
            className="w-full border rounded-lg px-4 py-2"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function MenuManagementPage() {
  const [menu, setMenu] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [editingItem, setEditing] = useState(undefined); // undefined=closed, null=create, obj=edit
  const [showCatModal, setShowCat] = useState(false);
  const [toggling, setToggling] = useState(null);
  const loadMenu = () =>
    getMenuAdmin().then(({ data }) => {
      setMenu(data.data);
      if (!activeCat && data.data.length > 0) setActiveCat(data.data[0].id);
    });
  useEffect(() => {
    loadMenu();
  }, []);
  const handleToggle = async (itemId) => {
    setToggling(itemId);
    try {
      await toggleAvailability(itemId);
      await loadMenu();
    } finally {
      setToggling(null);
    }
  };
  const currentCategory = menu.find((c) => c.id === activeCat);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCat(true)}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
          >
            + Category
          </button>
          <button
            onClick={() => setEditing(null)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            + Add Item
          </button>
        </div>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {menu.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCat === cat.id ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {cat.name} ({cat.items?.length || 0})
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                Item
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                Price
              </th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">
                Available
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentCategory?.items?.map((item) => (
              <tr
                key={item.id}
                className={item.is_available ? "" : "opacity-50 bg-gray-50"}
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </td>
                <td className="px-4 py-3 font-bold text-orange-500">
                  ₦{item.price?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(item.id)}
                    disabled={toggling === item.id}
                    className={`w-12 h-6 rounded-full transition-colors relative ${item.is_available ? "bg-green-500" : "bg-gray-300"} disabled:opacity-50`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.is_available ? "left-7" : "left-1"}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(item)}
                    className="text-blue-500 over:underline text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!currentCategory?.items?.length && (
          <p className="text-center text-gray-400 py-8">
            No items in this category yet
          </p>
        )}
      </div>
      {editingItem !== undefined && (
        <MenuItemModal
          item={editingItem}
          categories={menu}
          onClose={() => setEditing(undefined)}
          onSave={() => {
            setEditing(undefined);
            loadMenu();
          }}
        />
      )}
      {showCatModal && (
        <CategoryModal
          onClose={() => setShowCat(false)}
          onSave={() => {
            setShowCat(false);
            loadMenu();
          }}
        />
      )}
    </div>
  );
}
