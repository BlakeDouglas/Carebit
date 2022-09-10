import {
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

import React from "react";

import * as Linking from "expo-linking";

export default function TitleScreen({ navigation }) {
  const createAccountButtonHandler = () => {
    navigation.navigate("RoleSelectScreen");
  };
  const loginButtonHandler = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")} // Edit me if you find a better image~!
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="#000000"
        />
        <SafeAreaView style={GlobalStyle.Container}>
          <Text style={GlobalStyle.Subtitle}>Welcome to</Text>
          <Text style={GlobalStyle.Title}>Carebit</Text>
          <SafeAreaView
            style={{
              height: "35%",
              width: "100%",
              marginTop: "5%",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <Text style={GlobalStyle.Text}>
              Carebit uses Fitbit devices to monitor the heart rate and activity
              of you or your loved one {"\n\n"}If you or your loved one's Fitbit
              is not set up, visit{" "}
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
          </SafeAreaView>

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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
