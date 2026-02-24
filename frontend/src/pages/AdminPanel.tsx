import React, { useState } from 'react';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UsersManagement from '../components/admin/UsersManagement';
import TechniciansManagement from '../components/admin/TechniciansManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import ReportsScreen from '../components/admin/ReportsScreen';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');

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
