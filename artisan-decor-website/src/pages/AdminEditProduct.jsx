import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API = 'https://home-8zob.onrender.com';
const CATEGORIES = ['Resin Art', 'Wax Candles', 'Concrete Decor'];

const InputField = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
      {label}
    </label>
    {children}
    {hint && <p className="font-sans text-[11px] text-stone-400">{hint}</p>}
  </div>
);

const AdminEditProduct = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    axios.get(`${API}/api/products/${id}`)
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name || '',
          category: p.category || 'Resin Art',
          price: p.price || '',
          priceNum: String(p.priceNum || ''),
          description: p.description || '',
          material: p.material || '',
          size: p.size || '',
          color: p.color || '',
          inStock: p.inStock !== false,
          driveFolderId: p.driveFolderId || '',
          images: (p.images || []).join('\n'),
        });
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const imagesArr = form.images.split('\n').map(s => s.trim()).filter(Boolean);
      await axios.put(`${API}/api/products/${id}`, {
        name: form.name,
        category: form.category,
        price: form.price,
        priceNum: parseFloat(form.priceNum),
        description: form.description,
        material: form.material,
        size: form.size,
        color: form.color,
        inStock: form.inStock,
        driveFolderId: form.driveFolderId,
        images: imagesArr,
      });
      navigate(`/products/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update product';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/api/products/${id}`);
      navigate('/products');
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center text-stone-500 font-sans">
      Product not found.
    </div>
  );

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 font-sans text-xs text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/products" className="hover:text-amber-600 transition-colors">Gallery</Link>
          <span>·</span>
          <Link to={`/products/${id}`} className="hover:text-amber-600 transition-colors">Product</Link>
          <span>·</span>
          <span className="text-stone-600 dark:text-stone-400">Edit</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">edit</span>
            </span>
            <h1 className="font-serif text-3xl font-semibold text-stone-900 dark:text-stone-50">Edit Product</h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-red-500 border border-red-300 dark:border-red-800 px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete
          </button>
        </div>
      </motion.div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950/80 backdrop-blur-sm px-6"
        >
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-stone-200 dark:border-stone-800">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4 block">warning</span>
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">Delete this product?</h3>
            <p className="font-sans text-sm text-stone-500 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-bold transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 py-3 rounded-xl font-sans text-xs uppercase tracking-widest hover:border-stone-500 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-sans text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Product Name *">
            <input required value={form.name} onChange={set('name')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
          <InputField label="Category *">
            <select required value={form.category} onChange={set('category')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label='Display Price *' hint='e.g. "₹2,499"'>
            <input required value={form.price} onChange={set('price')} placeholder="₹2,499" className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
          <InputField label="Price (number) *" hint="Used for sorting">
            <input required type="number" min="0" value={form.priceNum} onChange={set('priceNum')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
        </div>

        <InputField label="Description *">
          <textarea required rows={4} value={form.description} onChange={set('description')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none" />
        </InputField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InputField label="Material *">
            <input required value={form.material} onChange={set('material')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
          <InputField label="Size *">
            <input required value={form.size} onChange={set('size')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
          <InputField label="Color *">
            <input required value={form.color} onChange={set('color')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors" />
          </InputField>
        </div>

        <InputField label="Google Drive Folder ID *" hint="Folder ID from Google Drive URL">
          <input required value={form.driveFolderId} onChange={set('driveFolderId')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono" />
        </InputField>

        <InputField label="Image URLs (Drive file links)" hint="One per line — leave blank to auto-fetch from folder">
          <textarea rows={4} value={form.images} onChange={set('images')} className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none font-mono" />
        </InputField>

        {/* In Stock toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.inStock ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.inStock ? 'translate-x-5' : ''}`} />
          </button>
          <span className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {form.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 py-4 font-sans uppercase tracking-widest text-xs font-bold transition-colors rounded-xl disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> Saving…</>
            ) : (
              <><span className="material-symbols-outlined text-[16px]">save</span> Save Changes</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="px-6 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl font-sans text-xs uppercase tracking-widest hover:border-stone-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </main>
  );
};

export default AdminEditProduct;
