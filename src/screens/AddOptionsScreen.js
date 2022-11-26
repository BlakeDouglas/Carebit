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
import { moderateScale, scale } from "react-native-size-matters";

export default function AddOptionsScreen({ navigation }) {
  const dispatch = useDispatch();

  // Sends user back to Link Users Screen
  const ContinueButtonHandler = () => {
    navigation.goBack();
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
            { marginRight: "6%", marginLeft: "6%" },
          ]}
        >
          {/* Title Container */}
          <SafeAreaView
            style={{
              width: "100%",
              height: "15%",
              alignSelf: "center",
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle,
                {
                  textAlign: "center",
                  fontSize: moderateScale(44) / fontScale,
                },
              ]}
            >
              Adding Options
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              marginTop: scale(16),
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(23) / fontScale,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Caregivee Uses the App
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(17.2) / fontScale,
                marginTop: "5%",
                alignSelf: "center",
                textAlign: "left",
              }}
            >
              {
                "Downloading the app provides your caregivee the benefit of privacy options, the ability to mark notifications that they're okay, and their own dashboard.\n"
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
                fontSize: moderateScale(23) / fontScale,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Using One Device
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(17.2) / fontScale,
                marginTop: scale(16),
                alignSelf: "center",
                textAlign: "left",
              }}
            >
              {
                "If your Caregivee doesn't want the app, you can make them an account through your phone, as long as you can sign into their Fitbit account. THey can still get the app in the future if they choose this option\n"
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
                  { fontSize: moderateScale(19.4) / fontScale },
                ]}
              >
                Go Back
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
