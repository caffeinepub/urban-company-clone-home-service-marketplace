import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type BookingStatus = 'Pending' | 'Assigned' | 'OnTheWay' | 'InProgress' | 'Completed' | 'Cancelled';

interface AdminBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  technicianName: string | null;
  serviceName: string;
  status: BookingStatus;
  amount: number;
  date: string;
}

const MOCK_BOOKINGS: AdminBooking[] = [
  { id: '1', bookingCode: 'BK123456', customerName: 'Priya Sharma', technicianName: 'Rajesh Kumar', serviceName: 'AC Cleaning', status: 'InProgress', amount: 799, date: '2026-02-24' },
  { id: '2', bookingCode: 'BK789012', customerName: 'Rahul Mehta', technicianName: 'Suresh Patel', serviceName: 'Plumbing', status: 'Assigned', amount: 499, date: '2026-02-24' },
  { id: '3', bookingCode: 'BK345678', customerName: 'Anita Singh', technicianName: null, serviceName: 'Electrical', status: 'Pending', amount: 999, date: '2026-02-25' },
  { id: '4', bookingCode: 'BK901234', customerName: 'Vikram Patel', technicianName: 'Rajesh Kumar', serviceName: 'Cleaning', status: 'Completed', amount: 649, date: '2026-02-23' },
  { id: '5', bookingCode: 'BK567890', customerName: 'Meera Joshi', technicianName: null, serviceName: 'Pest Control', status: 'Cancelled', amount: 1299, date: '2026-02-22' },
  { id: '6', bookingCode: 'BK112233', customerName: 'Arjun Nair', technicianName: null, serviceName: 'Carpentry', status: 'Pending', amount: 850, date: '2026-02-26' },
  { id: '7', bookingCode: 'BK445566', customerName: 'Sunita Rao', technicianName: 'Suresh Patel', serviceName: 'Painting', status: 'OnTheWay', amount: 2499, date: '2026-02-24' },
];

const TECHNICIANS = ['Rajesh Kumar', 'Suresh Patel', 'Amit Singh'];

const STATUS_COLORS: Record<BookingStatus, string> = {
  Pending: 'bg-gray-100 text-gray-600',
  Assigned: 'bg-blue-50 text-blue-600',
  OnTheWay: 'bg-purple-50 text-purple-600',
  InProgress: 'bg-orange-50 text-orange-600',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-600',
};

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  Pending: ['Assigned', 'Cancelled'],
  Assigned: ['OnTheWay', 'Cancelled'],
  OnTheWay: ['InProgress', 'Cancelled'],
  InProgress: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

const ALL_STATUSES: BookingStatus[] = ['Pending', 'Assigned', 'OnTheWay', 'InProgress', 'Completed', 'Cancelled'];

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<AdminBooking[]>(MOCK_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || b.date === dateFilter;
    return matchStatus && matchSearch && matchDate;
  });

  const assignTechnician = (bookingId: string, techName: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, technicianName: techName, status: 'Assigned' } : b
      )
    );
    toast.success(`Assigned to ${techName}`);
  };

  const changeStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} bookings shown</p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, booking ID, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl w-44"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-xs text-muted-foreground hover:text-foreground px-2"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {(['all', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              statusFilter === s
                ? 'gradient-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s === 'all' ? `All (${bookings.length})` : `${s} (${bookings.filter((b) => b.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Booking ID', 'Customer', 'Technician', 'Service', 'Date', 'Status', 'Amount', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => {
                  const transitions = VALID_TRANSITIONS[booking.status];
                  return (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                      {/* Booking ID */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-mono font-semibold text-foreground">
                          {booking.bookingCode}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {booking.customerName}
                      </td>

                      {/* Technician */}
                      <td className="px-4 py-3">
                        {booking.technicianName ? (
                          <span className="text-sm text-foreground">{booking.technicianName}</span>
                        ) : booking.status === 'Pending' || booking.status === 'Assigned' ? (
                          <Select onValueChange={(v) => assignTechnician(booking.id, v)}>
                            <SelectTrigger className="h-8 rounded-xl text-xs w-36 border-dashed">
                              <SelectValue placeholder="Assign..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {TECHNICIANS.map((t) => (
                                <SelectItem key={t} value={t} className="text-sm">
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {booking.serviceName}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {booking.date}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">
                        ₹{booking.amount}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {transitions.length > 0 ? (
                          <Select onValueChange={(v) => changeStatus(booking.id, v as BookingStatus)}>
                            <SelectTrigger className="h-8 rounded-xl text-xs w-36">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {transitions.map((s) => (
                                <SelectItem key={s} value={s} className="text-sm">
                                  → {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
