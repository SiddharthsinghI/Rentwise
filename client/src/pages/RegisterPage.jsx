import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { validateRegisterForm } from '../utils/validators';
import {
  Boxes,
  Lock,
  Mail,
  User,
  Store,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    businessName: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register(formData);
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-500/20">
            <Boxes className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join RentWise as a gear renter or equipment owner
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            I Want To:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'customer'
                  ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-bold ring-1 ring-brand-500'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1 text-brand-600" />
              <span className="text-xs block">Rent Gear</span>
              <span className="text-[10px] text-slate-400 font-normal">Customer Account</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'vendor' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'vendor'
                  ? 'border-purple-600 bg-purple-50/70 text-purple-700 font-bold ring-1 ring-purple-500'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
              }`}
            >
              <Store className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <span className="text-xs block">List Equipment</span>
              <span className="text-[10px] text-slate-400 font-normal">Vendor Account</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g. Sarah Jenkins"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {formData.role === 'vendor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business / Studio Name (Optional)
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="E.g. Pacific Cinema Rentals"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@example.com"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.password ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.confirmPassword ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-xs font-bold mt-2"
            isLoading={isSubmitting}
          >
            Complete Registration
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
