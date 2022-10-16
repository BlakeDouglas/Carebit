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
} from "react-native";
import CustomTextInput from "../utils/CustomTextInput";
import PhoneInput from "react-native-phone-number-input";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-native-modal";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";
import { discovery } from "./AuthenticationScreen";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { setTokenData } from "../redux/actions";

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

  const createButtonAlert = () =>
    Alert.alert(
      "Warning",
      "You will need to sign into your caregivee's Fitbit device.\nOnly continue if you know their Fitbit credentials.",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ModifiedCaregiveeAccountCreation");
          },
        },
      ]
    );
  const [isModal1Visible, setModal1Visible] = useState(false);
  const toggleModal1 = () => {
    setModal1Visible(!isModal1Visible);
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.phone) {
      handleError("  Input required", "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError("  Too Short", "phone");
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
    try {
      const response = await fetch("https://www.carebit.xyz/createRequest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (json.error) {
        console.log(json.error);
        // TODO: Prettify these errors.
        if (json.error === "This request already exists") {
          handleError("  Already added", "phone");
        } else {
          handleError("  Not Found", "phone");
        }
      }
      if (json.request)
        Alert.alert(
          "Sent!",
          "Your request has been sent. Once accepted, you will be able to view their Fitbit data.",
          [{ text: "Continue", onPress: () => console.log("Continue") }]
        );
      dispatch(setTokenData({ ...tokenData, caregiveeID: [json.request] }));
    } catch (error) {
      console.log("Caught error in /createRequest: " + error);
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
                    fontSize: responsiveFontSize(2.2),
                  }}
                >
                  Warning
                </Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.8),
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
                      backgroundColor: "blue",
                    }}
                    onPress={() => {
                      toggleModal1();
                      navigation.navigate("ModifiedCaregiveeAccountCreation");
                    }}
                  >
                    <Text
                      style={{
                        color: "dodgerblue",
                        fontSize: responsiveFontSize(2),
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
                        fontSize: responsiveFontSize(2),
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
                  { fontSize: responsiveFontSize(5.3) },
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
                    { fontSize: responsiveFontSize(2.3) },
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
                  <View style={{ marginTop: "4%" }}>
                    <Text style={{ color: "white", marginBottom: "1%" }}>
                      {typeOfRequester === "caregivee"
                        ? "Caregivee's Phone Number"
                        : "Caregiver's Phone Number"}
                    </Text>
                    <PhoneInput
                      defaultCode={"US"}
                      pickerBackgroundColor={"white"}
                      containerStyle={{
                        backgroundColor: "transparent",
                        marginBottom: "4%",
                        borderWidth: 1.0,
                        borderColor: "rgba(255, 255, 255, .25)",
                        alignItems: "center",
                        width: "100%",
                      }}
                      textContainerStyle={{
                        backgroundColor: "transparent",
                        flexDirection: "row",
                        paddingHorizontal: "3%",
                        borderColor: "rgba(255, 255, 255, .5)",
                      }}
                      textInputStyle={{
                        color: "white",
                      }}
                      textInputProps={{
                        placeholderTextColor: "rgba(255, 255, 255, .5)",
                      }}
                      codeTextStyle={{
                        color: "rgba(255, 255, 255, .5)",
                      }}
                      placeholder="(XXX) XXX - XXXX"
                      onChangeText={(text) =>
                        // Removes everything but numbers, so it complies with the api
                        // TODO: Handle this differently
                        handleChange(text.replace(/[^0-9]+/g, ""), "phone")
                      }
                    />
                  </View>
                </SafeAreaView>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "5%" }]}
                  onPress={validate}
                >
                  <Text style={GlobalStyle.ButtonText}>Send Request</Text>
                </TouchableOpacity>
              </SafeAreaView>
              <SafeAreaView
                style={{ flex: 1, marginTop: "19%", alignItems: "center" }}
              >
                <Text
                  style={[
                    GlobalStyle.Text,
                    { fontSize: responsiveFontSize(2.3) },
                  ]}
                >
                  Proceed without your Caregivee using the app
                </Text>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "8%" }]}
                  onPress={toggleModal1}
                >
                  <Text style={GlobalStyle.ButtonText}>Opt Out</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}
