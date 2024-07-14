import { Navigate, Outlet } from "react-router-dom";
import { msalInstance } from "../authConfig";

export default function ProtectedRoute() {
  return msalInstance.getAllAccounts().length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} />
  );
}
