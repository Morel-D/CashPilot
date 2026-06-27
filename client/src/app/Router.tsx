import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Resgister";
import { ProtectedRoute } from "./Protected";
import DashboardPage from "../pages/Dashbaord";
import AppLayout from "../pages/AppLayout";
import CustomersPage from "../pages/Customers";

export const router = createBrowserRouter([
    // Public -------------------------------
    { path: '/login',    element: <LoginPage />    },
    { path: '/register', element: <RegisterPage /> },

    // Protected -----------------------------
    {
        path: '/',
        element: (
            <ProtectedRoute>
            <AppLayout />
            </ProtectedRoute>
        ),

                children: [
            { index: true,          element: <DashboardPage /> },
            { path: 'customers',    element: <CustomersPage /> },
        ]
    },

    // Fallback ------------------------------
    { path: '*', element: <Navigate to="/" replace /> },
])