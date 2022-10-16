import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import PhoneInput from "react-native-phone-number-input";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";

export default function AddScreen({ navigation: { goBack } }) {
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
    if (!inputs.phone) {
      handleError("  Input required", "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError("  Invalid Number", "phone");
      valid = false;
    } else if (inputs.phone === tokenData.phone) {
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
            <Text style={{ fontSize: responsiveFontSize(2.5), color: "white" }}>
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
            {/*==============NEW PHONE NUMBER BOX WITH COUNTRY CODE ============================*/}
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
