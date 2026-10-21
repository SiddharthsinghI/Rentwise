import React from 'react';
import { DEMO_USERS } from '../../data/mockUsers';
import { ShieldCheck, Star, Clock, MapPin, Award } from 'lucide-react';

export const VendorProfileCard = ({ vendorId }) => {
  const vendor = DEMO_USERS.find((u) => u.id === vendorId) || DEMO_USERS[2];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">
        <Award className="w-4 h-4" />
        <span>Verified Gear Owner</span>
      </div>

      <div className="flex items-start gap-4">
        <img
          src={vendor.avatar}
          alt={vendor.name}
          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-xs"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-base text-slate-900">{vendor.name}</h4>
            <ShieldCheck className="w-4 h-4 text-brand-600" title="Verified ID & Equipment" />
          </div>
          <p className="text-xs text-brand-700 font-semibold">{vendor.businessName || 'Pro AV Provider'}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800">{vendor.rating || 4.9}</span>
              <span>({vendor.reviewsCount || 45} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{vendor.responseTime || '< 30m response'}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-4 leading-relaxed line-clamp-3">
        {vendor.bio}
      </p>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{vendor.location}</span>
        </div>
        <span>Member since {vendor.memberSince}</span>
      </div>
    </div>
  );
};
