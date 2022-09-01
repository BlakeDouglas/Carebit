import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  ImageBackground,
  LogBox,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTokenData } from "../redux/actions";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function AuthenticationScreen({ navigation }) {
  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);

  const discovery = {
    authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
    tokenEndpoint: "https://api.fitbit.com/oauth2/token",
    revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
  };
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "238QS3",
      scopes: ["activity", "sleep", "temperature"],
      redirectUri: "exp://127.0.0.1:19000/--/callback",

      /* TODO:
      redirectUri: makeRedirectUri({
        scheme: "carebit",
        path: "callback",
      }),*/

      usePKCE: false,
      extraParams: { prompt: "login" },
    },
    discovery
  );

  const makeCaregivee = async (code, tokenData) => {
    try {
      const response = await fetch("https://www.carebit.xyz/caregivee/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify({ userID: tokenData.userId, authCode: code }),
      });
      const json = await response.json();
      dispatch(setTokenData({ ...tokenData, ...json }));
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  React.useEffect(() => {
    if (response?.type === "success")
      makeCaregivee(response.params.code, tokenData);
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={GlobalStyle.Container}>
        {/* TODO: Change styling here*/}
        <Text style={[GlobalStyle.Text, { marginTop: 30, marginBottom: 68 }]}>
          Authentication
        </Text>

        <TouchableOpacity
          style={GlobalStyle.Button}
          onPress={() => {
            promptAsync();
          }}
        >
          <Text style={GlobalStyle.ButtonText}>Authenticate</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
