import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Boxes, Compass, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* Visual Badge */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-teal-50 border border-teal-200 text-brand-600 flex items-center justify-center shadow-soft">
          <Compass className="w-12 h-12 text-brand-600 animate-pulse" />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-navy-950 text-white text-[10px] font-bold">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Equipment Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page or rental gear link you are looking for has been moved, unlisted, or does not exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" icon={ArrowLeft} className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link to="/marketplace" className="w-full sm:w-auto">
            <Button variant="primary" size="md" icon={Search} className="w-full">
              Explore Marketplace
            </Button>
          </Link>
        </div>

        {/* Quick link helpers */}
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500">
          <span>Popular categories: </span>
          <Link to="/marketplace?category=cameras" className="font-semibold text-brand-600 hover:underline">
            Cameras
          </Link>
          <span className="mx-1.5">•</span>
          <Link to="/marketplace?category=laptops" className="font-semibold text-brand-600 hover:underline">
            Laptops
          </Link>
          <span className="mx-1.5">•</span>
          <Link to="/marketplace?category=gaming" className="font-semibold text-brand-600 hover:underline">
            Gaming
          </Link>
        </div>
      </div>
    </div>
  );
};
