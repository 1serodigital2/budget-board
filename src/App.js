import { jsx as _jsx } from "react/jsx-runtime";
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
        element: _jsx(PublicRoutes, {}),
        children: [
            {
                path: "/login",
                element: _jsx(LoginPage, {}),
            },
            {
                path: "/signup",
                element: _jsx(Signup, {}),
            },
        ],
    },
    {
        element: _jsx(ProtectedRoutes, {}),
        children: [
            {
                path: "/",
                element: _jsx(RootLayout, {}),
                children: [
                    {
                        index: true,
                        element: _jsx(DashboardPage, {}),
                    },
                    {
                        path: "expenses",
                        element: _jsx(ExpensesPage, {}),
                    },
                    {
                        path: "expenses/add",
                        element: _jsx(AddExpensePage, {}),
                    },
                    {
                        path: "expenses/:id",
                        element: _jsx(ExpensePage, {}),
                    },
                    {
                        path: "expenses/:id/edit",
                        element: _jsx(EditExpensePage, {}),
                    },
                    {
                        path: "categories",
                        element: _jsx(CategoriesPage, {}),
                    },
                    {
                        path: "categories/add",
                        element: _jsx(AddCategoryPage, {}),
                    },
                    {
                        path: "categories/:id",
                        element: _jsx(CategoryPage, {}),
                    },
                    {
                        path: "categories/:id/edit",
                        element: _jsx(EditCategoryPage, {}),
                    },
                ],
            },
        ],
    },
]);
function AppRoute() {
    const { loading } = useAuth();
    if (loading) {
        return _jsx("p", { children: "Please wait ...." });
    }
    return _jsx(RouterProvider, { router: router });
}
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(AppRoute, {}) }) }));
}
export default App;
