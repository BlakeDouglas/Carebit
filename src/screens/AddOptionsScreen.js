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

export default function AddOptionsScreen({ navigation }) {
  const dispatch = useDispatch();
  // Sends user to Link user screen
  const ContinueButtonHandler = () => {
    navigation.navigate("LinkUsersScreen");
  };
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Set status bar color and properties. Fixes Android UI issue*/}
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView
          style={[
            GlobalStyle.Container,
            { marginTop: "12%", marginRight: "6%", marginLeft: "6%" },
          ]}
        >
          {/* Title Container */}
          <SafeAreaView
            style={{
              width: "100%",
              height: "15%",
              //backgroundColor: "blue",
              alignSelf: "center",
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle,
                {
                  textAlign: "center",
                  fontSize: responsiveFontSize(6.3) / fontScale,
                },
              ]}
            >
              App Options
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              marginTop: "5%",

              width: "100%",
              //backgroundColor: "red",
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
              Caregivee Uses the App
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(2.3) / fontScale,
                marginTop: "5%",
                alignSelf: "center",
                textAlign: "left",
              }}
            >
              {
                "If your Caregivee decides to download the app, they will have the benefit of privacy options, the ability to mark notifications that they're okay, and their own dashboard. This is the recommended method.\n"
              }
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              width: "100%",
              marginTop: "3%",
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
                fontSize: responsiveFontSize(2.3) / fontScale,
                marginTop: "5%",
                alignSelf: "center",
                textAlign: "left",
              }}
            >
              {
                "Carebit also offers the option to connect with your Caregivee without them using the app. Only choose this option if you will be able to sign-in to their fitbit account.\n"
              }
            </Text>
          </SafeAreaView>
          {/* Log in and make account button container */}
          <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            {/* Button to create an account along with onPress navigation */}
            <TouchableOpacity
              style={GlobalStyle.Button}
              onPress={ContinueButtonHandler}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: responsiveFontSize(2.51) / fontScale },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
