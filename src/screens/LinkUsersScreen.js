import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CustomTextInput from "../utils/CustomTextInput";
import React, { useEffect, useState, useCallback } from "react";
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
        dispatch(setTokenData({ ...tokenData, caregiveeID: [json.request] }));

      getRequests(tokenData);
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
          <SafeAreaView style={[GlobalStyle.Container, { marginTop: "20%" }]}>
            <Text
              style={[
                GlobalStyle.Subtitle,
                { fontSize: responsiveFontSize(5.3) },
              ]}
            >
              Connect to a Caregivee
            </Text>
            <SafeAreaView
              style={{
                height: "75%",
                width: "100%",
                marginTop: "10%",
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
                  <CustomTextInput
                    label={
                      typeOfRequester === "caregivee"
                        ? "Caregivee's Phone Number"
                        : "Caregiver's Phone Number"
                    }
                    placeholder="(XXX) XXX-XXXX"
                    iconName="phone-outline"
                    keyboardType="number-pad"
                    error={errors.phone}
                    onChangeText={(text) =>
                      handleChange(text.replace(/[^0-9]+/g, ""), "phone")
                    }
                    onFocus={() => {
                      handleError(null, "phone");
                    }}
                  />
                </SafeAreaView>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "5%" }]}
                  onPress={validate}
                >
                  <Text style={GlobalStyle.ButtonText}>Send Request</Text>
                </TouchableOpacity>
              </SafeAreaView>
              <SafeAreaView
                style={{ flex: 1, marginTop: "20%", alignItems: "center" }}
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
                  onPress={createButtonAlert}
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
