import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./services/supabase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { FullScreenLoader } from "./components/ui/Spinner";

import RootLayout from "./layouts/RootLayout";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import AddExpensePage from "./pages/expenses/AddExpensePage";
import ExpensePage from "./pages/expenses/ExpensePage";
import EditExpensePage from "./pages/expenses/EditExpensePage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import AddCategoryPage from "./pages/categories/AddCategoryPage";
import CategoryPage from "./pages/categories/CategoryPage";
import EditCategoryPage from "./pages/categories/EditCategoryPage";
import BudgetsPage from "./pages/budgets/BudgetsPage";
import AddBudgetPage from "./pages/budgets/AddBudgetPage";
import EditBudgetPage from "./pages/budgets/EditBudgetPage";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          { path: "expenses", element: <ExpensesPage /> },
          { path: "expenses/new", element: <AddExpensePage /> },
          { path: "expenses/:id", element: <ExpensePage /> },
          { path: "expenses/:id/edit", element: <EditExpensePage /> },

          { path: "categories", element: <CategoriesPage /> },
          { path: "categories/new", element: <AddCategoryPage /> },
          { path: "categories/:id", element: <CategoryPage /> },
          { path: "categories/:id/edit", element: <EditCategoryPage /> },

          { path: "budgets", element: <BudgetsPage /> },
          { path: "budgets/new", element: <AddBudgetPage /> },
          { path: "budgets/:id/edit", element: <EditBudgetPage /> },

          // Old URLs
          { path: "expenses/add", element: <Navigate to="/expenses/new" replace /> },
          { path: "categories/add", element: <Navigate to="/categories/new" replace /> },
          { path: "budget", element: <Navigate to="/budgets" replace /> },
          { path: "budget/overview", element: <Navigate to="/budgets" replace /> },
          { path: "budget/add", element: <Navigate to="/budgets/new" replace /> },

          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  const { initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  return <RouterProvider router={router} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
