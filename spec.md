# Specification

## Summary
**Goal:** Remove the authentication/role guard from the Admin panel so that `/admin` is directly accessible without any login or privilege check.

**Planned changes:**
- Remove the administrator role check and authentication guard from `frontend/src/pages/AdminPanel.tsx`
- Remove the "Access Denied" screen (shield icon, error message, and "Back to home" button) from the AdminPanel component
- Render the AdminPanel content directly when navigating to `/admin`, regardless of user role or login state

**User-visible outcome:** Any user who navigates to `/admin` will see the full admin panel immediately, with all sections (Dashboard, Users, Technicians, Bookings, Services, Reports) accessible without any authentication prompt or "Access Denied" screen.
