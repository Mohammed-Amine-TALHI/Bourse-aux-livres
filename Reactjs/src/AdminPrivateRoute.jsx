import React from "react";
import { Navigate, Route } from "react-router-dom";
import AuthUser from "./pages/forms/AuthUser";
import MasterLayout from "./pages/admin/MasterLayout";
import { Outlet, useLocation } from 'react-router-dom';

function AdminPrivateRoute() {
  const location = useLocation();
  const {role} = AuthUser() 
  return role === "admin"
    ? <Outlet /> // <-- nested routes rendered here
    : <Navigate to="/login" replace state={{ from: location }} />;
}

export default AdminPrivateRoute;