import { useMsal } from "@azure/msal-react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { instance } = useMsal();
  return instance.getAllAccounts().length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} />
  );
}
