# Payment Retry Flow - Dynamic Event Redirect

## ✅ Implementation Complete

Successfully implemented a dynamic payment retry flow that redirects users to the specific event's registration page based on stored event details.

**Important:** Form is **empty on initial visit** and only pre-fills data when it's a **retry after payment failure**.

## 🔄 **How It Works**

### Initial Visit (Normal Registration):
1. User visits event registration page
2. Form is **completely empty**
3. User fills out their details
4. Data is saved to localStorage when payment is initiated
5. User proceeds to payment

### When Payment Fails:
1. User attempts payment for an event
2. Payment fails for any reason (network error, insufficient funds, etc.)
3. User is redirected to `/payment-failure` page
4. Form data is **stored in localStorage**

### When User Clicks "Try Payment Again":
1. **System retrieves eventId** from multiple sources (in priority order):
   - Navigation state data (from payment gateway redirect)
   - `lastPaymentContext` in localStorage (most recent payment)
   - `paymentRetryContext` in localStorage (previous retry metadata)
   - Fallback to default eventId: `69382673cb27d7173ac1dfc5`

2. **Dynamic URL is constructed**:
   ```
   https://founders-sangam.vercel.app/event/{eventId}/register
   ```

3. **System stores retry context** in localStorage

4. **Browser redirects** to the specific event's registration page

### On Registration Page Load:
1. **Checks localStorage** for retry context
2. **Loads saved form data** for that specific eventId
3. **Enables retry mode**:
   - All form fields are **disabled** (locked)
   - Pre-filled with previous data
   - Retry banner displayed
   - Button changes to "Retry Payment"

4. **User clicks "Retry Payment"** → Payment processed

## 📦 **LocalStorage Structure**

### `lastPaymentContext`
Stores the most recent payment attempt with full context:
```json
{
  "eventId": "69382673cb27d7173ac1dfc5",
  "formData": {
    "name": "John Doe",
    "companyName": "Acme Inc",
    "email": "john@example.com",
    "contact": "9876543210",
    "ticketType": "Premium",
    "quantity": 2,
    "amount": 1000
  },
  "timestamp": "2025-12-11T16:30:00.000Z"
}
```

### `paymentRetryContext`
Stores retry metadata and failure information:
```json
{
  "isRetry": true,
  "timestamp": "2025-12-11T16:34:58.000Z",
  "failedAttempts": 1,
  "lastFailureReason": "Insufficient balance",
  "lastErrorCode": "INSUFFICIENT_FUNDS",
  "ticketId": "ticket_123xyz",
  "eventId": "69382673cb27d7173ac1dfc5"
}
```

### `formData_{eventId}`
Stores user's registration details for the specific event:
```json
{
  "name": "John Doe",
  "companyName": "Acme Inc",
  "email": "john@example.com",
  "contact": "9876543210",
  "ticketType": "Premium",
  "quantity": 2
}
```

## 📝 **Files Modified**

### 1. `PaymentFailure.jsx`
**Changes:**
- Dynamic eventId extraction from multiple localStorage sources
- Constructs event-specific registration URL
- Uses `window.location.href` for external redirect
- Added console logging for debugging

**Key Logic:**
```javascript
const registrationUrl = `https://founders-sangam.vercel.app/event/${targetEventId}/register`;
window.location.href = registrationUrl;
```

### 2. `EventRegistration.jsx`
**Changes:**
- Checks `paymentRetryContext` in localStorage on page load
- Loads saved form data regardless of navigation state
- Saves `lastPaymentContext` before payment initiation
- Passes `isRetry` prop to TicketForm

**Key Logic:**
```javascript
const paymentContext = {
  eventId: id,
  formData: formData,
  timestamp: new Date().toISOString(),
};
localStorage.setItem("lastPaymentContext", JSON.stringify(paymentContext));
```

### 3. `TicketForm.jsx`
**Already Configured:**
- Accepts `isRetry` prop
- Disables all form fields when `isRetry` is true
- Shows amber retry banner
- Syncs form data with `savedData` prop
- Button text changes to "Retry Payment"

## 🎯 **Key Benefits**

✅ **Universal Solution** - Works for ALL events, not just one hardcoded event  
✅ **Smart Fallback** - Multiple localStorage sources ensure eventId is never lost  
✅ **Data Persistence** - Customer details always preserved across retries  
✅ **External Redirect** - Uses full URL for production environment  
✅ **Visual Feedback** - Clear retry mode indicators  
✅ **Debugging Enabled** - Console logs for troubleshooting  
✅ **No Data Loss** - Works even after page refreshes  
✅ **Clean Initial State** - Form is empty on first visit, only pre-fills on retry  
✅ **Smart Context Cleanup** - Removes stale retry data for different events

## 🧪 **Testing Flow**

### Test Case 1: Initial Visit (Empty Form)
1. Visit any event registration page for the first time
2. **Verify form is completely empty**
3. No retry banner visible
4. Button shows "Proceed to Pay"
5. All fields are enabled and editable

### Test Case 2: Payment Retry (Pre-filled Form)
1. Fill out registration form for any event
2. Proceed to payment
3. Simulate payment failure (disconnect network, insufficient funds, etc.)
4. Click "Try Payment Again" on failure page
5. **Verify redirect to correct event registration URL**
6. **Confirm form is pre-filled with previous data**
7. **All fields are disabled (locked)**
8. **Retry banner is visible**
9. **Button shows "Retry Payment"**
10. Click to retry payment

## 🔍 **Debug Information**

Check browser console for:
```
Redirecting to event registration: https://founders-sangam.vercel.app/event/{eventId}/register
```

Check localStorage (DevTools → Application → Local Storage):
- `lastPaymentContext`
- `paymentRetryContext`
- `formData_{eventId}`
