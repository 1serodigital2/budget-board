import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/firebase";

// components
import RootLayout from "./layouts/RootLayout";

// context
import { AuthProvider, useAuth } from "./context/AuthContext";

// pages
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AddExpensePage from "./pages/expenses/AddExpensePage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import ExpensePage from "./pages/expenses/ExpensePage";
import EditExpensePage from "./pages/expenses/EditExpensePage";
import CategoriesPage from "./pages/categories/Categories";
import AddCategoryPage from "./pages/categories/AddCategoryPage";
import CategoryPage from "./pages/categories/CategoryPage";
import EditCategoryPage from "./pages/categories/EditCategoryPage";
import Signup from "./pages/SignUpPage";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "expenses",
            element: <ExpensesPage />,
          },
          {
            path: "expenses/add",
            element: <AddExpensePage />,
          },
          {
            path: "expenses/:id",
            element: <ExpensePage />,
          },
          {
            path: "expenses/:id/edit",
            element: <EditExpensePage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "categories/add",
            element: <AddCategoryPage />,
          },
          {
            path: "categories/:id",
            element: <CategoryPage />,
          },
          {
            path: "categories/:id/edit",
            element: <EditCategoryPage />,
          },
        ],
      },
    ],
  },
]);

function AppRoute() {
  const { loading } = useAuth();
  if (loading) {
    return <p>Please wait ....</p>;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoute />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
