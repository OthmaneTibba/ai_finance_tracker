import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import { msalInstance } from "./authConfig";
import { useEffect } from "react";
import { useUserStore } from "./stores/user-store";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import UnProtectedRoutes from "./utils/UnProtectedRoutes";
import Receipt from "./pages/Receipt";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const userStore = useUserStore();
  useEffect(() => {
    if (msalInstance.getAllAccounts().length > 0) {
      const account = msalInstance.getAllAccounts()[0];
      msalInstance.setActiveAccount(account);
      userStore.setUser({
        email: account.username,
        isLogged: true,
      });
    }
  }, []);
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route element={<UnProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="" element={<Dashboard />} />
              <Route path="receipt" element={<Receipt />} />
              <Route path="transactions" element={<Transactions />} />
              <Route
                path="transactions/deltails"
                element={<TransactionDetails />}
              />
              <Route
                path="transactions/deltails/:transactionId"
                element={<TransactionDetails />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
