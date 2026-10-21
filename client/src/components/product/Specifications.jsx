import React from 'react';
import { CheckCircle2, PackageCheck } from 'lucide-react';

export const Specifications = ({ specs = {}, features = [], inclusions = [] }) => {
  const specEntries = Object.entries(specs);

  return (
    <div className="space-y-8">
      {/* Key Features */}
      {features.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Highlights & Included Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-medium leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Package Inclusions */}
      {inclusions.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-brand-600" />
            <span>What's In The Box / Case</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {inclusions.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technical Specifications Table */}
      {specEntries.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Technical Specifications
          </h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100">
                {specEntries.map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold text-slate-500 capitalize w-1/3">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
