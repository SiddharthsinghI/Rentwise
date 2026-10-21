import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex-shrink-0">
        Sort by:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs cursor-pointer"
        >
          <option value="featured">Featured / Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest Arrivals</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
