import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, MapPin, Calendar, Clock, CreditCard, Wallet, Banknote, Copy } from 'lucide-react';
import type { CartItem, PaymentMethod } from '../../hooks/useBookingFlow';
import type { Address } from '../../backend';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BookingConfirmationProps {
  cartItems: CartItem[];
  cartTotal: number;
  selectedAddress: Address | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  notes: string;
  paymentMethod: PaymentMethod;
  confirmedBookingId: string | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onConfirm: () => void;
  onViewBooking: () => void;
  isConfirming?: boolean;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BookingConfirmation({
  cartItems,
  cartTotal,
  selectedAddress,
  selectedDate,
  selectedTimeSlot,
  notes,
  paymentMethod,
  confirmedBookingId,
  onPaymentMethodChange,
  onBack,
  onConfirm,
  onViewBooking,
  isConfirming,
}: BookingConfirmationProps) {
  if (confirmedBookingId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mb-6 shadow-card-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          Your booking has been placed successfully. We'll assign a technician shortly.
        </p>

        <div className="w-full bg-card rounded-2xl p-5 border border-border shadow-card mb-6">
          <p className="text-xs text-muted-foreground text-center mb-2">Booking ID</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-bold text-gradient">{confirmedBookingId}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(confirmedBookingId);
                toast.success('Booking ID copied!');
              }}
              className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Copy className="w-4 h-4 text-primary" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Save this for future reference</p>
        </div>

        <div className="w-full space-y-3">
          <Button onClick={onViewBooking} className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0">
            View Booking
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full h-12 rounded-xl">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Confirm Booking</h1>
        <p className="text-white/70 text-sm mt-1">Review your order details</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Services */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <h3 className="font-semibold text-sm text-foreground mb-3">Services</h3>
          <div className="space-y-2">
            {cartItems.map(({ service, quantity }) => (
              <div key={service.id.toString()} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">x{quantity}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">₹{Number(service.price) * quantity}</p>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-sm text-foreground">Total</span>
              <span className="font-bold text-primary">₹{cartTotal}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        {selectedAddress && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Service Address</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
            </p>
          </div>
        )}

        {/* Date & Time */}
        {selectedDate && selectedTimeSlot && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{selectedTimeSlot}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
            <h3 className="font-semibold text-sm text-foreground mb-1">Notes</h3>
            <p className="text-sm text-muted-foreground">{notes}</p>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
          <h3 className="font-semibold text-sm text-foreground mb-3">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}>
            <div className="space-y-2">
              {[
                { value: 'cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when service is done' },
                { value: 'online', label: 'Online Payment', icon: CreditCard, desc: 'UPI, Cards, Net Banking' },
                { value: 'wallet', label: 'Wallet Deduction', icon: Wallet, desc: 'Use your ServeEase wallet' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <div
                  key={value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => onPaymentMethodChange(value as PaymentMethod)}
                >
                  <RadioGroupItem value={value} id={value} />
                  <Icon className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor={value} className="text-sm font-medium cursor-pointer">{label}</Label>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={onConfirm}
          disabled={isConfirming}
          className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0"
        >
          {isConfirming ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Confirming...</>
          ) : (
            `Confirm Booking — ₹${cartTotal}`
          )}
        </Button>
      </div>
    </div>
  );
}
