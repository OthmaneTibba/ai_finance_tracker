import { useNavigate } from "react-router-dom";
import { loginRequest, msalInstance } from "../authConfig";
import { useUserStore } from "../stores/user-store";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

export default function Home() {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    if (instance.getAllAccounts().length > 0) {
      navigate("/dashboard");
    }
  }, [instance.getAllAccounts()]);
  const login = async () => {
    await instance.loginRedirect(loginRequest);
    const response = await instance.handleRedirectPromise();

    if (response) {
      msalInstance.setActiveAccount(response.account);
      userStore.setUser({
        email: response.account.username,
        isLogged: true,
      });
    }
  };
  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
}
