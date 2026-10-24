import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { validateLoginForm } from '../utils/validators';
import {
  Boxes,
  Lock,
  Mail,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
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

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-500/20">
            <Boxes className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-950 tracking-tight">
            Sign In to RentWise
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>

        {errors.form && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
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
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border ${
                  errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
            </div>
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
            className="w-full text-xs font-bold py-2.5"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Footer link to register */}
        <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
