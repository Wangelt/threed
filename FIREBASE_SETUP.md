# Firebase Phone Authentication Setup Guide

## Overview
This guide will help you set up Firebase phone number authentication throughout the Threedweb project.

## ✅ Files Already Created

1. **`lib/firebase-client.ts`** - Firebase client initialization
2. **`lib/firebase-admin.ts`** - Firebase admin SDK setup
3. **`lib/phone-otp-state.ts`** - Global state for OTP flow (✅ FIXED)
4. **`lib/firebase-phone-auth.ts`** - Phone auth utilities (✅ NEW)
5. **`app/auth/page.tsx`** - Login page with phone input (✅ FIXED)
6. **`app/otp/page.tsx`** - OTP verification page (✅ FIXED)
7. **`app/api/auth/session/route.ts`** - Session creation API (✅ NEW)
8. **`.env.local.example`** - Environment variables template (✅ NEW)

---

## 🔧 NEXT STEPS

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: **Threedus**
4. Accept the terms and create

### Step 2: Enable Phone Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Phone** and enable it
3. No additional setup needed - Firebase handles SMS delivery

### Step 3: Get Firebase Credentials

#### Public Credentials (Browser)
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click on your web app (or create one)
4. Copy these values:
   ```
   API Key → NEXT_PUBLIC_FIREBASE_API_KEY
   Auth Domain → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   Project ID → NEXT_PUBLIC_FIREBASE_PROJECT_ID
   App ID → NEXT_PUBLIC_FIREBASE_APP_ID
   Messaging Sender ID → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   ```

#### Private Credentials (Server-side)
1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file will download - it contains:
   ```
   projectId → FIREBASE_PROJECT_ID
   client_email → FIREBASE_CLIENT_EMAIL
   private_key → FIREBASE_PRIVATE_KEY
   ```

### Step 4: Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in all values:
   ```env
   # Public (browser)
   NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx

   # Private (server-only, with escaped newlines)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----"

   # App Config
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 5: Set Up reCAPTCHA (Required for Phone Auth)
1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll to "Authorized domains"
3. Add your domain (for local: `localhost`)
4. Go to **Project Settings** > **reCAPTCHA keys**
5. Create a new reCAPTCHA key (if not auto-created)

### Step 6: Test the Authentication Flow

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test phone auth:**
   - Navigate to `http://localhost:3000/auth`
   - Enter a phone number (10 digits in India)
   - Firebase will show a code in console (for testing)
   - Enter the code on the OTP page

---

## 📁 Authentication Flow Architecture

### User Flow
```
/auth (phone input)
    ↓
[Phone validation] → formatPhoneNumber() → requestPhoneOtp()
    ↓
Firebase sends OTP (via SMS in production, console in testing)
    ↓
/otp (6-digit input)
    ↓
[User enters OTP] → verifyPhoneOtp() → getIdToken()
    ↓
POST /api/auth/session → Create session
    ↓
Redirect to home (/)
```

### File Structure
```
lib/
├── firebase-client.ts          # Firebase SDK init (browser)
├── firebase-admin.ts           # Firebase admin SDK (server)
├── firebase-phone-auth.ts      # Phone auth utilities
└── phone-otp-state.ts          # Global OTP state

app/
├── auth/
│   └── page.tsx               # Phone number entry
├── otp/
│   └── page.tsx               # OTP verification
└── api/auth/
    └── session/
        └── route.ts           # Session creation endpoint
```

---

## 🚀 Key Functions

### Request OTP
```typescript
import { requestPhoneOtp } from "@/lib/firebase-phone-auth";

const confirmation = await requestPhoneOtp("+919876543210");
```

### Verify OTP
```typescript
import { verifyPhoneOtp } from "@/lib/firebase-phone-auth";

const { idToken, uid, phoneNumber } = await verifyPhoneOtp("123456", confirmation);
```

### Format Phone Number
```typescript
import { formatPhoneNumber } from "@/lib/firebase-phone-auth";

const formatted = formatPhoneNumber("9876543210", "91"); // +919876543210
```

---

## 🔐 Security Checklist

- [ ] Environment variables are in `.env.local` (NOT in git)
- [ ] Firebase private key is properly escaped in `.env.local`
- [ ] reCAPTCHA is enabled for phone auth
- [ ] Authorized domains are configured in Firebase
- [ ] Session cookies are httpOnly and secure
- [ ] OTP confirmation state is cleared after verification
- [ ] Error messages don't leak sensitive information

---

## 📱 Testing Credentials

For development/testing in Firebase Console:
1. Go to **Authentication** > **Sign-in method** > **Phone**
2. Add test phone numbers
3. Specify a verification code (e.g., `123456`)
4. Use these credentials to test without SMS costs

**Example test credential:**
- Phone: `+91 9876543210`
- Code: `123456`

---

## 🐛 Troubleshooting

### "Invalid phone number" error
- Ensure phone number includes country code (e.g., +91)
- Format: `+{countryCode}{digits}`

### "reCAPTCHA error"
- Check if domain is authorized in Firebase Console
- For localhost, add "localhost" to authorized domains
- Clear browser cache and cookies

### "Too many requests" error
- Firebase limits OTP requests per phone number
- Wait a few minutes before retrying

### Session not persisting
- Check if `firebaseSession` cookie is being set
- Verify `/api/auth/session` is returning 200
- Check browser cookie settings

---

## 📚 Additional Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Firebase Console](https://console.firebase.google.com)

---

## ✨ Next Features to Implement

1. **Session verification middleware** - Check user auth status on protected routes
2. **User profile creation** - Store phone number in Firestore after first login
3. **Logout functionality** - Clear session cookie and Firebase auth
4. **Token refresh** - Handle expired ID tokens
5. **Analytics** - Track auth success/failure rates
6. **Rate limiting** - Prevent OTP bombing
7. **Resend OTP** - Allow users to request new OTP
8. **Phone number update** - Allow users to change their phone

---

Last updated: 2026-08-19
