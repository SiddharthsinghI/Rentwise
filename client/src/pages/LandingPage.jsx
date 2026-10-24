import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mockCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Camera,
  Laptop,
  Gamepad2,
  Projector,
  Wrench,
  Plane,
  Star,
  Clock,
  User,
  Store
} from 'lucide-react';

const iconMap = {
  Camera: Camera,
  Laptop: Laptop,
  Gamepad2: Gamepad2,
  Projector: Projector,
  Wrench: Wrench,
  Plane: Plane,
};

export const LandingPage = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [howItWorksTab, setHowItWorksTab] = useState('renters');

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const featured = products.filter((p) => p.featured || p.popular);
  const featuredProducts = (featured.length > 0 ? featured : products).slice(0, 6);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-teal-500/15 to-emerald-400/10 blur-3xl pointer-events-none rounded-full -z-10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-6 shadow-2xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>The Premier Equipment Rental Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-teal-600 font-medium">100% Inspected & Verified Gear</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Rent High-End Tech, Cameras & Tools <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">On Demand</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Access thousands of dollars worth of professional cinema cameras, M3 Max MacBooks, 4K laser projectors, and power tools without the crushing upfront cost.
          </p>

          {/* Search Bar Container */}
          <div className="mt-10 max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-3xl shadow-card border border-slate-200/90">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2">
              {/* Keywords Input */}
              <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-50 sm:bg-transparent rounded-2xl sm:rounded-none">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What equipment do you need? (e.g. Sony A7 IV, MacBook, PS5)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              {/* Category Dropdown */}
              <div className="w-full sm:w-56 px-3 py-2 bg-slate-50 sm:bg-transparent rounded-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-slate-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto px-6 py-3 font-bold rounded-2xl shadow-md shadow-brand-600/20"
                icon={Search}
              >
                Find Gear
              </Button>
            </form>
          </div>

          {/* Dynamic Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Damage Protection Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Same-Day & Weekend Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4.9/5 Renter Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
              Popular Equipment Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Explore What You Can Rent
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 group"
          >
            <span>View All Gear</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Camera;
            return (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.slug}`}
                className="group bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-all hover:-translate-y-1 text-center flex flex-col items-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {cat.itemCount}+ units available
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Rental Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              Top Rated Gear
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Featured Rental Equipment
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How RentWise Works */}
      <section id="how-it-works" className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">
              Authentic Community Marketplace
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              How RentWise Works
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              RentWise is an authentic, peer-to-peer and vendor rental platform. Only registered users set and list their own products, and real customers book on-demand—no demo accounts, no simulated placeholders.
            </p>

            {/* Interactive Toggle: For Renters vs For Equipment Owners */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 mt-8 shadow-xs">
              <button
                type="button"
                onClick={() => setHowItWorksTab('renters')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  howItWorksTab === 'renters'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>For Customers & Renters</span>
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('vendors')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  howItWorksTab === 'vendors'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>For Equipment Owners & Vendors</span>
              </button>
            </div>
          </div>

          {/* Tab 1: For Renters */}
          {howItWorksTab === 'renters' ? (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">01</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Create Customer Account</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Register your real profile in seconds. Your verified account gives you access to authentic equipment listings set and owned by real registered community vendors.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Instant, secure registration</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">02</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Browse Real Gear & Select Dates</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Explore verified cinema cameras, drones, workstations, and pro tools published by active vendors. Pick your dates for instant transparent price calculations.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Transparent daily rates & deposits</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">03</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Book, Pick Up & Return</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Submit your request directly to the equipment owner. Once approved, coordinate pickup, create with pro gear, and return smoothly to release your security deposit.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Safe deposit refund protection</span>
                  </div>
                </div>
              </div>

              {/* Renter CTA Banner */}
              <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-teal-950">Looking to rent high-end production equipment?</h4>
                    <p className="text-xs text-teal-700">Browse live listings posted by our community of verified equipment owners.</p>
                  </div>
                </div>
                <Link to="/marketplace">
                  <Button variant="primary" size="sm" className="whitespace-nowrap">
                    Explore Marketplace →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">01</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Register as a Vendor</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Create your verified vendor profile with your business or studio name. Only registered users set products, ensuring genuine listings, direct chat, and transparent terms.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Vendor portal included</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">02</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Set & List Your Equipment</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Publish your gear with custom photos, category, descriptions, daily pricing, security deposits, and available inventory. Your equipment goes live instantly.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Full pricing & inventory control</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/70 relative flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div>
                    <span className="text-4xl font-extrabold text-brand-600/30 block mb-4">03</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Review Requests & Earn</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Receive rental requests from verified customers in your dashboard. Accept or decline requests, coordinate item handover, and earn monthly rental revenue.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Real-time booking management</span>
                  </div>
                </div>
              </div>

              {/* Vendor CTA Banner */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Have gear sitting idle in your studio?</h4>
                    <p className="text-xs text-emerald-700">Turn your cameras, tech, or tools into monthly revenue by listing your equipment today.</p>
                  </div>
                </div>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="whitespace-nowrap">
                    List Your Equipment Now →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Live Platform Guarantee Card */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">100% Real Users & Active Community Gear</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                  RentWise operates as an authentic live marketplace. There are no demo users, simulated accounts, or automated dummy listings. Only registered users set products, and all bookings are direct transactions between verified community members.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/register">
                <Button variant="primary" size="md" className="text-xs font-bold whitespace-nowrap">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Renting */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-2">
              Why Buy When You Can Rent?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              Unlock Top-Tier Equipment Without the Massive Capital Outlay
            </h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Professional cameras, computing workstations, and industrial tools lose value quickly. RentWise gives creators, freelancers, and businesses total flexibility.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Save 85%+ on Project Budgets</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay only for the exact days you use the equipment rather than tying up thousands in depreciating hardware.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Try Before You Buy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test the Sony A7 IV vs Canon R5, or test an M3 Max MacBook on actual workloads before committing to purchase.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sustainable & Circular Economy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maximize device utilization, cut electronic waste, and support local equipment owners in your creative ecosystem.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/marketplace">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Available Equipment
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                alt="Production equipment"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Average Savings</span>
                  <span className="text-lg font-extrabold text-navy-950 font-sans">$2,450 / shoot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA: For Renters & Equipment Owners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Renter Box */}
          <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-2">
                Need Gear for a Project?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Find Equipment Near You
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Search our catalog of tested 4K cameras, high-power drones, projectors, and audio sets. Instant booking requests and transparent pricing.
              </p>
            </div>
            <Link to="/marketplace">
              <Button variant="accent" size="md" icon={Search}>
                Browse Marketplace
              </Button>
            </Link>
          </div>

          {/* Vendor Box */}
          <div className="bg-gradient-to-br from-brand-700 to-teal-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-teal-200 uppercase tracking-wider block mb-2">
                Have Idle Gear Sitting on Shelves?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Monetize Your Equipment
              </h3>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed mb-6">
                Turn your cameras, laptops, and workshop tools into a recurring revenue stream. Manage bookings, set deposits, and grow your rental business.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/vendor/dashboard">
                <Button variant="navy" size="md" icon={ArrowRight}>
                  Open Vendor Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
