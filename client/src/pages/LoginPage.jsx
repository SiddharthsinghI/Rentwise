import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { validateLoginForm } from '../utils/validators';
import {
  Boxes,
  Lock,
  Mail,
  User,
  Store,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { login, allUsers } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: err.message || 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (user) => {
    setEmail(user.email);
    setPassword('Password123!');
    setIsSubmitting(true);
    setErrors({});
    try {
      const loggedUser = await login(user.email, 'Password123!');
      if (loggedUser.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: err.message || 'Login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-500/20">
            <Boxes className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
            Sign In to RentWise
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in with your email and password
          </p>
        </div>

        {/* Test Accounts Selector */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Test Accounts (Seeded in MySQL)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Click any account below to sign in via the real backend API:
          </p>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickDemoLogin(u)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-xs transition-all text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700 block">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {u.role === 'vendor' ? `Vendor (${u.businessName || 'AV Gear'})` : 'Customer'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-700">
                  Sign In →
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="px-3 bg-white text-slate-400 font-semibold">Or Sign In Manually</span>
          </div>
        </div>

        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.customer@example.com"
                className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border ${
                  errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border ${
                  errors.password ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-xs font-bold"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Footer link to register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
