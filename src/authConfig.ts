import { PublicClientApplication } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_CLIENT_ID;
const authority = import.meta.env.VITE_AUTHORITY;
const redirectUri = import.meta.env.VITE_REDIRECT_URL;
const scope = import.meta.env.VITE_SCOPE;

const msalConfig = {
  auth: {
    clientId: clientId,
    authority: authority,
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const loginRequest = {
  scopes: [scope, "User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
