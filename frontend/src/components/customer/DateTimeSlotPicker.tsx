import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateTimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTimeSlot: (slot: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM',
];

function getNext7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DateTimeSlotPicker({
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
  onBack,
  onContinue,
}: DateTimeSlotPickerProps) {
  const days = getNext7Days();

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Select Date & Time</h1>
        <p className="text-white/70 text-sm mt-1">Choose a convenient slot</p>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Date Picker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Select Date</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {days.map((day, i) => {
              const isSelected = selectedDate?.toDateString() === day.toDateString();
              const isToday = i === 0;
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => onSelectDate(day)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 w-14 py-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'gradient-primary border-transparent text-white'
                      : 'bg-card border-border hover:border-primary/30 text-foreground'
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {isToday ? 'Today' : DAY_NAMES[day.getDay()]}
                  </span>
                  <span className="text-lg font-bold">{day.getDate()}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {MONTH_NAMES[day.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Select Time Slot</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => onSelectTimeSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    isSelected
                      ? 'gradient-primary border-transparent text-white'
                      : 'bg-card border-border hover:border-primary/30 text-foreground'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && selectedTimeSlot && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
          <Button onClick={onContinue} className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
