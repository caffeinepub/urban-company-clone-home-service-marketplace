import React from 'react';
import { User, MapPin, Bell, Shield, HelpCircle, LogOut, ChevronRight, Phone, Mail, Settings } from 'lucide-react';
import type { UserProfileResponse } from '../../backend';
import { UserRole } from '../../backend';
import { Button } from '@/components/ui/button';

interface AccountViewProps {
  userProfile: UserProfileResponse | null;
  onLogout: () => void;
  onNavigateAdmin?: () => void;
}

export default function AccountView({ userProfile, onLogout, onNavigateAdmin }: AccountViewProps) {
  const fullName = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
    : 'Guest User';

  const isAdmin = userProfile?.role === UserRole.admin;

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="gradient-primary px-4 pt-10 pb-8">
        <h1 className="text-xl font-bold text-white mb-4">My Account</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">{fullName}</p>
            {userProfile?.phone && (
              <p className="text-white/70 text-sm flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {userProfile.phone}
              </p>
            )}
            {userProfile?.email && (
              <p className="text-white/70 text-sm flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {userProfile.email}
              </p>
            )}
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <Shield className="w-2.5 h-2.5" />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Admin Panel shortcut — only for admins */}
        {isAdmin && (
          <button
            onClick={onNavigateAdmin ?? (() => { window.location.pathname = '/admin'; })}
            className="w-full bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-primary">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Manage platform settings</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>
        )}

        {/* Menu Items */}
        {[
          { icon: MapPin, label: 'Saved Addresses', desc: `${userProfile?.savedAddresses?.length ?? 0} addresses` },
          { icon: Bell, label: 'Notifications', desc: 'Manage alerts' },
          { icon: Shield, label: 'Privacy & Security', desc: 'Account security' },
          { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact' },
        ].map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="w-full bg-card rounded-2xl p-4 border border-border shadow-xs flex items-center gap-3 hover:shadow-card transition-shadow"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        {/* Logout */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5 mt-4"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-2 pb-4">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'serveease-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
