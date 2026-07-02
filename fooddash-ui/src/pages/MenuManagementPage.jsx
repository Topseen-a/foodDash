import { useState, useEffect } from "react";
import {
  getMenuAdmin,
  createMenuItem,
  updateMenuItem,
<<<<<<< HEAD
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
=======
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

>>>>>>> be84900 (completed)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
<<<<<<< HEAD
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
=======
      await createCategory({ ...form, display_order: Number(form.display_order) });
      setForm({ name: "", description: "", display_order: 0 });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create category");
>>>>>>> be84900 (completed)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
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
=======

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
>>>>>>> be84900 (completed)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
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
=======

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
>>>>>>> be84900 (completed)
      )}
    </div>
  );
}
