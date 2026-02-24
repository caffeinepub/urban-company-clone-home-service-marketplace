import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../hooks/useBookingFlow';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  onBack: () => void;
  onUpdateQuantity: (serviceId: bigint, quantity: number) => void;
  onRemove: (serviceId: bigint) => void;
  onProceed: () => void;
}

export default function CartSummary({
  cartItems,
  cartTotal,
  onBack,
  onUpdateQuantity,
  onRemove,
  onProceed,
}: CartSummaryProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="gradient-primary px-4 pt-10 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 mb-4 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Your Cart</h1>
        <p className="text-white/70 text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 pt-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add services to get started</p>
            <Button onClick={onBack} className="mt-6 rounded-xl gradient-primary text-white border-0">
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map(({ service, quantity }) => (
              <div key={service.id.toString()} className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-primary/5 flex-shrink-0 overflow-hidden">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🔧</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{Number(service.duration)} min</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{Number(service.price)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(service.id)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(service.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(service.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    ₹{Number(service.price) * quantity}
                  </span>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border mt-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-lg">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
          <Button
            onClick={onProceed}
            className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0"
          >
            Proceed to Book — ₹{cartTotal}
          </Button>
        </div>
      )}
    </div>
  );
}
