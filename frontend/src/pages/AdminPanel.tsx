import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UsersManagement from '../components/admin/UsersManagement';
import TechniciansManagement from '../components/admin/TechniciansManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import ReportsScreen from '../components/admin/ReportsScreen';
import { Shield, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPanel() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { isFetching: actorFetching } = useActor();

  // Only runs when authenticated (hook is gated on isAuthenticated)
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const [activeSection, setActiveSection] = useState('dashboard');

  const isLoggingIn = loginStatus === 'logging-in';

  // Step 1: Actor is still initializing
  if (actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  // Step 2: Not authenticated — show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with your administrator account to access the management dashboard.
          </p>
          <Button
            onClick={async () => {
              try {
                await login();
              } catch (error: unknown) {
                const err = error as Error;
                if (err?.message === 'User is already authenticated') {
                  await queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
                }
              }
            }}
            disabled={isLoggingIn}
            className="w-full h-12 rounded-2xl gradient-primary text-white font-semibold text-base"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
          <button
            onClick={() => { window.location.pathname = '/'; }}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Authenticated but admin check is still loading
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Step 4: Authenticated but not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have administrator privileges to access this panel. Please contact your system administrator.
          </p>
          <Button
            variant="outline"
            onClick={() => { window.location.pathname = '/'; }}
            className="rounded-2xl"
          >
            ← Back to home
          </Button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <UsersManagement />;
      case 'technicians': return <TechniciansManagement />;
      case 'bookings': return <BookingsManagement />;
      case 'services': return <ServicesManagement />;
      case 'offers': return <OffersManagement />;
      case 'reports': return <ReportsScreen />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
}

function OffersManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offers Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and manage promotional offers</p>
      </div>
      <div className="bg-card rounded-2xl p-8 border border-border shadow-card text-center">
        <div className="text-5xl mb-4">🏷️</div>
        <p className="text-muted-foreground font-medium">Offers management coming soon</p>
        <p className="text-sm text-muted-foreground mt-1">Create discount codes and promotional banners</p>
      </div>
    </div>
  );
}
