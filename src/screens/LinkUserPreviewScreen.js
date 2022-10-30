import {
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import GlobalStyle from "../utils/GlobalStyle";
import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function LinkUserPreviewScreen({ navigation }) {
  const dispatch = useDispatch();
  // Sends user to Link user screen
  const fontScale = useWindowDimensions();
  const ContinueButtonHandler = () => {
    navigation.navigate("LinkUsersScreen");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Set status bar color and properties. Fixes Android UI issue*/}
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={[GlobalStyle.Container, { marginTop: "8%" }]}>
          {/* Title Container */}
          <SafeAreaView
            style={{
              width: "100%",
              height: "15%",
              //backgroundColor: "blue",
              alignSelf: "center",
            }}
          >
            <Text style={[GlobalStyle.Subtitle, { textAlign: "center" }]}>
              App Options
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              marginTop: "5%",
              height: "30%",
              width: "100%",
              //backgroundColor: "blue",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(3) / fontScale,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Both users have the app
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(2.1) / fontScale,
                marginTop: "8%",
                alignSelf: "center",
                //textAlign: "center",
              }}
            >
              If both users download the app, your Caregivee will have the added
              benefit of privacy options, the ability to mark notifications that
              they're okay, and their own dashboard. This is the recommended
              method.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              marginTop: "5%",
              height: "30%",
              width: "100%",
              //backgroundColor: "blue",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(3) / fontScale,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Caregivee Opts Out
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(2.1) / fontScale,
                marginTop: "8%",
                alignSelf: "center",
              }}
            >
              Your Caregivee also has the option to Opt Out of downloading
              Carebit. In choosing this option, you will need to sign into their
              Fitbit account through your phone.
            </Text>
          </SafeAreaView>
          {/* Log in and make account button container */}
          <SafeAreaView style={{ width: "100%", height: "22%" }}>
            {/* Button to create an account along with onPress navigation */}
            <TouchableOpacity
              style={GlobalStyle.Button}
              onPress={ContinueButtonHandler}
            >
              <Text style={GlobalStyle.ButtonText}>Continue</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
