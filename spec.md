# Specification

## Summary
**Goal:** Build ServeEase Marketplace — a full multi-panel home service marketplace app (Urban Company-style) with a Motoko backend and three React/TypeScript frontends: Customer, Technician, and Admin.

**Planned changes:**

### Backend (Motoko — single actor in backend/main.mo)
- Define stable storage collections: users, technicians, services, categories, bookings, payments, wallets, reviews, referrals, notifications, offers
- Role-based access control with Customer, Technician, and Admin roles; all endpoints validate caller role
- Auth endpoints: registerUser (phone + role), verifyOTP (simulated), auto-login via principal mapping, logout
- Address management: saveAddress, setDefaultAddress, listAddresses, deleteAddress
- Service/category CRUD: createCategory, listCategories, createService, updateService, listServicesByCategory, getServiceDetails (Admin write, all read)
- Booking lifecycle: createBooking (unique BK+timestamp code), assignTechnician, updateBookingStatus (Pending→Assigned→OnTheWay→InProgress→Completed|Cancelled), getBooking, listBookingsByCustomer, listBookingsByTechnician, listAllBookings (with status filter)
- Payment & wallet: recordPayment (CashOnDelivery, OnlinePayment, WalletDeduction), deductFromWallet, addToWallet, getWalletBalance, generateInvoice
- Technician workflow: markReached, markStarted, addExtraItems (recalculates totalAmount), generateFinalBill, markCompleted (deducts commission from earnings)
- Technician earnings: getDailyEarnings, getWeeklyEarnings, getTotalEarnings, getCommissionDeductions
- Reviews: submitReview (only for Completed bookings, no duplicates, rating 1–5), getReviewsByTechnician, getReviewsByService
- Referral system: generateReferralCode (at registration), applyReferralCode, grantReferralReward (once per referred user's first completed booking), getReferralStats
- Admin endpoints: blockUser, unblockUser, addTechnician, assignServiceArea, approveDocument, suspendTechnician, reactivateTechnician, getAdminReports (daily/monthly revenue, active bookings, technician performance), setTechnicianCommission, createOffer, updateOffer, listOffers
- Notifications: store notification records (userId, type, message, isRead, createdAt) for BookingConfirmation, TechnicianAssigned, ServiceCompleted, PaymentSuccess, Offer types; expose query and markAsRead endpoints

### Customer Frontend (mobile-style, max-width 430px centered)
- Auth screens: phone number entry → OTP verification → auto-redirect on valid session
- Home screen: top location bar, search bar, auto-scrolling banner slider, service categories grid (icons), featured services horizontal scroll, bottom navigation (Home, Bookings, Rewards, Account)
- Service screens: category service list, service detail (image, price, duration, reviews summary, Add to Cart)
- Booking flow: cart summary → address selection (saved + add new) → date & time slot picker → notes entry → confirmation screen (booking ID, service summary, payment method selector: Cash/Online/Wallet)
- Bookings list with status badges and filter tabs; booking detail with status timeline, invoice summary, and review form (stars + text, Completed only)
- Rewards/Wallet screen: balance display, transaction history, referral code card with copy button, referral stats
- Notification bell with unread count badge and dropdown list; polling via React Query

### Technician Frontend (mobile-style, max-width 430px centered)
- OTP login screen
- Dashboard: assigned jobs list with customer name, service, time slot, Accept/Reject actions
- Active job workflow: Mark Reached → Mark Started → Add Extra Items (name + price form, multiple items) → Generate Final Bill preview → Mark Completed
- Earnings screen: Daily / Weekly / Total tabs with commission deduction breakdown
- Notification bell with unread count badge and dropdown

### Admin Frontend (full-width desktop, fixed sidebar)
- Sidebar navigation: Dashboard, Users, Technicians, Bookings, Services & Categories, Offers, Reports
- Dashboard: KPI cards (total bookings today, active bookings, total revenue today, technician count)
- User Management: paginated table (name, phone, role, status, join date), Block/Unblock with confirmation, user detail panel (bookings count, wallet balance)
- Technician Management: table with status and document state; Add Technician modal (name, phone, service area, commission rate); Approve Documents, Assign Service Area, Suspend/Reactivate actions
- Booking Management: full table with status filter tabs, date range picker, assign technician dropdown (active only), status change dropdown (validated transitions)
- Services & Categories: category CRUD; service add/edit modal (name, description, price, duration, image URL, active toggle); commission rate setting
- Offers management: create/edit/list offers
- Reports: Revenue tab (bar chart — last 30 days daily revenue, monthly revenue table) and Performance tab (technician table: completed jobs, avg rating, earnings, commission paid); data via React Query

### Design System (all frontends)
- White/off-white backgrounds, primary #2563EB, accent #7C3AED
- Rounded corners (12–16px), soft box shadows, card-based layouts
- Clean minimal typography with heading hierarchy

**User-visible outcome:** Three fully functional panels — a mobile-style customer app for browsing, booking, and managing home services; a mobile-style technician app for managing jobs and earnings; and a desktop admin panel for managing users, technicians, bookings, services, offers, and reports — all backed by a single Motoko canister with simulated OTP auth, wallet, referrals, and in-app notifications.
