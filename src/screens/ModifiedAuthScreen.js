import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Alert,
  LogBox,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function ModifiedAuthScreen({ navigation, route }) {
  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));
  console.log("Auth Screen");
  console.log(route.params.json.access_token);
  console.log("They be present above");
  const dispatch = useDispatch();

  const discovery = {
    authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
    tokenEndpoint: "https://api.fitbit.com/oauth2/token",
    revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
  };

  const makeCaregivee = async (code, userID) => {
    try {
      const response = await fetch("https://www.carebit.xyz/caregivee/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + route.params.json.access_token,
        },
        body: JSON.stringify({
          userID: userID,
          authCode: code,
        }),
      });
      const json = await response.json();

      if (json.caregiveeID !== undefined) {
        dispatch(
          setTokenData({
            ...route.params.json.access_token,
            ...json,
            type: "caregivee",
          })
        ),
          await acceptRequest(
            json.caregiveeID,
            route.params.tokenData.caregiverID
          );
      } else
        Alert.alert("Error", json.error, json.error_0, [
          { text: "Ok", onPress: () => {}, style: "cancel" },
        ]);
    } catch (error) {
      console.log("Caught error in /caregivee/create: " + error);
    }
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "238QS3",
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

  React.useEffect(() => {
    if (response?.type === "success")
      makeCaregivee(response.params.code, route.params.json.userID);
  }, [response]);

  //Can't do accept until Fitbit auth. caregiveeID comes from /createCaregivee which takes FitBit code and userID}
  const acceptRequest = async (caregiveeID, caregiverID) => {
    try {
      const response = await fetch("https://www.carebit.xyz/acceptRequest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + route.params.json.access_token,
        },
        body: JSON.stringify({
          caregiveeID: caregiveeID,
          caregiverID: caregiverID,
        }),
      });
      const json = await response.json();
      console.log("acceptRequest" + JSON.stringify(json));
      navigation.navigate("Home");
      if (json.error)
        console.log("Error is probably invalid uri in backend. Maybe not tho");
    } catch (error) {
      console.log("Caught error in /acceptCaregiverRequest: " + error);
    }
  };

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

            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                { marginTop: 20, backgroundColor: "transparent" },
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
