import React from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/mockCategories';

export const ActiveFilterChips = ({ filters, onRemoveFilter, onClearAll }) => {
  const chips = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      onRemove: () => onRemoveFilter({ search: '' })
    });
  }

  if (filters.category && filters.category !== 'all') {
    const cat = CATEGORIES.find((c) => c.slug === filters.category);
    chips.push({
      key: 'category',
      label: `Category: ${cat ? cat.name : filters.category}`,
      onRemove: () => onRemoveFilter({ category: 'all' })
    });
  }

  if (filters.minPrice || filters.maxPrice) {
    const minText = filters.minPrice ? `$${filters.minPrice}` : '$0';
    const maxText = filters.maxPrice ? `$${filters.maxPrice}` : '∞';
    chips.push({
      key: 'price',
      label: `Price: ${minText} - ${maxText}`,
      onRemove: () => onRemoveFilter({ minPrice: '', maxPrice: '' })
    });
  }

  if (filters.availability && filters.availability !== 'all') {
    chips.push({
      key: 'availability',
      label: 'Available Now Only',
      onRemove: () => onRemoveFilter({ availability: 'all' })
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-slate-400 font-medium mr-1">Active filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="hover:text-brand-900 focus:outline-none"
            aria-label="Remove filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-slate-500 hover:text-rose-600 font-semibold underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
};
