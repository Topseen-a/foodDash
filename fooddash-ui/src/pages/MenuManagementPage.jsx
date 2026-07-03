import { useState, useEffect } from "react";
import {
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
  createCategory,
  toggleAvailability,
  setSoldOutNote,
} from "../api/endpoints";


function ItemRow({ item, onChanged }) {
  const [note, setNote] = useState(item.sold_out_note || "");
  const [imageUrl, setImageUrl] = useState(item.image_url || "");
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    try {
      await toggleAvailability(item.ID);
      onChanged();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleNoteSave = async () => {
    setSaving(true);
    try {
      await setSoldOutNote(item.ID, { note });
      onChanged();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSave = async () => {
    setSaving(true);
    try {
      await updateMenuItem(item.ID, {
        category_id: item.category_id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: imageUrl,
      });
      onChanged();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
            No img
          </div>
        )}
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">₦{item.price?.toFixed(0)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="border rounded-lg px-2 py-1 text-sm w-40"
        />
        <button
          onClick={handleImageSave}
          disabled={saving}
          className="text-sm text-orange-500 hover:underline disabled:opacity-50"
        >
          Save
        </button>
        {!item.is_available && (
          <>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Sold-out note"
              className="border rounded-lg px-2 py-1 text-sm"
            />
            <button
              onClick={handleNoteSave}
              disabled={saving}
              className="text-sm text-orange-500 hover:underline disabled:opacity-50"
            >
              Save
            </button>
          </>
        )}
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 ${
            item.is_available
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {item.is_available ? "Mark Sold Out" : "Mark Available"}
        </button>
      </div>
    </div>
  );
}


function NewCategoryForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", description: "", display_order: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createCategory({ ...form, display_order: Number(form.display_order) });
      setForm({ name: "", description: "", display_order: 0 });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-2 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="border rounded-lg px-3 py-1.5"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className="border rounded-lg px-3 py-1.5"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Order</label>
        <input
          type="number"
          value={form.display_order}
          onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value }))}
          className="border rounded-lg px-3 py-1.5 w-20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Category"}
      </button>
      {error && <p className="text-red-500 text-sm w-full">{error}</p>}
    </form>
  );
}


function NewItemForm({ categories, onCreated }) {
  const [form, setForm] = useState({
    category_id: categories[0]?.ID || "",
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!form.category_id && categories.length > 0) {
      setForm((p) => ({ ...p, category_id: categories[0].ID }));
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createMenuItem({ ...form, category_id: Number(form.category_id), price: Number(form.price) });
      setForm((p) => ({ ...p, name: "", description: "", price: "", image_url: "" }));
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-2 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Category</label>
        <select
          value={form.category_id}
          onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
          className="border rounded-lg px-3 py-1.5"
          required
        >
          {categories.map((c) => (
            <option key={c.ID} value={c.ID}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="border rounded-lg px-3 py-1.5"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          className="border rounded-lg px-3 py-1.5 w-24"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className="border rounded-lg px-3 py-1.5"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
        <input
          value={form.image_url}
          onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
          placeholder="https://..."
          className="border rounded-lg px-3 py-1.5 w-48"
        />
      </div>
      <button
        type="submit"
        disabled={loading || categories.length === 0}
        className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
      {error && <p className="text-red-500 text-sm w-full">{error}</p>}
    </form>
  );
}


export default function MenuManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const { data } = await getMenuAdmin();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Menu Management</h1>

      <div className="space-y-4 mb-8">
        <NewCategoryForm onCreated={fetchMenu} />
        <NewItemForm categories={categories} onCreated={fetchMenu} />
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading menu...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No categories yet</p>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.ID} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-bold mb-2">{cat.name}</h2>
              {cat.items?.length ? (
                cat.items.map((item) => (
                  <ItemRow key={item.ID} item={item} onChanged={fetchMenu} />
                ))
              ) : (
                <p className="text-sm text-gray-400">No items in this category</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
