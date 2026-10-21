import React, { useState } from 'react';
import { Badge } from '../common/Badge';

export const ImageGallery = ({ images = [], name, availability, condition }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeImage = images[selectedIdx] || images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft">
        <img
          src={activeImage}
          alt={name}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <Badge status={availability} size="md" />
          {condition && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-950/80 text-white backdrop-blur-md shadow-sm">
              {condition}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                selectedIdx === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/20 scale-102'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
