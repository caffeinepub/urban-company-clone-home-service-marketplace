import React from 'react';
import { CalendarCheck, Activity, DollarSign, Wrench, TrendingUp, Users } from 'lucide-react';

const KPI_CARDS = [
  {
    title: 'Total Bookings Today',
    value: '24',
    change: '+12%',
    positive: true,
    icon: CalendarCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Active Bookings',
    value: '8',
    change: '+3',
    positive: true,
    icon: Activity,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Revenue Today',
    value: '₹18,450',
    change: '+8%',
    positive: true,
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Active Technicians',
    value: '15',
    change: '+2',
    positive: true,
    icon: Wrench,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

const RECENT_BOOKINGS = [
  { id: 'BK123456', customer: 'Priya Sharma', service: 'AC Cleaning', status: 'InProgress', amount: 799 },
  { id: 'BK789012', customer: 'Rahul Mehta', service: 'Plumbing', status: 'Assigned', amount: 499 },
  { id: 'BK345678', customer: 'Anita Singh', service: 'Electrical', status: 'Pending', amount: 999 },
  { id: 'BK901234', customer: 'Vikram Patel', service: 'Cleaning', status: 'Completed', amount: 649 },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-600',
  Assigned: 'bg-blue-50 text-blue-600',
  InProgress: 'bg-orange-50 text-orange-600',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-600',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ title, value, change, positive, icon: Icon, color, bg }) => (
          <div key={title} className="bg-card rounded-2xl p-4 border border-border shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Revenue This Week</h3>
          </div>
          <div className="space-y-3">
            {[
              { day: 'Mon', amount: 12400, pct: 70 },
              { day: 'Tue', amount: 18200, pct: 90 },
              { day: 'Wed', amount: 9800, pct: 55 },
              { day: 'Thu', amount: 15600, pct: 80 },
              { day: 'Fri', amount: 18450, pct: 95 },
            ].map(({ day, amount, pct }) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-8">{day}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="gradient-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-foreground w-16 text-right">₹{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Recent Bookings</h3>
          </div>
          <div className="space-y-3">
            {RECENT_BOOKINGS.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{booking.customer}</p>
                  <p className="text-xs text-muted-foreground">{booking.service} · #{booking.id}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {booking.status}
                  </span>
                  <p className="text-xs font-bold text-primary mt-0.5">₹{booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
