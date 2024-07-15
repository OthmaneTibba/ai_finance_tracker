import { useMsal } from "@azure/msal-react";
import { Navigate, Outlet } from "react-router-dom";

export default function UnProtectedRoutes() {
  const { instance } = useMsal();
  return instance.getAllAccounts().length == 0 ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
}
