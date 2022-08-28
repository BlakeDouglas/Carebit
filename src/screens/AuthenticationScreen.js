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
import pkceChallenge from "react-native-pkce-challenge";
import GlobalStyle from "../utils/GlobalStyle";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTokenData } from "../redux/actions";

const challenge = pkceChallenge();

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

const refreshToken = (tokenData) => {
  fetch("https://api.fitbit.com/oauth2/token", {
    body: "grant_type=refresh_token&refresh_token=" + tokenData.refresh_token,
    headers: {
      Authorization:
        "Basic MjM4UVMzOjYzZTJlNWNjY2M2OWY2ZThmMTk4Yjg2ZDYyYjUyYzE5",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("Refresh got: " + JSON.stringify(json));
    })
    .catch((error) => {
      console.log("Got error: " + error);
    });
};

const submitCode = (code, challenge) => {
  fetch("https://api.fitbit.com/oauth2/token", {
    body:
      "clientId=238QS3&grant_type=authorization_code&" +
      "redirect_uri=" +
      Linking.createURL("carebit") +
      "&code=" +
      code,
    headers: {
      Authorization:
        "Basic MjM4UVMzOjYzZTJlNWNjY2M2OWY2ZThmMTk4Yjg2ZDYyYjUyYzE5",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("Response got: " + JSON.stringify(json));
    })
    .catch((error) => {
      console.log("Got error: " + error);
    });
};

export default function AuthenticationScreen({ navigation }) {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.Reducers.authData);
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

  React.useEffect(() => {
    if (response?.type === "success") {
      //submitCode(response.params.code, challenge);

      // TODO: Note potential problem. If user creates caregivee, exits, then logs in, then caregiveeId will be erroneously null
      // Consider changing null -> -1 -> real id
      if (tokenData.type === "caregivee")
        makeCaregivee(response.params.code, tokenData);
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
