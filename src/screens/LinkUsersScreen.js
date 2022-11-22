import {
  StyleSheet,
  ImageBackground,
  View,
  SafeAreaView,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import CustomTextInput from "../utils/CustomTextInput";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-native-modal";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSelector, useDispatch } from "react-redux";
import { discovery } from "./AuthenticationScreen";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { setTokenData } from "../redux/actions";
import { phone } from "phone";
import { createRequestEndpoint } from "../network/CarebitAPI";

export default function LinkUsersScreen({ navigation }) {
  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const [inputs, setInputs] = useState({
    phone: "",
  });
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const [errors, setErrors] = useState({});
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";
  const { fontScale } = useWindowDimensions();
  const [isModal1Visible, setModal1Visible] = useState(false);
  const toggleModal1 = () => {
    setModal1Visible(!isModal1Visible);
  };
  const moreInfoAlert = () => {
    navigation.navigate("AddOptionsScreen");
  };
  const warningAlert = () =>
    Alert.alert(
      "Warning",
      "You will need to sign in to your caregivee's Fitbit device. Only continue if you know their Fitbit credentials",
      [
        {
          text: "Continue",
          onPress: () => {
            navigation.navigate("ModifiedCaregiveeAccountCreation");
          },
          style: "continue",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            hidden={false}
            translucent={true}
            backgroundColor="black"
          />

          <SafeAreaView
            style={[
              GlobalStyle.Container,
              { marginTop: moderateScale(112, 0.1) },
            ]}
          >
            <SafeAreaView style={{ marginBottom: moderateScale(23, 0.8) }}>
              <Text
                style={[
                  GlobalStyle.Subtitle,
                  { fontSize: moderateScale(39) / fontScale },
                ]}
              >
                Connect to a Caregivee
              </Text>
            </SafeAreaView>
            <SafeAreaView style={{ flex: 1 }}>
              <SafeAreaView
                style={{
                  height: verticalScale(windowHeight / 4.5),
                  width: "100%",
                  marginTop: moderateScale(20),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    GlobalStyle.Text,
                    { fontSize: moderateScale(18, 0.4) / fontScale },
                  ]}
                >
                  There are two options to connect to your Caregivee:{"\n\n"}
                  They can either download the app to use, or they can register
                  directly through your phone if they don't want to use the app.{" "}
                  <Text
                    onPress={() => moreInfoAlert()}
                    style={[
                      GlobalStyle.Text,
                      {
                        textDecorationLine: "underline",
                        fontSize: moderateScale(18, 0.4) / fontScale,
                      },
                    ]}
                  >
                    Read More
                  </Text>
                </Text>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <SafeAreaView
                  style={{
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={[GlobalStyle.Button]}
                    onPress={() => {
                      navigation.navigate("NavigationAddScreen");
                    }}
                  >
                    <Text
                      style={[
                        GlobalStyle.ButtonText,
                        { fontSize: scale(18) / fontScale },
                      ]}
                    >
                      They Have The App
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>

                <SafeAreaView
                  style={{
                    marginTop: moderateScale(25),
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={[GlobalStyle.Button]}
                    onPress={() => {
                      warningAlert();
                    }}
                  >
                    <Text
                      style={[
                        GlobalStyle.ButtonText,
                        { fontSize: scale(18) / fontScale },
                      ]}
                    >
                      Use My Device
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}
