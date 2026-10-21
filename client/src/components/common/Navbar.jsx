import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { useBookings } from '../../hooks/useBookings';
import {
  Boxes,
  Search,
  Heart,
  Calendar,
  LayoutDashboard,
  Package,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Store,
  ChevronDown,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, isVendor, isCustomer, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { bookings } = useBookings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Pending count for vendor
  const pendingRequests = bookings.filter((b) => b.vendorId === currentUser?.id && b.status === 'pending').length;
  // Active rentals for customer
  const activeRentals = bookings.filter((b) => b.customerId === currentUser?.id && (b.status === 'active' || b.status === 'approved')).length;

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'text-brand-700 bg-brand-50/80 shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-navy-950 font-sans">
                    Rent<span className="text-brand-600">Wise</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:block -mt-1">
                  Smart Rental Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <NavLink to="/marketplace" className={navLinkClass}>
                Marketplace
              </NavLink>

              {currentUser ? (
                isVendor ? (
                  <>
                    <NavLink to="/vendor/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/vendor/listings" className={navLinkClass}>
                      My Listings
                    </NavLink>
                    <NavLink to="/vendor/bookings" className={navLinkClass}>
                      <span className="flex items-center gap-1.5">
                        <span>Bookings</span>
                        {pendingRequests > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                            {pendingRequests}
                          </span>
                        )}
                      </span>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/customer/dashboard" className={navLinkClass}>
                      <span className="flex items-center gap-1.5">
                        <span>My Rentals</span>
                        {activeRentals > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                            {activeRentals}
                          </span>
                        )}
                      </span>
                    </NavLink>
                    <NavLink to="/#how-it-works" className={navLinkClass}>
                      How It Works
                    </NavLink>
                  </>
                )
              ) : (
                <NavLink to="/#how-it-works" className={navLinkClass}>
                  How It Works
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Profile / Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Wishlist Link for Customer */}
                {isCustomer && (
                  <Link
                    to="/customer/dashboard?tab=wishlist"
                    className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors"
                    title="View Saved Items"
                  >
                    <Heart className="w-5 h-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Avatar Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl hover:bg-slate-100 border border-slate-200/80 transition-colors"
                    aria-label="User menu"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/20"
                    />
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-scale-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-brand-600 font-semibold capitalize mt-0.5">
                          {currentUser.role === 'vendor' ? `Vendor: ${currentUser.businessName || 'Business'}` : 'Customer Account'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Settings</span>
                        </Link>

                        {isVendor ? (
                          <>
                            <Link
                              to="/vendor/dashboard"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-400" />
                              <span>Vendor Dashboard</span>
                            </Link>
                            <Link
                              to="/vendor/listings"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                            >
                              <Package className="w-4 h-4 text-slate-400" />
                              <span>Manage My Gear</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/customer/dashboard"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                            >
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Customer Dashboard</span>
                            </Link>
                            <Link
                              to="/customer/dashboard?tab=wishlist"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                            >
                              <Heart className="w-4 h-4 text-slate-400" />
                              <span>Saved Items</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Unauthenticated user actions: Sign In & Register buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-slide-down shadow-xl">
          <div className="flex flex-col gap-1">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-brand-600" />
                <span>Explore Marketplace</span>
              </div>
            </Link>

            {currentUser ? (
              isVendor ? (
                <>
                  <Link
                    to="/vendor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-purple-600" />
                      <span>Vendor Dashboard</span>
                    </div>
                  </Link>
                  <Link
                    to="/vendor/listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span>My Listings</span>
                    </div>
                  </Link>
                  <Link
                    to="/vendor/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>Booking Management</span>
                    </div>
                    {pendingRequests > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                        {pendingRequests} new
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/vendor/listings?action=new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New Equipment</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-brand-600" />
                      <span>Customer Dashboard & Bookings</span>
                    </div>
                    {activeRentals > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-600 text-white">
                        {activeRentals}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/customer/dashboard?tab=wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Wishlist Items</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </>
              )
            ) : null}

            {currentUser && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>User Profile</span>
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
