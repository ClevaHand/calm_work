# **Calm Work**

A modern Expo + React Native + TypeScript mobile (and web) app for calm, focused business management — customers, inventory, invoices, and insights.

Designed with a soft coral UI inspired by contemporary login flows. Sign up and sign in work fully offline with local persistence.

---

## Requirements

- **Node.js LTS** (18+ recommended)
- **npm** or yarn
- Optional: Android Studio / Xcode, or the **Expo Go** app on your phone

---

## Install

```bash
cd calm-work
npm install
```

---

## How to run

### 1. Local development (same Wi‑Fi)

```bash
npm start
```

Then:

- Press `a` for Android emulator  
- Press `i` for iOS simulator  
- Press `w` for web (desktop browser)  
- Or scan the QR code with **Expo Go** (Android) / Camera (iOS)

### 2. View on your phone **without** being on the same network (tunnel)

This is the recommended way to open the app from anywhere:

```bash
npm run tunnel
```

or:

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go. The tunnel works over the internet — your phone does **not** need to be on the same Wi‑Fi as your computer.

> First tunnel start may take a minute while Expo sets up the secure link.

### 3. Web / desktop

```bash
npm run web
```

Opens in your browser. The same coral auth screens and tabbed app work on desktop with a responsive layout.

### 4. Platform scripts

```bash
npm run android   # Expo + Android
npm run ios       # Expo + iOS (macOS only)
npm run typecheck # TypeScript check
```

---

## Sign up & log in

1. Open the app → **Welcome** → **Continue** or **Create account**.
2. **Sign up** with name, email, phone (optional), and password (min 6 characters).
3. Your account is stored locally on the device (AsyncStorage). No backend required.
4. **Sign in** with the same email and password anytime.
5. Use the logout icon on the Home tab to sign out.

Demo tip: create any account — there is no external server. Data (customers, inventory, invoices) is saved per user on the device.

---

## App structure

```text
calm-work/
├── app/
│   ├── _layout.tsx          # Root layout, fonts, auth gate
│   ├── (auth)/
│   │   ├── welcome.tsx      # Coral welcome (reference-inspired)
│   │   ├── sign-in.tsx      # Login
│   │   └── sign-up.tsx      # Create account
│   └── (tabs)/
│       ├── index.tsx        # Home dashboard
│       ├── customers.tsx
│       ├── inventory.tsx
│       ├── invoices.tsx
│       └── insights.tsx
├── components/
│   ├── Logo.tsx             # Calm Work mark + wordmark
│   ├── WaveHeader.tsx       # Coral wave headers
│   ├── CalmUI.tsx           # Buttons, cards, fields, badges
│   └── ErrorBoundary.tsx
├── constants/colors.ts      # Coral design system
├── context/
│   ├── AuthContext.tsx      # Sign up / sign in / session
│   └── AppDataContext.tsx   # Customers, inventory, invoices
├── hooks/useColors.ts
├── assets/
├── app.json
├── package.json
└── tsconfig.json
```

---

## Features

- **Beautiful coral auth** — Welcome, Sign in, Sign up matching modern mobile UI patterns  
- **Working local auth** — create accounts, log in, persist session  
- **Customers** — add / remove contacts  
- **Inventory** — stock levels, low-stock badges  
- **Invoices** — create from customers + items, mark paid  
- **Insights** — revenue, outstanding, stock value, simple charts  
- **Works on phone via tunnel** — no same-network requirement  
- **Web / desktop** — same app in the browser  

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| QR won’t open on phone | Use `npm run tunnel` instead of plain `npm start` |
| “Network response timed out” | Tunnel mode, or ensure phone and PC share Wi‑Fi for LAN mode |
| Fonts / splash hang | Wait for first load; `npx expo start -c` to clear cache |
| Type errors | `npm run typecheck` |

---

## License

Private project — use and modify as you like.


---

## Branding (v1.1)

- **Coral primary** (`#FF8A80`) + **teal secondary** for calm accents
- Light / dark / system theme (Profile → Appearance)
- Soft neutral backgrounds (`#F7F6F5`)

## Extra screens

| Screen | Path |
|--------|------|
| Profile & settings | `/(tabs)/profile` |
| Customer detail | `/customer/[id]` |
| Invoice detail | `/invoice/[id]` |

Tap any customer or invoice in the lists to open details.

## Backend-ready architecture

Data and auth go through `services/api.ts`:

1. **Today (default):** `AppConfig.USE_REMOTE_API = false` → AsyncStorage on device  
2. **Later:** set `USE_REMOTE_API = true` in `constants/config.ts` and set:

```bash
# .env
EXPO_PUBLIC_API_URL=https://your-api.example.com/v1
```

Expected remote endpoints (when you build the backend):

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/register` | Sign up → `{ user, accessToken }` |
| POST | `/auth/login` | Sign in → `{ user, accessToken }` |
| POST | `/auth/logout` | Invalidate token |
| PATCH | `/me` | Update profile |
| GET/PUT | `/business/snapshot` | Customers + inventory + invoices |

UI and contexts do not need to change when you switch modes.

