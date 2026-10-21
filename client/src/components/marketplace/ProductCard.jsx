import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';

export const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isCustomer } = useAuth();

  if (!product) return null;

  const saved = isWishlisted(product.id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <Badge status={product.availability} size="sm" />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-700 backdrop-blur-md shadow-xs">
            {product.totalQuantity || 1} in stock
          </span>
          {product.condition && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-950/80 text-white backdrop-blur-md shadow-xs">
              {product.condition}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {isCustomer && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2 rounded-2xl backdrop-blur-md transition-all shadow-md z-10 ${
              saved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-slate-100 flex items-baseline gap-1 pointer-events-none">
          <span className="text-base font-extrabold text-navy-950">
            {formatCurrency(product.pricePerDay)}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">/ day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="capitalize font-semibold text-brand-700 tracking-wide">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount || 12})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Card Footer: Location & Action */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{product.location || 'Los Angeles, CA'}</span>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 group/btn"
          >
            <span>Rent</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
