import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/expenses";

// components
import RootLayout from "./layouts/RootLayout";

// context
import { AuthProvider, useAuth } from "./context/AuthContext";

// pages
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AddExpensePage from "./pages/AddExpensePage";
import ExpensesPage from "./pages/ExpensesPage";
import ExpensePage from "./pages/ExpensePage";
import EditExpensePage, {
  loader as ExpenseLoader,
} from "./pages/EditExpensePage";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
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
            path: "/expenses",
            element: <ExpensesPage />,
          },
          {
            path: "/expenses/add",
            element: <AddExpensePage />,
          },
          {
            path: "/expenses/:id",
            element: <ExpensePage />,
            // loader: ExpenseLoader
          },
          {
            path: "/expenses/:id/edit",
            element: <EditExpensePage />,
            loader: ExpenseLoader,
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
