# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Dashboard to dos
Category Budget vs Actual
Top Spending Categories (Pie Chart)
Recent Transactions Widget
Budget Health Indicator
Monthly Savings Trend
Largest Expenses
Forecasting
Alerts
Export Reports
Calendar View

# Project architecture
src/
├── components/
├── context/
│ └── AuthContext.tsx
│
├── features/
│ ├── auth/
│ ├── budgets/
│ └── transactions/
│
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/ś
│ └── ProtectedRoute.tsx
│
├── services/
│ ├── firebase.ts
│ ├── auth.ts
│ └── firestore.ts
│
├── types/
├── utils/
├── App.tsx
└── main.tsx

# Firestore Database Structure
users/
│
└── {uid}/
    │
    ├── profile/
    │   ├── name: string
    │   ├── email: string
    │   ├── photoURL: string
    │   └── createdAt: timestamp
    │
    ├── expenses/
    │   │
    │   └── {expenseId}/
    │       ├── title: string
    │       ├── amount: number
    │       ├── categoryId: string
    │       ├── note: string
    │       ├── budgetId: string
    │       ├── paymentMethod: string
    │       ├── createdAt: timestamp
    │       └── updatedAt: timestamp
    │
    ├── categories/
    │   │
    │   └── {categoryId}/
    │       ├── name: string
    │       ├── color: string
    │       ├── icon: string
    │       ├── createdAt: timestamp
    │       └── updatedAt: timestamp
    │
    ├── budgets/
    │   │
    │   └── {budgetId}/
    │       ├── categoryId: string
    │       ├── limit: number
    │       ├── spent: number
    │       ├── month: string
    │       ├── year: number
    │       ├── createdAt: timestamp
    │       └── updatedAt: timestamp
    │
    └── settings/
        ├── currency: "INR"
        ├── theme: "light"
        └── notifications: true
