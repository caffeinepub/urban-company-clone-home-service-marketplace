import React from 'react';
import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarCheck,
  Package,
  Tag,
  BarChart3,
  Home,
  LogOut,
} from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'technicians'
  | 'bookings'
  | 'services'
  | 'offers'
  | 'reports';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'technicians', label: 'Technicians', icon: Wrench },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'services', label: 'Services & Categories', icon: Package },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sidebar-foreground font-bold text-sm">ServeEase</p>
            <p className="text-sidebar-foreground/50 text-[10px]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-card'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
