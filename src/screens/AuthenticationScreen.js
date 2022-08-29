import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthRequest } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTokenData } from "../redux/actions";

const fetchFitbitData = (tokenData) => {
  fetch("https://api.fitbit.com/1/user/-/profile.json", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + tokenData.access_token,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("FETCH GOT: " + JSON.stringify(json));
    })
    .catch((error) => {
      console.log(error);
    });
};

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
      scopes: ["activity", "sleep"],
      redirectUri: Linking.createURL("carebit"),
      usePKCE: false,
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

  const sendEmail = async (tokenData, email) => {
    try {
      const response = await fetch("https://www.carebit.xyz/requestCaregivee", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caregiver: tokenData.userId, caregivee: email }),
      });

      const json = await response.json();
      console.log(JSON.stringify(json));
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  // TODO: Switch to onpost
  React.useEffect(() => {
    if (response?.type === "success") {
      if (tokenData.type === "caregivee" && tokenData.caregiveeId === null)
        makeCaregivee(response.params.code, tokenData);

      //sendEmail(tokenData, "Bdouglas928@gmail.com");
    }
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={GlobalStyle.Container}>
        <Text style={[GlobalStyle.Text, { marginTop: 30, marginBottom: 68 }]}>
          Authenticate here
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
