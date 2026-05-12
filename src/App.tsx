import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

function App() {
  const { logOut } = useAuth();
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
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}

export default App;
