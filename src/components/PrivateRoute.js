import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ element, allowedRoles }) => {
  //const isAuth = !!localStorage.getItem("authToken");
  //return isAuth ? element : <Navigate to="/login" />;

  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" />;
  } else {

    const decodedToken = jwtDecode(token);
    const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    const userRoles = Array.isArray(roles) ? roles : [roles];

    console.log("1.decodedToken:", decodedToken);
    console.log("2.roles:", roles);
    console.log("3.userRoles:", userRoles);
    console.log("4.allowedRoles:", allowedRoles);

    if (userRoles.some(role => allowedRoles.includes(role))) {
      return element;
    } else {
      return <Navigate to="/not-authorized" />;
    }
  }






};

export default PrivateRoute;
