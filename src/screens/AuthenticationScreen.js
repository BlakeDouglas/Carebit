import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Alert,
  LogBox,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export const discovery = {
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
};

export const makeCaregivee = async (code, tokenData, dispatch) => {
  try {
    const response = await fetch("https://www.carebit.xyz/caregivee/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenData.access_token,
      },
      body: JSON.stringify({ userID: tokenData.userID, authCode: code }),
    });
    const json = await response.json();

    if (json.caregiveeID !== undefined) {
      dispatch(setTokenData({ ...tokenData, ...json, type: "caregivee" }));
    } else
      Alert.alert("Error", json.error, json.error_0, [
        { text: "Ok", onPress: () => {}, style: "cancel" },
      ]);
  } catch (error) {
    console.log("Caught error in /caregivee/create: " + error);
  }
};

export default function AuthenticationScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const {fontScale} = useWindowDimensions();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "228DBB",
      scopes: [
        "activity",
        "heartrate",
        "location",
        "nutrition",
        "profile",
        "settings",
        "sleep",
        "social",
        "weight",
        "oxygen_saturation",
        "respiratory_rate",
        "temperature",
      ],
      redirectUri: makeRedirectUri({
        scheme: "carebit",
        path: "callback",
      }),

      usePKCE: false,
      extraParams: { prompt: "login" },
    },
    discovery
  );

  const logOutButtonHandler = async () => {
    await SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
  };

  React.useEffect(() => {
    if (response?.type === "success")
      makeCaregivee(response.params.code, tokenData, dispatch);
  }, [response]);

  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
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
            <Text style={{ fontSize: responsiveFontSize(2.8) / fontScale, color: "white" }}>
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
                fontSize: responsiveFontSize(2.5) / fontScale,
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

            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                { marginTop: verticalScale(20), backgroundColor: "transparent" },
              ]}
              onPress={() => {
                logOutButtonHandler();
              }}
            >
              <Text style={GlobalStyle.ButtonText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
