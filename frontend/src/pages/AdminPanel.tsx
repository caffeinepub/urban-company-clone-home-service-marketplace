import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UsersManagement from '../components/admin/UsersManagement';
import TechniciansManagement from '../components/admin/TechniciansManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import ReportsScreen from '../components/admin/ReportsScreen';
import AuthFlow from '../components/customer/AuthFlow';
import MobileContainer from '../components/layouts/MobileContainer';
import { Shield, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <MobileContainer>
        <AuthFlow onSuccess={() => {}} />
      </MobileContainer>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            You don't have administrator privileges to access this panel.
          </p>
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
