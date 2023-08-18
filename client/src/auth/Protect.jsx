import React from "react";
import { useAuthContext } from "./userContext";
import { Navigate } from "react-router-dom";

function Protect({ children }) {
  const {
    userData: { isAuthenticated, token },
  } = useAuthContext();
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  return children;
}

export default Protect;
