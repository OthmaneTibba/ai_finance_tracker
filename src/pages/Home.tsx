import { useNavigate } from "react-router-dom";
import { loginRequest } from "../authConfig";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    if (instance.getAllAccounts().length > 0) {
      navigate("/dashboard");
    } else {
      login();
    }
  }, [instance.getAllAccounts()]);
  const login = async () => {
    await instance.loginRedirect(loginRequest);
    await instance.handleRedirectPromise();
  };
  return <div>Loading...</div>;
}
