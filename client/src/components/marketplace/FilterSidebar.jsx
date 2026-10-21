import React from 'react';
import { CATEGORIES } from '../../data/mockCategories';
import { Filter, RotateCcw, DollarSign, Check } from 'lucide-react';

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  className = ''
}) => {
  const handleCategoryClick = (catId) => {
    onFilterChange({
      category: filters.category === catId ? 'all' : catId
    });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleAvailabilityChange = (val) => {
    onFilterChange({ availability: val });
  };

  return (
    <aside className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Filters
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {totalResults}
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 font-medium transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Categories
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filters.category === 'all'
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>All Categories</span>
              {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-brand-600" />}
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Daily Rate ($ / Day)
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Min ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Max ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="200"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Under $35', min: '', max: '35' },
              { label: '$35 – $75', min: '35', max: '75' },
              { label: '$75+', min: '75', max: '' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  onFilterChange({ minPrice: preset.min, maxPrice: preset.max });
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Availability
          </h4>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Equipment' },
              { id: 'available', label: 'Available Now Only' },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium hover:text-slate-900"
              >
                <input
                  type="radio"
                  name="availability-filter"
                  checked={filters.availability === option.id}
                  onChange={() => handleAvailabilityChange(option.id)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
