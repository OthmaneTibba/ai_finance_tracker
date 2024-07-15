import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { MsalProvider } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useUserStore } from "./stores/user-store";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import UnProtectedRoutes from "./utils/UnProtectedRoutes";
import Receipt from "./pages/Receipt";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  PublicClientApplication,
  IPublicClientApplication,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export default function App() {
  const [instance, setInstance] = useState<
    IPublicClientApplication | undefined
  >(undefined);

  const userStore = useUserStore();

  const initMsal = async () => {
    const msal = new PublicClientApplication(msalConfig);
    setInstance(msal);
    await msal.initialize();
  };
  useEffect(() => {
    initMsal();

    if (instance !== undefined) {
      if (instance.getAllAccounts().length > 0) {
        const account = instance.getAllAccounts()[0];
        instance.setActiveAccount(account);
        userStore.setUser({
          email: account.username,
          isLogged: true,
        });
      }
    }
  }, []);
  return (
    <div>
      {instance !== undefined ? (
        <MsalProvider instance={instance}>
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
        </MsalProvider>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
