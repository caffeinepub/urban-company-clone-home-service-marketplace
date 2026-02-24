import React from 'react';
import { Home, CalendarCheck, Gift, User } from 'lucide-react';

export type CustomerTab = 'home' | 'bookings' | 'rewards' | 'account';

interface BottomNavigationProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  cartCount?: number;
}

const tabs = [
  { id: 'home' as CustomerTab, label: 'Home', icon: Home },
  { id: 'bookings' as CustomerTab, label: 'Bookings', icon: CalendarCheck },
  { id: 'rewards' as CustomerTab, label: 'Rewards', icon: Gift },
  { id: 'account' as CustomerTab, label: 'Account', icon: User },
];

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-card border-t border-border z-30">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-primary' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
