import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/marketplace/ProductCard';
import { FilterSidebar } from '../components/marketplace/FilterSidebar';
import { SortDropdown } from '../components/marketplace/SortDropdown';
import { ActiveFilterChips } from '../components/marketplace/ActiveFilterChips';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, initialLoaded, filters, updateFilters, resetFilters } = useProducts();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const searchDebounceRef = useRef(null);

  // Sync URL query params with state on mount or param change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const updates = {};
    if (categoryParam) updates.category = categoryParam;
    if (searchParam !== null && searchParam !== undefined) {
      updates.search = searchParam;
      setLocalSearch(searchParam);
    }
    if (Object.keys(updates).length > 0) {
      updateFilters(updates);
    }
  }, [searchParams]);

  // Sync localSearch when filters.search changes externally (e.g. clicking chip remove or reset)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  // Helper to keep URL query param in sync without polluting history
  const syncUrlParam = (term) => {
    const newParams = new URLSearchParams(searchParams);
    if (term && term.trim()) {
      newParams.set('search', term.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Instant real-time as-you-type search handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearch(query);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // If query is emptied, update immediately
    if (!query.trim()) {
      updateFilters({ search: '' });
      syncUrlParam('');
      return;
    }

    // Debounce by 150ms for instant, fluid filtering without lag
    searchDebounceRef.current = setTimeout(() => {
      updateFilters({ search: query.trim() });
      syncUrlParam(query.trim());
    }, 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    updateFilters({ search: localSearch.trim() });
    syncUrlParam(localSearch.trim());
  };

  const handleClearSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setLocalSearch('');
    updateFilters({ search: '' });
    syncUrlParam('');
  };

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Search Bar Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Browse All Equipment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Rental Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified cameras, laptops, consoles, projectors, and tools available for instant booking.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search equipment or brand..."
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-soft transition-all"
            autoComplete="off"
            spellCheck="false"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {loading && localSearch && (
            <span className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin inline-block" />
            </span>
          )}
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold p-1 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Main Grid: Sidebar Filters + Products Listing */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            onResetFilters={() => {
              resetFilters();
              setLocalSearch('');
              syncUrlParam('');
            }}
            totalResults={products.length}
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Mobile filter button + Sort dropdown + results count */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>Filters</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              </button>

              <span className="text-xs font-bold text-slate-700">
                Showing <strong className="text-brand-700">{products.length}</strong> items
              </span>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown
              value={filters.sortBy}
              onChange={(val) => updateFilters({ sortBy: val })}
            />
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onRemoveFilter={updateFilters}
            onClearAll={() => {
              resetFilters();
              setLocalSearch('');
              syncUrlParam('');
            }}
          />

          {/* Products Grid or Loading / Empty States */}
          {loading && !initialLoaded ? (
            <LoadingSpinner label="Fetching rental inventory..." size="lg" className="py-20" />
          ) : products.length === 0 ? (
            <EmptyState
              title={filters.search ? `No equipment matching "${filters.search}"` : "No equipment matched your filters"}
              description={filters.search ? `We couldn't find any rentals matching "${filters.search}". Try checking for typos or searching a broader term.` : "We couldn't find any rental equipment matching your active keywords or filter criteria. Try adjusting your price range or category."}
              actionLabel="Reset All Filters"
              onAction={() => {
                resetFilters();
                setLocalSearch('');
                syncUrlParam('');
              }}
              className="py-16"
            />
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-150 ${loading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal / Drawer */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Rental Equipment"
        maxWidth="max-w-md"
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={(newF) => {
            updateFilters(newF);
          }}
          onResetFilters={() => {
            resetFilters();
            setMobileFilterOpen(false);
          }}
          totalResults={products.length}
          className="border-0 shadow-none p-0"
        />
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <Button variant="primary" onClick={() => setMobileFilterOpen(false)} className="w-full">
            Apply Filters ({products.length} items)
          </Button>
        </div>
      </Modal>
    </div>
  );
};
