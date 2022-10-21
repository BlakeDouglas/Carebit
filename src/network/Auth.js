import { useAuthRequest, makeRedirectUri } from "expo-auth-session";

const discovery = {
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
};

export function getAuthRequest() {
  return useAuthRequest(
    {
      clientId: "228DBB",
      scopes: ["activity", "heartrate", "settings"],
      redirectUri: makeRedirectUri({
        scheme: "carebit",
        path: "callback",
      }),

      usePKCE: false,
      extraParams: { prompt: "login" },
    },
    discovery
  );
}
