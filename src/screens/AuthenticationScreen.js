import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  ImageBackground,
  LogBox,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
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
      redirectUri: makeRedirectUri({
        scheme: "carebit",
        path: "callback",
      }),

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

      if (json.caregiveeId !== undefined) {
        dispatch(setTokenData({ ...tokenData, ...json, type: "caregivee" }));
      }
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
        <SafeAreaView
          style={{
            width: "100%",
            height: "15%",
            flexDirection: "row",
            marginTop: "25%",
            alignItems: "center",
          }}
        >
          <Image
            style={{ marginRight: "1%" }}
            source={require("../../assets/images/midCheck/icons-check.png")}
          />
          <Text style={{ fontSize: responsiveFontSize(2.8), color: "white" }}>
            Account Created
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            height: "15%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontSize: responsiveFontSize(2.5),
            }}
          >
            To allow your Caregiver to monitor you, you'll need to link your
            Fitbit account
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            width: "100%",
            height: "20%",
            marginTop: "15%",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity
            style={[GlobalStyle.Button]}
            onPress={() => {
              promptAsync();
            }}
          >
            <Text style={GlobalStyle.ButtonText}>Link Fitbit</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
