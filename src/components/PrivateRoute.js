import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRoles, getDecodedToken } from "../utils/utils";

const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Save the current URL to redirect back after login
        localStorage.setItem('redirectUrl', window.location.pathname);
        return <Navigate to="/login" />;
    }

    try {
        // Validate token by trying to decode it
        const decodedToken = getDecodedToken();
        
        if (!decodedToken) {
            console.error("PrivateRoute: Failed to decode token");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userLogin");
            localStorage.setItem('redirectUrl', window.location.pathname);
            return <Navigate to="/login" />;
        }

        // Check token expiration
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.error("PrivateRoute: Token expired");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userLogin");
            localStorage.setItem('redirectUrl', window.location.pathname);
            return <Navigate to="/login" />;
        }

        // Special case: if allowedRoles contains "*", allow any authenticated user
        if (allowedRoles.includes("*")) {
            return element;
        }

        const userRoles = getUserRoles();

        if (userRoles.some(role => allowedRoles.includes(role))) {
            return element;
        } else {
            console.log("PrivateRoute: User does not have required roles");
            return <Navigate to="/not-authorized" />;
        }
    } catch (error) {
        console.error("PrivateRoute: Error validating token:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userLogin");
        localStorage.setItem('redirectUrl', window.location.pathname);
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
