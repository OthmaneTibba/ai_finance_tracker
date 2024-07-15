import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import DashboardLayout from "./layout/DashboardLayout";

import Receipt from "./pages/Receipt";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Redirect from "./components/Redirect";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthenticatedTemplate>
          <Routes>
            <Route path="/" element={<Redirect />} />
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
          </Routes>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <Routes>
            <Route path="*" element={<Navigate to={"/"} />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </UnauthenticatedTemplate>
      </BrowserRouter>
    </ThemeProvider>
  );
}
