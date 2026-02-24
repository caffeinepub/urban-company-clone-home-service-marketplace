# Specification

## Summary
**Goal:** Fix the Admin panel so that authenticated admin users can reliably access it via the `/admin` route, and add a visible entry point to the admin panel from the main app.

**Planned changes:**
- Fix `App.tsx` to correctly detect the `admin` mode from the URL and render the `AdminPanel` component without redirecting away.
- Fix the admin role guard in `AdminPanel.tsx` so it does not incorrectly block authenticated admin users.
- Show a login prompt (Internet Identity) on the admin route when the user is not yet authenticated, instead of a blank or broken screen.
- Add a visible "Admin Panel" link or button on the main landing page or customer app header that navigates to the `/admin` route.
- Ensure the backend's role-based access control correctly identifies admin callers and does not reject valid admin principals.
- Add an admin bootstrap mechanism so that if no admin exists, the first caller or a hardcoded principal can be granted the admin role.

**User-visible outcome:** Admin users can navigate to `/admin` (or click a visible link) and access the admin dashboard after logging in with Internet Identity, without being incorrectly blocked or redirected.
