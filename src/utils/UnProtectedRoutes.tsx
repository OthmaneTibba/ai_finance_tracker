import { Navigate, Outlet } from "react-router-dom";
import { msalInstance } from "../authConfig";

export default function UnProtectedRoutes() {
  return msalInstance.getAllAccounts().length == 0 ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
}
