import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { validateProductForm } from '../../utils/validators';
import { CATEGORIES } from '../../data/mockCategories';
import { Sparkles, Image, Check, AlertCircle } from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Sony Alpha Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Canon Cinema Kit', url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'MacBook Pro M3', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Dell Precision/XPS', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80' },
  { label: 'PS5 Pro Console', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80' },
  { label: 'VR Headset Kit', url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80' },
  { label: '4K Laser Projector', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Power Tools Combo', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'DJI Mavic Drone', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80' },
];

export const AddEditProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  vendorId
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    category: 'cameras',
    pricePerDay: '',
    securityDeposit: '',
    totalQuantity: 1,
    description: '',
    imageUrl: '',
    availability: 'available',
    condition: 'Like New',
    location: 'Los Angeles, CA',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'cameras',
        pricePerDay: initialData.pricePerDay || '',
        securityDeposit: initialData.securityDeposit || '',
        totalQuantity: Math.max(1, Number(initialData.totalQuantity) || 1),
        description: initialData.description || '',
        imageUrl: initialData.images?.[0] || '',
        availability: initialData.availability || 'available',
        condition: initialData.condition || 'Like New',
        location: initialData.location || 'Los Angeles, CA',
      });
    } else {
      setFormData({
        name: '',
        category: 'cameras',
        pricePerDay: '',
        securityDeposit: '',
        totalQuantity: 1,
        description: '',
        imageUrl: PRESET_IMAGES[0].url,
        availability: 'available',
        condition: 'Like New',
        location: 'Los Angeles, CA',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        vendorId: vendorId || 'vend-1',
        images: [formData.imageUrl]
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Rental Listing' : 'List New Equipment'}
      subtitle={isEditing ? 'Update specifications, pricing, and availability' : 'Publish your gear to the RentWise marketplace'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Equipment Title *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="E.g., Sony FX3 Cinema Full-Frame Camera"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
              errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
            } focus:outline-none focus:ring-2 focus:ring-brand-500`}
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="Mint">Mint (Like Brand New)</option>
              <option value="Like New">Like New (Flawless)</option>
              <option value="Excellent">Excellent (Minor cosmetic signs)</option>
              <option value="Good">Good (Tested & Functional)</option>
            </select>
          </div>
        </div>

        {/* Price, Deposit & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Daily Price ($/d) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.pricePerDay}
              onChange={(e) => handleChange('pricePerDay', e.target.value)}
              placeholder="E.g., 65"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.pricePerDay ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.pricePerDay && <p className="text-[11px] text-rose-500 mt-1">{errors.pricePerDay}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Deposit ($) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.securityDeposit}
              onChange={(e) => handleChange('securityDeposit', e.target.value)}
              placeholder="E.g., 300"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.securityDeposit ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.securityDeposit && <p className="text-[11px] text-rose-500 mt-1">{errors.securityDeposit}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Units in Stock *
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={formData.totalQuantity || 1}
              onChange={(e) => handleChange('totalQuantity', Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="1"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Total inventory count</span>
          </div>
        </div>

        {/* Location & Availability Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Location (City, State) *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="E.g., Los Angeles, CA"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.location ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Listing Status
            </label>
            <select
              value={formData.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="available">Available Now</option>
              <option value="rented">Currently Rented</option>
              <option value="unavailable">Unavailable (Maintenance)</option>
            </select>
          </div>
        </div>

        {/* Image URL & Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Primary Image URL *
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
              errors.imageUrl ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
            } focus:outline-none focus:ring-2 focus:ring-brand-500`}
          />
          {errors.imageUrl && <p className="text-[11px] text-rose-500 mt-1">{errors.imageUrl}</p>}

          {/* Quick preset thumbnail picker */}
          <div className="mt-2">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">
              Quick Presets (or paste your own link above):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleChange('imageUrl', preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    formData.imageUrl === preset.url
                      ? 'bg-teal-50 border-teal-300 text-teal-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Detailed Description *
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the equipment condition, recommended usage, included accessories, and rental instructions..."
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
              errors.description ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
            } focus:outline-none focus:ring-2 focus:ring-brand-500`}
          />
          {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Publish Listing'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
