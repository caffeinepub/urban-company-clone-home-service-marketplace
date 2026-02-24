import React, { useState } from 'react';
import { Bell, CheckCheck, Package, Wrench, CheckCircle, CreditCard, Tag } from 'lucide-react';
import { useNotifications, type AppNotification, type NotificationType } from '../../hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationBellProps {
  isAuthenticated: boolean;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'BookingConfirmation': return <Package className="w-4 h-4 text-primary" />;
    case 'TechnicianAssigned': return <Wrench className="w-4 h-4 text-accent" />;
    case 'ServiceCompleted': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'PaymentSuccess': return <CreditCard className="w-4 h-4 text-green-600" />;
    case 'Offer': return <Tag className="w-4 h-4 text-orange-500" />;
  }
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell({ isAuthenticated }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-primary/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] gradient-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-2xl shadow-card-lg border border-border z-50 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={() => markAsRead(notification.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: () => void;
}) {
  return (
    <div
      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
      onClick={onRead}
    >
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!notification.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatTime(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </div>
  );
}
