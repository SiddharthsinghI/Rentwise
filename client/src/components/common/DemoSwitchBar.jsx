import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { UserCheck, Store, User, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';

export const DemoSwitchBar = () => {
  const { currentUser, allUsers, switchDemoAccount, resetAllDemoData } = useAuth();
  const { bookings } = useBookings();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!currentUser) return null;

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white text-xs border-b border-navy-800/80 px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            DEMO MODE
          </span>
          <span className="hidden md:inline text-slate-300">
            Full client-side simulation. Switch roles below to test workflows:
          </span>
        </div>

        {/* Center / Right: Quick Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 hidden sm:inline">Active User:</span>
          
          {/* Quick buttons on medium screens */}
          <div className="hidden lg:flex items-center gap-1.5">
            {allUsers.map((u) => {
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchDemoAccount(u.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    isActive
                      ? u.role === 'vendor'
                        ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                        : 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                      : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
                  }`}
                  title={`Switch to ${u.name} (${u.role})`}
                >
                  {u.role === 'vendor' ? (
                    <Store className="w-3 h-3 text-purple-300" />
                  ) : (
                    <User className="w-3 h-3 text-teal-300" />
                  )}
                  <span>{u.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1 rounded uppercase tracking-wider ${
                    u.role === 'vendor' ? 'bg-purple-950/60 text-purple-200' : 'bg-teal-950/60 text-teal-200'
                  }`}>
                    {u.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dropdown for compact screens */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-800 text-slate-200 hover:bg-navy-700 font-medium"
            >
              <span>{currentUser.name} ({currentUser.role})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider border-b border-navy-800">
                  Select Demo Account
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchDemoAccount(u.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-navy-800 transition-colors ${
                      u.id === currentUser.id ? 'text-teal-400 font-semibold bg-navy-800/50' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {u.role === 'vendor' ? <Store className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      <span>{u.name}</span>
                    </div>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-navy-950 text-slate-400">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo products, bookings, and users to original initial state?')) {
                resetAllDemoData();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-navy-800/80 transition-colors ml-1"
            title="Reset all demo data to fresh initial seed"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
