import React, { useState } from 'react';
import { CalendarCheck, Clock, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BookingStatus = 'Pending' | 'Assigned' | 'OnTheWay' | 'InProgress' | 'Completed' | 'Cancelled';

interface MockBooking {
  id: string;
  bookingCode: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  address: string;
  status: BookingStatus;
  amount: number;
  technicianName?: string;
}

const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: '1',
    bookingCode: 'BK123456',
    serviceName: 'AC Deep Cleaning',
    date: '2026-02-25',
    timeSlot: '10:00 AM',
    address: '123 Main St, Mumbai',
    status: 'Assigned',
    amount: 799,
    technicianName: 'Rajesh Kumar',
  },
  {
    id: '2',
    bookingCode: 'BK789012',
    serviceName: 'Plumbing Repair',
    date: '2026-02-20',
    timeSlot: '02:00 PM',
    address: '456 Park Ave, Mumbai',
    status: 'Completed',
    amount: 499,
    technicianName: 'Suresh Patel',
  },
  {
    id: '3',
    bookingCode: 'BK345678',
    serviceName: 'Electrical Wiring',
    date: '2026-02-28',
    timeSlot: '11:00 AM',
    address: '789 Lake Rd, Mumbai',
    status: 'Pending',
    amount: 999,
  },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  Pending: { label: 'Pending', color: 'text-gray-600', bg: 'bg-gray-100' },
  Assigned: { label: 'Assigned', color: 'text-blue-600', bg: 'bg-blue-50' },
  OnTheWay: { label: 'On the Way', color: 'text-purple-600', bg: 'bg-purple-50' },
  InProgress: { label: 'In Progress', color: 'text-orange-600', bg: 'bg-orange-50' },
  Completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50' },
  Cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function BookingsView() {
  const [activeFilter, setActiveFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null);

  const filtered = activeFilter === 'all'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter((b) => b.status === activeFilter);

  if (selectedBooking) {
    return (
      <BookingDetailView
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-white">My Bookings</h1>
        <p className="text-white/70 text-sm mt-1">{MOCK_BOOKINGS.length} total bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pt-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 min-w-max">
          {(['all', 'Pending', 'Assigned', 'OnTheWay', 'InProgress', 'Completed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === status
                  ? 'gradient-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-2 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No bookings found</p>
          </div>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={() => setSelectedBooking(booking)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onClick }: { booking: MockBooking; onClick: () => void }) {
  const status = STATUS_CONFIG[booking.status];
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl p-4 border border-border shadow-xs cursor-pointer hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-foreground">{booking.serviceName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">#{booking.bookingCode}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{booking.date} · {booking.timeSlot}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {booking.technicianName ? `Tech: ${booking.technicianName}` : 'Awaiting assignment'}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-primary">₹{booking.amount}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function BookingDetailView({ booking, onBack }: { booking: MockBooking; onBack: () => void }) {
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const status = STATUS_CONFIG[booking.status];

  const TIMELINE: BookingStatus[] = ['Pending', 'Assigned', 'OnTheWay', 'InProgress', 'Completed'];
  const currentIdx = TIMELINE.indexOf(booking.status);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Booking Details</h1>
        <p className="text-white/70 text-sm mt-1">#{booking.bookingCode}</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border shadow-xs">
          <div>
            <p className="text-xs text-muted-foreground">Current Status</p>
            <p className="font-bold text-foreground mt-0.5">{booking.serviceName}</p>
          </div>
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Timeline */}
        {booking.status !== 'Cancelled' && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
            <h3 className="font-semibold text-sm text-foreground mb-4">Status Timeline</h3>
            <div className="space-y-0">
              {TIMELINE.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        isDone ? 'gradient-primary border-transparent' : 'border-border bg-background'
                      } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`} />
                      {idx < TIMELINE.length - 1 && (
                        <div className={`w-0.5 h-8 ${isDone && idx < currentIdx ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {STATUS_CONFIG[step].label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Booking Info</h3>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{booking.date} at {booking.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{booking.address}</span>
          </div>
          {booking.technicianName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Technician: <strong className="text-foreground">{booking.technicianName}</strong></span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-sm font-bold text-primary">₹{booking.amount}</span>
          </div>
        </div>

        {/* Review Form */}
        {booking.status === 'Completed' && !reviewSubmitted && (
          <ReviewForm onSubmitted={() => setReviewSubmitted(true)} />
        )}
        {reviewSubmitted && (
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-green-600 font-medium text-sm">✅ Review submitted! Thank you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');

  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
      <h3 className="font-semibold text-sm text-foreground mb-3">Rate Your Experience</h3>
      <div className="flex justify-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            {s <= (hover || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Share your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-xl border border-border p-3 text-sm resize-none min-h-[80px] bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={() => rating > 0 && onSubmitted()}
        disabled={rating === 0}
        className="mt-3 w-full h-10 rounded-xl gradient-primary text-white text-sm font-semibold disabled:opacity-50"
      >
        Submit Review
      </button>
    </div>
  );
}
