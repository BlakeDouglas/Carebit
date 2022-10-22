import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const storeKey = "carebitcredentials";

const discovery = {
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
};

const scopes = ["activity", "heartrate", "settings"];
const clientId = "228DBB";
const scheme = "carebit";
const path = "callback";

export function getAuthRequest() {
  return useAuthRequest(
    {
      clientId: clientId,
      scopes: scopes,
      redirectUri: makeRedirectUri({
        scheme: scheme,
        path: path,
      }),

      usePKCE: false,
      extraParams: { prompt: "login" },
    },
    discovery
  );
}

export async function setKeychain(body) {
  await SecureStore.setItemAsync(storeKey, JSON.stringify(body));
}

export async function getKeychain() {
  return await SecureStore.getItemAsync(storeKey);
}

export async function deleteKeychain() {
  await SecureStore.deleteItemAsync(storeKey);
}
