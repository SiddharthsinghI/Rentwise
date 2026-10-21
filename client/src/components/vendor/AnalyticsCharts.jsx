import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const PIE_COLORS = ['#0D9488', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#3B82F6'];

export const AnalyticsCharts = ({ monthlyData = [], categoryData = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Rental Revenue Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Monthly gross rental fees earned</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
            Last 6 Months
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#0B132B',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0D9488"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Donut */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">Gear Category Share</h3>
          <p className="text-xs text-slate-500 mt-0.5">Listed equipment distribution</p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} items`, name]}
                  contentStyle={{
                    backgroundColor: '#0B132B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-400 italic">No gear listed yet</p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Total categories represented: <strong>{categoryData.length}</strong>
        </div>
      </div>
    </div>
  );
};
