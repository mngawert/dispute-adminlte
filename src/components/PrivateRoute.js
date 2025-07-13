import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        // Special case: if allowedRoles contains "*", allow any authenticated user
        if (allowedRoles.includes("*")) {
            return element;
        }

        const decodedToken = jwtDecode(token);
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
        const userRoles = Array.isArray(roles) ? roles : [roles];

        if (userRoles.some(role => allowedRoles.includes(role))) {
            return element;
        } else {
            return <Navigate to="/not-authorized" />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
