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
import { useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function AddIntroScreen({ navigation }) {
  const dispatch = useDispatch();
  // Sends user to Add Options Screen
  const ContinueButtonHandler = () => {
    navigation.navigate("AddOptionsScreen");
  };
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Set status bar color and properties. Fixes Android UI issue*/}
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView
          style={[
            GlobalStyle.Container,
            { marginTop: "15%", marginLeft: "8%", marginRight: "8%" },
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
              Using Carebit
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              marginTop: "8%",
              height: "50%",
              width: "100%",
              alignItems: "flex-start",
              //justifyContent: "flex-start",
              //backgroundColor: "blue",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: responsiveFontSize(2.4) / fontScale,
                alignSelf: "center",
              }}
            >
              {"To use Carebit, you must add an account that is connected to your Caregivee's Fitbit." +
                "\n\n\n" +
                'This can be done either by them downloading the app and making an account, or by chosing the "Opt Out" feature in which you\'ll directly connect to their Fitbit account.' +
                "\n\n\n" +
                "Click Continue to learn about each option."}
            </Text>
          </SafeAreaView>

          <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
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
