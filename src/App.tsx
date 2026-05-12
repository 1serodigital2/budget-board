import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import RootLayout from "./layouts/RootLayout";

// context
import { AuthProvider, useAuth } from "./context/AuthContext";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

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
          ],
        },
        {
          path: "/logout",
          action: () => logOut(),
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
