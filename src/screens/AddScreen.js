import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { phone } from "phone";

export default function AddScreen({ navigation: { goBack } }) {
  const fontScale = useWindowDimensions();
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
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";

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
    const body =
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
      } else {
        goBack();
      }
    } catch (error) {
      console.log("Caught error in /createRequest: " + error);
    }
  };

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

          <SafeAreaView
            style={{
              height: "20%",
              alignSelf: "center",
              width: "100%",

              justifyContent: "flex-end",
              //backgroundColor: "blue",
              alignItems: "center",
            }}
          >
            <Text style={[GlobalStyle.Subtitle, { alignSelf: "center" }]}>
              {typeOfRequester === "caregivee"
                ? "Add Caregivee"
                : "Add Caregiver"}
            </Text>
          </SafeAreaView>

          <SafeAreaView
            style={{
              height: "20%",
              width: "90%",
              //backgroundColor: "red",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.5) / fontScale,
                color: "white",
              }}
            >
              {typeOfRequester === "caregivee"
                ? "Please enter your Caregivee's phone number to add them"
                : "Please enter your Caregiver's phone number to add them"}
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "80%",
              width: "80%",
              alignSelf: "center",
              //backgroundColor: "blue",
              justifyContent: "flex-start",
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
            <SafeAreaView style={{}}>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "8%" }]}
                onPress={validate}
              >
                <Text style={GlobalStyle.ButtonText}>Send Request</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
