# English Therapy Platform — Web App (Frontend)

This is the **frontend** for the English Therapy Platform.
It’s the **user interface** — the part students, teachers, and admins interact with in their browsers.

It connects directly to the backend API to:

* Allow users to log in, register, and verify their accounts
* Start and continue exam sessions
* Show scores and progress
* Let admins manage questions, certificates, and users

---

## 🎯 Project Goals

This project is designed for:

1. **Ease of contribution** — clear folder structure, reusable components, and minimal setup steps
2. **Modern developer experience** — built with the latest React + Vite setup
3. **Scalable design** — easy to add new pages or features without breaking existing ones

---

## 🛠 Tech Stack

* **React + TypeScript** — UI framework with type safety
* **Vite** — lightning-fast development server & build tool
* **TailwindCSS / Shadcn UI** — fast styling with pre-built, accessible UI components
* **Axios** — HTTP client for API requests (with auto-refresh token handling)
* **Framer Motion** — animations for smooth user experience
* **Sonner** — toast notifications for user feedback

---

## 📂 Folder Structure

```
src/
├── assets/         # Images, CSS, animations
├── components/     # Reusable UI and shared layout pieces
│   ├── shared/     # App-wide components like Navbar, Sidebar, Editor
│   └── ui/         # Shadcn UI components (button, card, dialog, etc.)
├── hooks/          # Custom React hooks for API calls and UI logic
├── lib/            # Utility functions and API client setup
├── providers/      # Context providers (e.g., AuthProvider)
├── routes/         # Page-level components and routing logic
├── services/       # API service functions (auth, tests, user)
└── main.tsx        # App entry point
```

---

## 🔍 How API Calls Work (`httpClient`)

We use a **centralized request handler** so all API calls behave the same way:

* **Base URL** is automatically set from `.env` (`VITE_SERVER_URL`)
* **Credentials** (cookies/tokens) are sent with every request
* **Loading states** are shown automatically via toast notifications
* **Errors** are caught and shown to the user — no silent failures
* **Access token refresh** is handled automatically:

  * If your token expires, the system tries to get a new one
  * If refresh fails, the user is logged out with a “Session expired” message

Example usage:

```ts
import { httpClient } from "@/lib/axios"

async function loadProfile() {
  const res = await httpClient({ method: "GET", url: "/authentication/my-profile" })
  if (res?.success) {
    console.log(res.data)
  }
}
```

This means contributors **don’t have to write repetitive try/catch logic** in every API call.

---

## 🚀 Getting Started

**1. Clone the repo**

```bash
git clone <repo-url>
cd web-app
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `.env`**

```
VITE_SERVER_URL=http://localhost:5000
```

**4. Start the development server**

```bash
npm run dev
```

---

## 📌 How to Contribute

You can help by:

* Building exam-taking UI pages
* Improving admin dashboard functionality
* Designing better animations and transitions
* Writing tests for components and hooks
* Improving responsive layouts for mobile

When contributing:

1. Follow the existing folder structure
2. Use existing UI components from `src/components/ui`
3. Use `httpClient` for API calls
4. Run `npm run lint` before submitting PRs
