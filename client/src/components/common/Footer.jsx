import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, ShieldCheck, Zap, RefreshCw, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-navy-900/80">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-navy-900/50 border border-navy-800/60">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Verified Equipment</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every camera, laptop, and tool is inspected, calibrated, and sensor-cleaned before dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-navy-900/50 border border-navy-800/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Instant Reservation</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Select your rental dates, get transparent daily pricing, and request your booking in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-navy-900/50 border border-navy-800/60">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Flexible Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hassle-free return workflow with automated security deposit settlement once verified.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-white flex items-center justify-center shadow-md">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Rent<span className="text-teal-400">Wise</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              RentWise is the smart rental management platform connecting creators, professionals, and makers with high-end cameras, laptops, gaming gear, projectors, and power tools.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>San Francisco, CA & Los Angeles, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@rentwise-platform.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (800) 555-RENT</span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/marketplace?category=cameras" className="hover:text-teal-300 transition-colors">
                  Cameras & Cinema Lenses
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=laptops" className="hover:text-teal-300 transition-colors">
                  Laptops & Workstations
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=gaming" className="hover:text-teal-300 transition-colors">
                  Gaming Consoles & VR
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=projectors" className="hover:text-teal-300 transition-colors">
                  Projectors & Pro Audio
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=tools" className="hover:text-teal-300 transition-colors">
                  Power Tools & Workshop
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=drones" className="hover:text-teal-300 transition-colors">
                  Drones & Action Cameras
                </Link>
              </li>
            </ul>
          </div>

          {/* For Renters */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Renters
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/marketplace" className="hover:text-teal-300 transition-colors">
                  Browse All Gear
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-teal-300 transition-colors">
                  How Renting Works
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-teal-300 transition-colors">
                  Rental Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard?tab=wishlist" className="hover:text-teal-300 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-teal-300 transition-colors">
                  Renter Profile & Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* For Equipment Owners */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Vendors
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/vendor/dashboard" className="hover:text-teal-300 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vendor/listings" className="hover:text-teal-300 transition-colors">
                  My Equipment Listings
                </Link>
              </li>
              <li>
                <Link to="/vendor/bookings" className="hover:text-teal-300 transition-colors">
                  Booking Requests
                </Link>
              </li>
              <li>
                <Link to="/vendor/listings?action=new" className="hover:text-teal-300 transition-colors">
                  List New Equipment
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-300 transition-colors">
                  Sign In to Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and platform info */}
        <div className="pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} RentWise Inc. Smart Rental Management Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>React, Tailwind CSS & Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
