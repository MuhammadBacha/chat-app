import React from "react";
import { useAuthContext } from "./userContext";
import { Navigate } from "react-router-dom";

function VerifyFirst({ children }) {
  const {
    userData: { isAuthenticated, token },
  } = useAuthContext();

  if (token && isAuthenticated) {
    // Now, presence of token does not necessarily mean it's always right, someone can tamper with the localStorage too, so for that we have to verify the token fro the server
    // Will solve it if someone points this issue out
    return <Navigate to="/" replace />;
  }
  return children;
}

export default VerifyFirst;
