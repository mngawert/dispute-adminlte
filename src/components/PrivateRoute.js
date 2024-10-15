import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isAuth = !!localStorage.getItem("authToken");
  return isAuth ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
