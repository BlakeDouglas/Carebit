import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomTextInput from "../utils/CustomTextInput";

export default function AddScreen({ navigation }) {
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
    console.log("Type: " + inputs.phone);
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.phone) {
      handleError(" Input required", "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError(" Invalid phone number", "phone");
      valid = false;
    }

    if (valid) {
      request();
    }
  };

  const request = async () => {
    const body =
      tokenData.type === "caregivee"
        ? { caregiveePhone: tokenData.phone, caregiverPhone: inputs.phone }
        : { caregiverPhone: tokenData.phone, caregiveePhone: phoneInput };
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
      console.log("Add result: " + JSON.stringify(json));
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")} // Edit me if you find a better image~!
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="#000000"
        />
        <ScrollView style={{ marginTop: "25%", flex: 1 }}>
          <SafeAreaView
            style={{
              height: "20%",
              alignSelf: "center",
              width: "100%",
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
              marginTop: "10%",
              height: "20%",
              width: "100%",
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
            <CustomTextInput
              label={
                typeOfRequester === "caregivee"
                  ? "Caregivee's Phone Number"
                  : "Caregiver's Phone Number"
              }
              placeholder="(XXX) XXX-XXXX"
              iconName="phone-outline"
              keyboardType="number-pad"
              error={errors.addUser}
              onChangeText={(text) =>
                handleChange(text.replace(/[^0-9]+/g, ""), "phone")
              }
              onFocus={() => {
                handleError(null, "phone");
              }}
            />
            <SafeAreaView style={{}}>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "8%" }]}
              >
                <Text style={GlobalStyle.ButtonText} onPress={validate}>
                  Send Request
                </Text>
              </TouchableOpacity>
              <Text></Text>
            </SafeAreaView>
            <Text></Text>
            <Text></Text>
          </SafeAreaView>
          <Text></Text>
          <Text></Text>
          <Text></Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
