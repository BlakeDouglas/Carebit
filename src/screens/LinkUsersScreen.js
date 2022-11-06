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

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    let phoneData = phone(inputs.phone);

    if (!phoneData.isValid) {
      handleError(" Invalid Number", "phone");
      valid = false;
    } else {
      inputs.phone = phoneData.phoneNumber;
    }
    if (inputs.phone === tokenData.phone) {
      handleError("  Invalid Number", "phone");
      valid = false;
    }

    if (valid) {
      makeRequest();
    }
  };

  const makeRequest = async () => {
    if (!tokenData.phone || !inputs.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? {
            caregiveePhone: tokenData.phone,
            caregiverPhone: inputs.phone,
            sender: tokenData.type,
          }
        : {
            caregiverPhone: tokenData.phone,
            caregiveePhone: inputs.phone,
            sender: tokenData.type,
          };
    const params = { auth: tokenData.access_token, body: body };
    const json = await createRequestEndpoint(params);
    if (json.error) {
      if (json.error === "This request already exists") {
        handleError("  Already added", "phone");
      } else {
        handleError("  Not Found", "phone");
      }
      return;
    }
    if (json.request) {
      Alert.alert(
        "Sent!",
        "Your request has been sent. Once accepted, you will be able to view their Fitbit data.",
        [
          {
            text: "Continue",
            onPress: () => {
              dispatch(setTokenData({ ...tokenData, authPhase: 2 }));
            },
          },
        ]
      );
    }
  };

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
          <Modal
            isVisible={isModal1Visible}
            backdropOpacity={0.5}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
          >
            <View
              style={{
                alignSelf: "center",
                height: "31%",
                width: "75%",
                backgroundColor: "white",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <SafeAreaView
                style={{
                  alignItems: "center",
                  width: "90%",
                  height: "60%",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.2) / fontScale,
                  }}
                >
                  Warning
                </Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.8) / fontScale,
                    fontWeight: "400",
                    textAlign: "left",
                  }}
                >
                  You will need to sign in to your caregivee's Fitbit device.
                  Only continue if you know their Fitbit credentials
                </Text>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <SafeAreaView
                  style={{
                    height: "50%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopColor: "rgba(128, 128, 128, .2)",
                    borderTopWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      //backgroundColor: "blue",
                    }}
                    onPress={() => {
                      toggleModal1();
                      dispatch(setTokenData({ ...tokenData, authPhase: 10 }));
                    }}
                  >
                    <Text
                      style={{
                        color: "dodgerblue",
                        fontSize: responsiveFontSize(2) / fontScale,
                        fontWeight: "bold",
                      }}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
                <SafeAreaView
                  style={{
                    height: "50%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopColor: "rgba(128, 128, 128, .2)",
                    borderTopWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{ alignItems: "center", justifyContent: "center" }}
                    onPress={() => {
                      toggleModal1();
                      console.log("Cancel Pressed");
                    }}
                  >
                    <Text
                      style={{
                        color: "dodgerblue",
                        fontSize: responsiveFontSize(2) / fontScale,
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </SafeAreaView>
            </View>
          </Modal>

          <SafeAreaView style={[GlobalStyle.Container, { marginTop: "19%" }]}>
            <SafeAreaView style={{ marginBottom: "2%" }}>
              <Text
                style={[
                  GlobalStyle.Subtitle,
                  { fontSize: responsiveFontSize(5.3) / fontScale },
                ]}
              >
                Connect to a Caregivee
              </Text>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "75%",
                width: "100%",
                marginTop: "13%",
                justifyContent: "center",

                //backgroundColor: "green",
              }}
            >
              <SafeAreaView
                style={{
                  height: "50%",
                  width: "100%",
                  alignSelf: "center",
                  //backgroundColor: "blue",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    GlobalStyle.Text,
                    { fontSize: responsiveFontSize(2.3) / fontScale },
                  ]}
                >
                  Request a Caregivee for monitoring {"\n"}(recommended method)
                </Text>
                <SafeAreaView
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    //backgroundColor: "blue",
                    justifyContent: "center",
                    marginTop: "5%",
                  }}
                >
                  <CustomTextInput
                    label={
                      typeOfRequester === "caregivee"
                        ? "Caregivee's Phone Number"
                        : "Caregiver's Phone Number"
                    }
                    error={errors.phone}
                    onChangeFormattedText={(text) => {
                      handleChange(text, "phone");
                      handleError(null, "phone");
                    }}
                    phone
                  />
                </SafeAreaView>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "5%" }]}
                  onPress={validate}
                >
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: responsiveFontSize(2.51) / fontScale },
                    ]}
                  >
                    Send Request
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
              <SafeAreaView
                style={{ flex: 1, marginTop: "19%", alignItems: "center" }}
              >
                <Text
                  style={[
                    GlobalStyle.Text,
                    { fontSize: responsiveFontSize(2.3) / fontScale },
                  ]}
                >
                  Proceed without your Caregivee using the app
                </Text>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "8%" }]}
                  onPress={toggleModal1}
                >
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: responsiveFontSize(2.51) / fontScale },
                    ]}
                  >
                    Opt Out
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}
