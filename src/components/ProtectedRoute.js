import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useDocumentContext } from "../contexts/DocumentContext";

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { roles } = useDocumentContext();

  return (
    <Route
      {...rest}
      element={
        roles.some(role => allowedRoles.includes(role)) ? (
          <Component />
        ) : (
          <Navigate to="/not-authorized" />
        )
      }
    />
  );
};

export default ProtectedRoute;