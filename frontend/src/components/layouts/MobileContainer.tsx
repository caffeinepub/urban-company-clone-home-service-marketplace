import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex items-start justify-center">
      <div
        className={`relative w-full max-w-mobile min-h-screen bg-background shadow-card-lg flex flex-col ${className}`}
        style={{ minHeight: '100dvh' }}
      >
        {children}
      </div>
    </div>
  );
}
