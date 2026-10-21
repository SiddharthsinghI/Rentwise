import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { ShieldCheck, Star, MapPin, Phone, Mail, Calendar, User, Edit3, Check } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const UserProfilePage = () => {
  const { currentUser, updateProfile, isVendor } = useAuth();
  const { bookings } = useBookings();
  const { products } = useProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    businessName: currentUser?.businessName || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const userBookings = bookings.filter((b) =>
    isVendor ? b.vendorId === currentUser.id : b.customerId === currentUser.id
  );
  const completedCount = userBookings.filter((b) => b.status === 'completed').length;
  const activeCount = userBookings.filter((b) => b.status === 'active').length;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
          Account Profile & Verification
        </span>
        <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
          User Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Avatar & Trust Badges */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-28 h-28 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            {currentUser.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs" title="Verified Identity">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
          <span className="text-xs font-semibold text-brand-700 capitalize mt-0.5">
            {isVendor ? (currentUser.businessName || 'Equipment Vendor') : 'Verified Customer'}
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{currentUser.rating || 5.0}</span>
            <span className="text-slate-400 font-normal">({currentUser.reviewsCount || 0} reviews)</span>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600 space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{currentUser.phone || '+1 (555) 000-0000'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{currentUser.location}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Member since {currentUser.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form & Activity Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage your public bio and contact preferences</p>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>
                </div>

                {isVendor && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Business / Studio Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Location (City, State)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    About / Bio
                  </label>
                  <textarea
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" isLoading={isSaving} icon={Check}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                    Bio & Presentation
                  </span>
                  <p className="mt-1 text-slate-700 leading-relaxed">
                    {currentUser.bio || 'No bio provided yet.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                      Account Type
                    </span>
                    <span className="mt-1 text-slate-900 font-semibold capitalize block">
                      {currentUser.role}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                      Security Status
                    </span>
                    <span className="mt-1 text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      ID Verified & Protected
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              Rental History & Activity Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-extrabold text-navy-950 font-sans block">
                  {userBookings.length}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                  Total Bookings
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <span className="text-2xl font-extrabold text-teal-700 font-sans block">
                  {activeCount}
                </span>
                <span className="text-xs text-teal-600 font-medium mt-0.5 block">
                  Active Rentals
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-2xl font-extrabold text-emerald-700 font-sans block">
                  {completedCount}
                </span>
                <span className="text-xs text-emerald-600 font-medium mt-0.5 block">
                  Completed Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
