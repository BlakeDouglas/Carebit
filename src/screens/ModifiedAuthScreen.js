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
} from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function ModifiedAuthScreen({ navigation, route }) {
  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));

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
    if (response?.type === "success") {
      console.log(
        "\nSuccess on Fitbit Auth. Data being sent to makeCaregivee: "
      );
      console.log(response.params.code);
      console.log(route.params.json.userID);
      console.log("End of makeCaregivee data\n\n");
      makeCaregivee(response.params.code, route.params.json.userID);
    }
  }, [response]);

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
        await makeRequest();
      } else
        Alert.alert("Error", json.error, json.error_0, [
          { text: "Ok", onPress: () => {}, style: "cancel" },
        ]);
    } catch (error) {
      console.log("Caught error in /caregivee/create: " + error);
    }
  };

  const makeRequest = async () => {
    if (!tokenData.phone || !route.params.json.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? {
            caregiveePhone: tokenData.phone,
            caregiverPhone: route.params.json.phone,
            sender: tokenData.type,
          }
        : {
            caregiverPhone: tokenData.phone,
            caregiveePhone: route.params.json.phone,
            sender: tokenData.type,
          };
    try {
      const response = await fetch("https://www.carebit.xyz/createRequest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      console.log("JSON is here: ");
      console.log(json);
      console.log("End of JSON\n\n");
      if (json.error) {
        console.log(json.error);
        // TODO: Prettify these errors.
        if (json.error === "This request already exists") {
          handleError("  Already added", "phone");
        } else {
          handleError("  Not Found", "phone");
        }
      }
      // console.log(json);
      if (json.request) {
        console.log("\nSending accept request: ");
        console.log(json.request.caregiveeID);
        console.log(tokenData.caregiverID);
        console.log("End of sent\n\n");
        await acceptRequest(json.request.caregiveeID, tokenData.caregiverID);
      }
    } catch (error) {
      console.log("Caught error in /createRequest: " + error);
    }
  };

  const acceptRequest = async (caregiveeID, caregiverID) => {
    try {
      const response = await fetch("https://www.carebit.xyz/acceptRequest", {
        method: "PUT",
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
      console.log("\nAccept Request info here");
      console.log(json);
      console.log("End\n\n");
      if (json.request.caregiveeID) {
        console.log("acceptRequest" + JSON.stringify(json));
        navigation.navigate("ModifiedPhysScreen", json.request);
      }
      if (json.error)
        console.log("Error is probably invalid uri in backend. Maybe not tho");
    } catch (error) {
      console.log("Caught error in /acceptRequest: " + error);
    }
  };

  const [errors, setErrors] = useState({});
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const logOutButtonHandler = async () => {
    await SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
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
              Link the Caregivee's Fitbit account to provide the Caregiver
              monitoring access
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
