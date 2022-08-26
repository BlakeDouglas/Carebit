import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

import GlobalStyle from "../utils/GlobalStyle";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import React from "react";
const discovery = {
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
};

export default function TitleScreen({ navigation }) {
  const createAccountButtonHandler = () => {
    navigation.navigate("RoleSelectScreen");
  };
  const loginButtonHandler = () => {
    navigation.navigate("LoginScreen");
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "238QS3",
      scopes: ["activity", "sleep"],
      redirectUri: Linking.createURL("carebit"),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code);
    }
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={GlobalStyle.Container}>
        <Text style={[GlobalStyle.Subtitle, { marginTop: "25%" }]}>
          Welcome to
        </Text>
        <Text style={GlobalStyle.Title}>Carebit</Text>
        <Text style={[GlobalStyle.Text, { marginTop: 30, marginBottom: 68 }]}>
          Carebit uses Fitbit devices to monitor the heart rate and activity of
          you or your loved one {"\n\n"}If you or your loved one's Fitbit is not
          set up, visit{" "}
          <Text
            onPress={() => Linking.openURL("https://www.fitbit.com/start")}
            style={[
              GlobalStyle.Text,
              {
                textDecorationLine: "underline",
              },
            ]}
          >
            fitbit.com/start
          </Text>
        </Text>

        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
          style={GlobalStyle.Button}
        />

        <TouchableOpacity
          style={GlobalStyle.Button}
          onPress={createAccountButtonHandler}
        >
          <Text style={GlobalStyle.ButtonText}>Create an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            GlobalStyle.Button,
            { backgroundColor: "transparent", marginTop: "7%" },
          ]}
          onPress={loginButtonHandler}
        >
          <Text style={GlobalStyle.ButtonText}>Log In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
