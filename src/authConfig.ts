const clientId = import.meta.env.VITE_CLIENT_ID;
const authority = import.meta.env.VITE_AUTHORITY;
const redirectUri = import.meta.env.VITE_REDIRECT_URL;
const scope = import.meta.env.VITE_SCOPE;

export const msalConfig = {
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
