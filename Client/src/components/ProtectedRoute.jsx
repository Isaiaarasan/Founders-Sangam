import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("adminToken");

    // Check if token exists and is not "undefined" or "null" string
    const isAuthenticated = token && token !== "undefined" && token !== "null";

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
