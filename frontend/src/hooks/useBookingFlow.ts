import { useState, useCallback } from 'react';
import type { Address, Service } from '../backend';

export type PaymentMethod = 'cash' | 'online' | 'wallet';

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface BookingFlowState {
  cartItems: CartItem[];
  selectedAddress: Address | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  notes: string;
  paymentMethod: PaymentMethod;
  confirmedBookingId: string | null;
}

const initialState: BookingFlowState = {
  cartItems: [],
  selectedAddress: null,
  selectedDate: null,
  selectedTimeSlot: null,
  notes: '',
  paymentMethod: 'cash',
  confirmedBookingId: null,
};

export function useBookingFlow() {
  const [state, setState] = useState<BookingFlowState>(initialState);

  const addToCart = useCallback((service: Service) => {
    setState((prev) => {
      const existing = prev.cartItems.find((item) => item.service.id === service.id);
      if (existing) {
        return {
          ...prev,
          cartItems: prev.cartItems.map((item) =>
            item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...prev, cartItems: [...prev.cartItems, { service, quantity: 1 }] };
    });
  }, []);

  const removeFromCart = useCallback((serviceId: bigint) => {
    setState((prev) => ({
      ...prev,
      cartItems: prev.cartItems.filter((item) => item.service.id !== serviceId),
    }));
  }, []);

  const updateQuantity = useCallback((serviceId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setState((prev) => ({
        ...prev,
        cartItems: prev.cartItems.filter((item) => item.service.id !== serviceId),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        cartItems: prev.cartItems.map((item) =>
          item.service.id === serviceId ? { ...item, quantity } : item
        ),
      }));
    }
  }, []);

  const setSelectedAddress = useCallback((address: Address | null) => {
    setState((prev) => ({ ...prev, selectedAddress: address }));
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setState((prev) => ({ ...prev, selectedDate: date }));
  }, []);

  const setSelectedTimeSlot = useCallback((slot: string | null) => {
    setState((prev) => ({ ...prev, selectedTimeSlot: slot }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const setConfirmedBookingId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, confirmedBookingId: id }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  const cartTotal = state.cartItems.reduce(
    (sum, item) => sum + Number(item.service.price) * item.quantity,
    0
  );

  const cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedAddress,
    setSelectedDate,
    setSelectedTimeSlot,
    setNotes,
    setPaymentMethod,
    setConfirmedBookingId,
    resetFlow,
    cartTotal,
    cartCount,
  };
}
