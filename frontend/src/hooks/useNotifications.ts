import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type NotificationType =
  | 'BookingConfirmation'
  | 'TechnicianAssigned'
  | 'ServiceCompleted'
  | 'PaymentSuccess'
  | 'Offer';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'BookingConfirmation',
    message: 'Your booking BK-2024-001 has been confirmed!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'Offer',
    message: '50% off on your next AC service booking!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    type: 'PaymentSuccess',
    message: 'Payment of ₹499 received successfully.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export function useNotifications(isAuthenticated: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      // In a real implementation, this would call the backend
      return MOCK_NOTIFICATIONS;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 15000,
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real implementation, this would call the backend
      return notificationId;
    },
    onSuccess: (notificationId) => {
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old) =>
        old?.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)) ?? []
      );
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would call the backend
    },
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old) =>
        old?.map((n) => ({ ...n, isRead: true })) ?? []
      );
    },
  });

  const unreadCount = query.data?.filter((n) => !n.isRead).length ?? 0;

  return {
    notifications: query.data ?? [],
    unreadCount,
    isLoading: query.isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  };
}
