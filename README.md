# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

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
