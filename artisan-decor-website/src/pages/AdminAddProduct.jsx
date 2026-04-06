import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
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

const AdminAddProduct = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    category: 'Resin Art',
    price: '',
    priceNum: '',
    description: '',
    material: '',
    size: '',
    color: '',
    inStock: true,
    driveFolderId: '',
    images: '', // newline-separated Drive URLs
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const imagesArr = form.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await axios.post(`${API}/api/products`, {
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

      navigate('/products');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create product';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 font-sans text-xs text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/products" className="hover:text-amber-600 transition-colors">Gallery</Link>
          <span>·</span>
          <span className="text-stone-600 dark:text-stone-400">Add Product</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">add</span>
          </span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 dark:text-stone-50">Add New Product</h1>
        </div>
        <p className="font-sans text-sm text-stone-500 dark:text-stone-400 ml-11">Admin panel — fill all fields carefully</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-sans text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Product Name *">
            <input
              required
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Obsidian Resin Tray"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
          <InputField label="Category *">
            <select
              required
              value={form.category}
              onChange={set('category')}
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Display Price *" hint='e.g. "₹2,499"'>
            <input
              required
              value={form.price}
              onChange={set('price')}
              placeholder="₹2,499"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
          <InputField label="Price (number) *" hint="Used for sorting — e.g. 2499">
            <input
              required
              type="number"
              min="0"
              value={form.priceNum}
              onChange={set('priceNum')}
              placeholder="2499"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
        </div>

        {/* Description */}
        <InputField label="Description *">
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={set('description')}
            placeholder="Describe this piece — material feel, use case, aesthetic..."
            className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </InputField>

        {/* Material / Size / Color */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InputField label="Material *">
            <input
              required
              value={form.material}
              onChange={set('material')}
              placeholder="e.g. Epoxy Resin"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
          <InputField label="Size *">
            <input
              required
              value={form.size}
              onChange={set('size')}
              placeholder="e.g. 30 × 20 cm"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
          <InputField label="Color *">
            <input
              required
              value={form.color}
              onChange={set('color')}
              placeholder="e.g. Ocean Blue & Gold"
              className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </InputField>
        </div>

        {/* Drive Folder ID */}
        <InputField label="Google Drive Folder ID *" hint="The folder ID from the Drive URL — e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs">
          <input
            required
            value={form.driveFolderId}
            onChange={set('driveFolderId')}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
            className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
          />
        </InputField>

        {/* Image URLs */}
        <InputField
          label="Image URLs (Drive file links)"
          hint="One Google Drive file URL per line — these appear in the thumbnail strip. Leave blank to auto-fetch from folder."
        >
          <textarea
            rows={4}
            value={form.images}
            onChange={set('images')}
            placeholder={`https://drive.google.com/file/d/FILE_ID/view\nhttps://drive.google.com/uc?id=FILE_ID`}
            className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 font-sans text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none font-mono"
          />
        </InputField>

        {/* In Stock */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, inStock: !f.inStock }))}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.inStock ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.inStock ? 'translate-x-5' : ''}`} />
          </button>
          <span className="font-sans text-sm text-stone-700 dark:text-stone-300">
            {form.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 py-4 font-sans uppercase tracking-widest text-xs font-bold transition-colors rounded-xl disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> Creating…</>
            ) : (
              <><span className="material-symbols-outlined text-[16px]">add_circle</span> Create Product</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl font-sans text-xs uppercase tracking-widest hover:border-stone-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </main>
  );
};

export default AdminAddProduct;
