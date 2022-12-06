import {
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { phone } from "phone";
import { createRequestEndpoint } from "../network/CarebitAPI";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { setTokenData } from "../redux/actions";
export default function AddScreen({ navigation }) {
  const [errors, setErrors] = useState({});
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    phone: "",
  });
  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";

  // Validates all input fields
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    let phoneData = phone(inputs.phone);
    // Error handler for invalid phone number
    if (!phoneData.isValid) {
      handleError(" Invalid Phone", "phone");
      valid = false;
    } else {
      inputs.phone = phoneData.phoneNumber;
    }
    if (inputs.phone === tokenData.phone) {
      handleError("  Invalid Phone", "phone");
      valid = false;
    }
    if (!tokenData.phone) {
      handleError("  Account Error", "phone");
      valid = false;
    }
    // If we reach here, all inputs are valid
    if (valid) {
      makeRequest();
    }
  };
  // Sends link request to either caregiver or caregivee
  const makeRequest = async () => {
    const params = {
      auth: tokenData.access_token,
      body:
        tokenData.type === "caregivee"
          ? {
              caregiveePhone: tokenData.phone,
              caregiverPhone: inputs.phone,
              sender: tokenData.type,
            }
          : {
              caregiverPhone: tokenData.phone,
              caregiveePhone: inputs.phone,
              sender: tokenData.type,
            },
    };
    const json = await createRequestEndpoint(params);
    if (json.error) {
      if (json.error === "This request already exists") {
        handleError("  Already added", "phone");
      } else {
        handleError("  Not Found", "phone");
      }
    } else if (json.request) {
      Alert.alert(
        "Sent!",
        "Your request has been sent. Once accepted, you will be able to view their Fitbit data.",
        [
          {
            text: "Continue",
            onPress: () => {
              if (tokenData.authPhase === 1) {
                dispatch(setTokenData({ ...tokenData, authPhase: 2 }));
              } else {
                navigation.navigate("HomeScreen");
              }
            },
          },
        ]
      );
    } else
      console.log("No response and no error. This should not be happening.");
  };
  // Used for fixing accessibility zoom
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            hidden={false}
            translucent={true}
            backgroundColor="transparent"
          />
          {/* Title container */}
          <SafeAreaView
            style={{
              height: "20%",
              alignSelf: "center",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle,
                {
                  alignSelf: "center",
                  fontSize: moderateScale(48.5) / fontScale,
                },
              ]}
            >
              {typeOfRequester === "caregivee"
                ? "Add Caregivee"
                : "Add Caregiver"}
            </Text>
          </SafeAreaView>
          {/* Main body description container */}
          <SafeAreaView
            style={{
              height: "20%",
              width: "90%",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(19.3) / fontScale,
                color: "white",
              }}
            >
              {typeOfRequester === "caregivee"
                ? "Please enter your Caregivee's phone number to add them"
                : "Please enter your Caregiver's phone number to add them"}
            </Text>
          </SafeAreaView>
          {/* Custom Text Input Field for adding users */}
          <SafeAreaView
            style={{
              height: "80%",
              width: "80%",
              alignSelf: "center",
              justifyContent: "flex-start",
              marginTop: scale(17.2),
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
            {/* Send request button container */}
            <SafeAreaView>
              {/* Sends inputs to be validated on presss */}
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: scale(22) }]}
                onPress={validate}
              >
                <Text
                  style={[
                    GlobalStyle.ButtonText,
                    { fontSize: moderateScale(19) / fontScale },
                  ]}
                >
                  Send Request
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
