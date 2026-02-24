import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';

// Customer
import MobileContainer from './components/layouts/MobileContainer';
import AuthFlow from './components/customer/AuthFlow';
import ProfileSetupModal from './components/customer/ProfileSetupModal';
import BottomNavigation, { type CustomerTab } from './components/customer/BottomNavigation';
import HomeScreen from './components/customer/HomeScreen';
import ServiceListByCategory from './components/customer/ServiceListByCategory';
import ServiceDetailPage from './components/customer/ServiceDetailPage';
import CartSummary from './components/customer/CartSummary';
import AddressSelection from './components/customer/AddressSelection';
import DateTimeSlotPicker from './components/customer/DateTimeSlotPicker';
import BookingNotesEntry from './components/customer/BookingNotesEntry';
import BookingConfirmation from './components/customer/BookingConfirmation';
import BookingsView from './components/customer/BookingsView';
import RewardsView from './components/customer/RewardsView';
import AccountView from './components/customer/AccountView';

// Technician
import TechnicianApp from './pages/TechnicianApp';

// Admin
import AdminPanel from './pages/AdminPanel';

// Booking flow
import { useBookingFlow } from './hooks/useBookingFlow';

import type { ServiceCategory, Service } from './backend';

// ── App Mode ─────────────────────────────────────────────────────────────────

type AppMode = 'customer' | 'technician' | 'admin';

type CustomerView =
  | 'home'
  | 'category'
  | 'service-detail'
  | 'cart'
  | 'address'
  | 'datetime'
  | 'notes'
  | 'confirm';

// ── Customer App ─────────────────────────────────────────────────────────────

function CustomerApp({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [customerView, setCustomerView] = useState<CustomerView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<bigint | null>(null);
  const [confirming, setConfirming] = useState(false);

  const bookingFlow = useBookingFlow();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleTabChange = (tab: CustomerTab) => {
    setActiveTab(tab);
    setCustomerView('home');
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setCustomerView('category');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedServiceId(service.id);
    setCustomerView('service-detail');
  };

  const handleConfirmBooking = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1200));
    const bookingId = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    bookingFlow.setConfirmedBookingId(bookingId);
    setConfirming(false);
  };

  const defaultAddress = userProfile?.savedAddresses?.find((a) => a.isDefault);
  const defaultAddressText = defaultAddress
    ? `${defaultAddress.addressLine1}, ${defaultAddress.city}`
    : undefined;

  if (!isAuthenticated) {
    return (
      <MobileContainer>
        <AuthFlow onSuccess={() => {}} />
      </MobileContainer>
    );
  }

  const renderContent = () => {
    if (activeTab === 'bookings') {
      return <BookingsView />;
    }
    if (activeTab === 'rewards') {
      return <RewardsView userProfile={userProfile ?? null} />;
    }
    if (activeTab === 'account') {
      return (
        <AccountView
          userProfile={userProfile ?? null}
          onLogout={handleLogout}
          onNavigateAdmin={onSwitchToAdmin}
        />
      );
    }

    // Home tab views
    switch (customerView) {
      case 'category':
        return selectedCategory ? (
          <ServiceListByCategory
            category={selectedCategory}
            onBack={() => setCustomerView('home')}
            onServiceSelect={handleServiceSelect}
            onAddToCart={bookingFlow.addToCart}
          />
        ) : null;

      case 'service-detail':
        return selectedServiceId ? (
          <ServiceDetailPage
            serviceId={selectedServiceId}
            onBack={() => setCustomerView(selectedCategory ? 'category' : 'home')}
            onAddToCart={bookingFlow.addToCart}
          />
        ) : null;

      case 'cart':
        return (
          <CartSummary
            cartItems={bookingFlow.cartItems}
            cartTotal={bookingFlow.cartTotal}
            onBack={() => setCustomerView('home')}
            onUpdateQuantity={bookingFlow.updateQuantity}
            onRemove={bookingFlow.removeFromCart}
            onProceed={() => setCustomerView('address')}
          />
        );

      case 'address':
        return (
          <AddressSelection
            selectedAddress={bookingFlow.selectedAddress}
            onSelectAddress={bookingFlow.setSelectedAddress}
            onBack={() => setCustomerView('cart')}
            onContinue={() => setCustomerView('datetime')}
          />
        );

      case 'datetime':
        return (
          <DateTimeSlotPicker
            selectedDate={bookingFlow.selectedDate}
            selectedTimeSlot={bookingFlow.selectedTimeSlot}
            onSelectDate={bookingFlow.setSelectedDate}
            onSelectTimeSlot={bookingFlow.setSelectedTimeSlot}
            onBack={() => setCustomerView('address')}
            onContinue={() => setCustomerView('notes')}
          />
        );

      case 'notes':
        return (
          <BookingNotesEntry
            notes={bookingFlow.notes}
            onNotesChange={bookingFlow.setNotes}
            onBack={() => setCustomerView('datetime')}
            onContinue={() => setCustomerView('confirm')}
          />
        );

      case 'confirm':
        return (
          <BookingConfirmation
            cartItems={bookingFlow.cartItems}
            cartTotal={bookingFlow.cartTotal}
            selectedAddress={bookingFlow.selectedAddress}
            selectedDate={bookingFlow.selectedDate}
            selectedTimeSlot={bookingFlow.selectedTimeSlot}
            notes={bookingFlow.notes}
            paymentMethod={bookingFlow.paymentMethod}
            confirmedBookingId={bookingFlow.confirmedBookingId}
            onPaymentMethodChange={bookingFlow.setPaymentMethod}
            onBack={() => setCustomerView('notes')}
            onConfirm={handleConfirmBooking}
            onViewBooking={() => {
              bookingFlow.resetFlow();
              setActiveTab('bookings');
              setCustomerView('home');
            }}
            isConfirming={confirming}
          />
        );

      default:
        return (
          <HomeScreen
            onCategorySelect={handleCategorySelect}
            onServiceSelect={handleServiceSelect}
            isAuthenticated={isAuthenticated}
            userName={userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : undefined}
            defaultAddress={defaultAddressText}
          />
        );
    }
  };

  const showBottomNav = !['cart', 'address', 'datetime', 'notes', 'confirm', 'service-detail', 'category'].includes(customerView) || activeTab !== 'home';

  return (
    <MobileContainer>
      <ProfileSetupModal open={showProfileSetup} onComplete={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
      {showBottomNav && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={bookingFlow.cartCount}
        />
      )}
      {/* Cart FAB when items in cart and on home views */}
      {bookingFlow.cartCount > 0 && activeTab === 'home' && !['cart', 'address', 'datetime', 'notes', 'confirm'].includes(customerView) && (
        <button
          onClick={() => setCustomerView('cart')}
          className="fixed bottom-20 right-4 gradient-primary text-white rounded-2xl px-4 py-3 shadow-card-lg flex items-center gap-2 z-20 animate-fade-in"
          style={{ maxWidth: 'calc(430px - 2rem)', right: 'max(1rem, calc(50vw - 215px + 1rem))' }}
        >
          <span className="text-sm font-semibold">View Cart ({bookingFlow.cartCount})</span>
          <span className="text-sm font-bold">₹{bookingFlow.cartTotal}</span>
        </button>
      )}
    </MobileContainer>
  );
}

// ── Landing / Mode Selector ───────────────────────────────────────────────────

function LandingPage({ onSelectMode }: { onSelectMode: (mode: AppMode) => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-card-lg">
            <img src="/assets/generated/app-logo.dim_256x256.png" alt="ServeEase" className="w-14 h-14 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <h1 className="text-3xl font-bold text-gradient">ServeEase</h1>
          <p className="text-muted-foreground text-sm mt-2">Home Services Marketplace</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectMode('customer')}
            className="w-full gradient-primary text-white rounded-2xl p-4 flex items-center gap-4 shadow-card hover:shadow-card-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏠</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Customer App</p>
              <p className="text-white/70 text-xs">Book home services easily</p>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('technician')}
            className="w-full bg-card border-2 border-border rounded-2xl p-4 flex items-center gap-4 shadow-xs hover:border-primary/30 hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-base text-foreground">Technician App</p>
              <p className="text-muted-foreground text-xs">Manage your jobs & earnings</p>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('admin')}
            className="w-full bg-card border-2 border-border rounded-2xl p-4 flex items-center gap-4 shadow-xs hover:border-primary/30 hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-base text-foreground">Admin Panel</p>
              <p className="text-muted-foreground text-xs">Manage the platform</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
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

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [appMode, setAppMode] = useState<AppMode | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/technician')) return 'technician';
    if (path.startsWith('/admin')) return 'admin';
    return null;
  });

  return (
    <>
      {appMode === null && <LandingPage onSelectMode={setAppMode} />}
      {appMode === 'customer' && <CustomerApp onSwitchToAdmin={() => setAppMode('admin')} />}
      {appMode === 'technician' && <TechnicianApp />}
      {appMode === 'admin' && <AdminPanel />}
      <Toaster richColors position="top-center" />
    </>
  );
}
