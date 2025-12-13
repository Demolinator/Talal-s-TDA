# T099: Session Expiration Handling with localStorage Preservation

## Overview

This document describes the implementation of session expiration handling that preserves unsaved form data across authentication boundaries.

## Implementation Summary

### Files Modified

1. **`/lib/form-storage.ts`** (NEW)
   - Utility functions for saving and restoring form state to/from localStorage
   - Type-safe API with generics
   - Automatic expiration handling (default: 30 minutes)
   - Safe SSR handling

2. **`/lib/api.ts`** (MODIFIED)
   - Added `captureFormData()` function to scan and save form data before redirect
   - Updated 401 handler to call `captureFormData()` before redirecting
   - Changed query parameter from `expired=true` to `session_expired=true`

3. **`/app/(auth)/login/page.tsx`** (MODIFIED)
   - Updated to check for `session_expired=true` query parameter
   - Shows "Session expired. Please log in again." message

4. **`/components/tasks/TaskForm.tsx`** (MODIFIED)
   - Added form restoration logic on component mount
   - Shows "Your unsaved work has been restored." message when data is restored
   - Added `data-form-key="title"` attribute for form identification

## Feature Details

### 1. Form State Storage (`lib/form-storage.ts`)

**Public API:**

```typescript
// Save form state (called automatically on 401)
saveFormState<T>(formKey: string, data: T, expiryMinutes?: number): void

// Restore form state (called in components after login)
restoreFormState<T>(formKey: string): T | null

// Clear specific form state
clearFormState(formKey: string): void

// Clear all form states (useful for logout)
clearAllFormStates(): void

// Get all saved form keys (for debugging)
getAllFormKeys(): string[]
```

**Storage Format:**
- Key: `tda_form_<formKey>` (e.g., `tda_form_title`)
- Expiry Key: `tda_form_<formKey>_expiry`
- Data: JSON-encoded form data object

**Safety Features:**
- SSR-safe: Returns early if `window` is undefined
- Handles localStorage unavailability (incognito mode, storage full)
- Never saves password fields
- Automatic expiration cleanup
- Console logging for debugging

### 2. Automatic Form Capture (`lib/api.ts`)

**How it works:**

1. On 401 response, `captureFormData()` is called
2. Scans all `<form>` elements on the page
3. Collects values from all `<input>`, `<textarea>`, and `<select>` elements
4. Skips:
   - Empty values
   - Password fields (security)
   - Submit/button inputs
5. Determines form key from:
   - `data-form-key` attribute (preferred)
   - `form.id`
   - First input field name
   - Fallback: `"default"`
6. Saves to localStorage with 30-minute expiry

**Example form markup:**

```tsx
<form data-form-key="task-form">
  <input name="title" value="Buy groceries" />
  <textarea name="description" value="From Whole Foods" />
</form>
```

### 3. Session Expiration Flow

**Step-by-step:**

1. **User is working on a form** (e.g., creating a task)
   - Title: "Buy groceries"
   - Description: "From Whole Foods"

2. **Session expires** (JWT token invalid/expired)
   - User clicks "Save Task"
   - API returns 401 Unauthorized

3. **API client intercepts 401**
   - Calls `captureFormData()` to save form state
   - Redirects to `/login?session_expired=true`

4. **Login page shows message**
   - Yellow warning: "Session expired. Please log in again."
   - User enters credentials and logs in

5. **After login, user returns to task page**
   - TaskForm component mounts
   - `useEffect` calls `restoreFormState("title")`
   - Form is pre-filled with saved data
   - Green success message: "Your unsaved work has been restored."

6. **User submits form**
   - Saved data is automatically cleared after restoration

### 4. Form Restoration (`components/tasks/TaskForm.tsx`)

**Implementation:**

```tsx
useEffect(() => {
  if (!task) {
    // Only restore for new tasks (not edit mode)
    const savedData = restoreFormState<TaskFormData>("title");
    if (savedData) {
      reset({
        title: savedData.title || "",
        description: savedData.description || "",
      });
      setRestoredMessage(true);

      // Hide message after 5 seconds
      const timer = setTimeout(() => setRestoredMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }
}, [task, reset]);
```

**Key Points:**
- Only restores in create mode (`!task`)
- Uses React Hook Form's `reset()` method
- Shows temporary success message
- Automatically clears saved data after restoration

## Testing

### Manual Test Scenario

**Prerequisites:**
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Valid user account

**Steps:**

1. **Setup - Create expired session:**
   ```bash
   # In browser DevTools Console:
   # Delete auth cookies to simulate expiration
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
   });
   ```

2. **Create task with unsaved data:**
   - Navigate to `/dashboard/tasks`
   - Click "Create Task" or fill in task form
   - Enter:
     - Title: "Test Task for Session Expiration"
     - Description: "This should be preserved after re-login"
   - **DO NOT SUBMIT YET**

3. **Trigger session expiration:**
   - Click "Save Task" button
   - Observe 401 error in Network tab
   - Should redirect to `/login?session_expired=true`

4. **Verify preservation:**
   - Check localStorage in DevTools:
     ```
     Key: tda_form_title
     Value: {"title":"Test Task for Session Expiration","description":"This should be preserved after re-login"}
     ```

5. **Re-login:**
   - Enter valid credentials
   - Submit login form
   - Should redirect to `/dashboard`

6. **Verify restoration:**
   - Navigate to task creation form
   - Form should be pre-filled with saved data
   - Green message should appear: "Your unsaved work has been restored."
   - localStorage should be cleared (check DevTools)

7. **Submit task:**
   - Click "Save Task"
   - Task should be created successfully

### Edge Cases to Test

1. **Multiple forms on page:**
   - Each form should be saved separately if they have unique `data-form-key` attributes

2. **Form with password field:**
   - Password fields should NOT be saved to localStorage

3. **Storage disabled (incognito mode):**
   - Should fail gracefully with console warnings
   - Should not break the redirect flow

4. **Expired data (> 30 minutes):**
   - Should be automatically cleared
   - Should not restore expired data

5. **Edit mode vs Create mode:**
   - Should only restore in create mode
   - Should not interfere with edit form initialization

## Security Considerations

### What is saved:
- Form input values (text, textarea, select)
- Only non-password fields
- Stored in localStorage (client-side only)

### What is NOT saved:
- Password fields
- Auth tokens (always in HttpOnly cookies)
- Sensitive user data

### Expiration:
- Saved data expires after 30 minutes
- Automatically cleared after restoration
- Can be manually cleared on logout

### Risks:
- **Shared computer risk:** If user doesn't logout, data persists in localStorage
  - Mitigation: 30-minute expiry, cleared after use
- **XSS vulnerability:** If site has XSS, attacker could read localStorage
  - Mitigation: Don't save sensitive data, follow XSS prevention best practices

## Future Improvements

1. **Encrypted storage:**
   - Encrypt form data before saving to localStorage
   - Decrypt on restoration

2. **Multiple form support:**
   - Better form key detection (use URL path + form type)
   - Support for nested forms

3. **User notification:**
   - Show which forms have saved data on login page
   - Allow user to preview/discard saved data

4. **Analytics:**
   - Track session expiration frequency
   - Monitor form restoration success rate

5. **Backend integration:**
   - Auto-save drafts to backend periodically
   - Sync localStorage with server-side drafts

## Acceptance Criteria

- [x] 401 responses trigger form data capture
- [x] Form data is saved to localStorage before redirect
- [x] Redirect URL uses `session_expired=true` query parameter
- [x] Login page shows "Session expired. Please log in again." message
- [x] TaskForm restores saved data after re-login
- [x] Restoration shows "Your unsaved work has been restored." message
- [x] Password fields are never saved
- [x] Saved data expires after 30 minutes
- [x] Saved data is cleared after restoration
- [x] Works in both create and edit modes (only restores in create)
- [x] Safe for SSR (no errors on server-side rendering)
- [x] TypeScript types are properly defined

## Related Files

- `/lib/form-storage.ts` - Form storage utility
- `/lib/api.ts` - API client with 401 handling
- `/app/(auth)/login/page.tsx` - Login page with expiration message
- `/components/tasks/TaskForm.tsx` - Task form with restoration logic

## References

- Spec: `/specs/004-phase-2-web-app/spec.md`
- Constitution: `/.specify/memory/constitution.md` (Principle X: Security First)
- Related Tasks: T084 (Login), T085 (Signup), T095 (Form Validation)
