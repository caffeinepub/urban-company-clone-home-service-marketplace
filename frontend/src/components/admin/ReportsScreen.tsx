import React, { useState } from 'react';
import { TrendingUp, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyRevenueEntry {
  date: string;
  revenue: number;
}

interface MonthlyRevenueEntry {
  month: string;
  bookings: number;
  revenue: number;
  growth: number | null;
}

interface TechnicianPerformanceEntry {
  name: string;
  completedJobs: number;
  avgRating: number;
  totalEarnings: number;
  commissionPaid: number;
}

type SortKey = 'completedJobs' | 'avgRating' | 'totalEarnings' | 'commissionPaid';
type SortDir = 'asc' | 'desc';

// ── Mock Data ─────────────────────────────────────────────────────────────────

function generateDailyRevenue(): DailyRevenueEntry[] {
  const data: DailyRevenueEntry[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const revenue = Math.floor(Math.random() * 25000) + 5000;
    data.push({ date: label, revenue });
  }
  return data;
}

const DAILY_REVENUE: DailyRevenueEntry[] = generateDailyRevenue();

const MONTHLY_REVENUE: MonthlyRevenueEntry[] = [
  { month: 'Sep 2025', bookings: 312, revenue: 248600, growth: 8.2 },
  { month: 'Oct 2025', bookings: 389, revenue: 312400, growth: 25.7 },
  { month: 'Nov 2025', bookings: 421, revenue: 338900, growth: 8.5 },
  { month: 'Dec 2025', bookings: 398, revenue: 319200, growth: -5.8 },
  { month: 'Jan 2026', bookings: 445, revenue: 356800, growth: 11.8 },
  { month: 'Feb 2026', bookings: 187, revenue: 149600, growth: null },
];

const TECHNICIAN_PERFORMANCE: TechnicianPerformanceEntry[] = [
  { name: 'Rajesh Kumar', completedJobs: 145, avgRating: 4.8, totalEarnings: 87200, commissionPaid: 21800 },
  { name: 'Suresh Patel', completedJobs: 89, avgRating: 4.6, totalEarnings: 53400, commissionPaid: 13350 },
  { name: 'Amit Singh', completedJobs: 67, avgRating: 4.5, totalEarnings: 40200, commissionPaid: 10050 },
  { name: 'Deepak Sharma', completedJobs: 32, avgRating: 4.2, totalEarnings: 19200, commissionPaid: 4800 },
  { name: 'Pradeep Verma', completedJobs: 28, avgRating: 4.7, totalEarnings: 16800, commissionPaid: 4200 },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-card text-sm">
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        <p className="font-bold text-primary">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

// ── Revenue Tab ───────────────────────────────────────────────────────────────

function RevenueTab() {
  const totalRevenue = DAILY_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const avgDaily = Math.round(totalRevenue / DAILY_REVENUE.length);
  const bestDay = Math.max(...DAILY_REVENUE.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '30-Day Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: 'Last 30 days' },
          { label: 'Daily Average', value: `₹${(avgDaily / 1000).toFixed(1)}K`, sub: 'Per day' },
          { label: 'Best Day', value: `₹${(bestDay / 1000).toFixed(1)}K`, sub: 'Peak revenue' },
          { label: 'This Month', value: '₹1.5L', sub: 'Feb 2026' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card rounded-2xl p-4 border border-border shadow-card">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Daily Revenue — Last 30 Days</h3>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={DAILY_REVENUE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 264)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'oklch(0.55 0.03 264)' }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'oklch(0.55 0.03 264)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.5 0.2 264 / 0.05)' }} />
            <Bar dataKey="revenue" fill="oklch(0.5 0.2 264)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Monthly Revenue Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Month', 'Bookings', 'Revenue', 'Growth'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MONTHLY_REVENUE.map((row) => (
                <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{row.month}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.bookings}</td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">
                    ₹{row.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {row.growth !== null ? (
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${
                          row.growth >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {row.growth >= 0 ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {Math.abs(row.growth)}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Current</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Performance Tab ───────────────────────────────────────────────────────────

function PerformanceTab() {
  const [sortKey, setSortKey] = useState<SortKey>('completedJobs');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...TECHNICIAN_PERFORMANCE].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === 'asc' ? diff : -diff;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-muted-foreground/40 ml-1">↕</span>;
    return <span className="text-primary ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const totalJobs = TECHNICIAN_PERFORMANCE.reduce((s, t) => s + t.completedJobs, 0);
  const avgRating =
    TECHNICIAN_PERFORMANCE.reduce((s, t) => s + t.avgRating, 0) / TECHNICIAN_PERFORMANCE.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Total Technicians</p>
          <p className="text-2xl font-bold text-foreground">{TECHNICIAN_PERFORMANCE.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Total Jobs Done</p>
          <p className="text-2xl font-bold text-foreground">{totalJobs}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-card col-span-2 lg:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)} ⭐</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Technician Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Technician
                </th>
                {(
                  [
                    { key: 'completedJobs' as SortKey, label: 'Jobs Done' },
                    { key: 'avgRating' as SortKey, label: 'Avg Rating' },
                    { key: 'totalEarnings' as SortKey, label: 'Earnings' },
                    { key: 'commissionPaid' as SortKey, label: 'Commission' },
                  ]
                ).map(({ key, label }) => (
                  <th
                    key={key}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    <SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((tech, idx) => (
                <tr key={tech.name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{tech.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">
                    {tech.completedJobs}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{tech.avgRating} ⭐</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600">
                    ₹{tech.totalEarnings.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    ₹{tech.commissionPaid.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ReportsScreen ────────────────────────────────────────────────────────

export default function ReportsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track revenue, bookings, and technician performance
        </p>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="rounded-xl">
          <TabsTrigger value="revenue" className="rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <RevenueTab />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
