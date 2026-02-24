import React from 'react';
import AdminSidebar from '../admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <AdminSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
