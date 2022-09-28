import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  StatusBar,
  Platform,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";

export default function ModifiedCaregiveeAccountCreation({
  navigation,
  route,
}) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const requiredText = " Input required";

  // Content between this point and the return statement
  // are inspired by kymzTech's React Native Tutorial

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    type: "",
    mobilePlatform: "",
  });

  const [errors, setErrors] = useState({});

  // Checks for formatting in text fields
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError(requiredText, "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError(" Invalid email", "email");
      valid = false;
    }

    if (!inputs.firstName) {
      handleError(requiredText, "firstName");
      valid = false;
    }

    if (!inputs.lastName) {
      handleError(requiredText, "lastName");
      valid = false;
    }

    if (!inputs.phone) {
      handleError(requiredText, "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError(" Invalid phone number", "phone");
      valid = false;
    }

    if (!inputs.password) {
      handleError(requiredText, "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError(" Too short (8 minimum)", "password");
      valid = false;
    } else if (!/[0-9]/.test(inputs.password)) {
      handleError(" Must contain a number", "password");
      valid = false;
    } else if (!/[A-Z]/.test(inputs.password)) {
      handleError(" Must contain capital", "password");
      valid = false;
    }

    if (valid) {
      registerShellCaregivee();
    }
  };
  console.log(tokenData.caregiverID);
  const registerShellCaregivee = async () => {
    const output = {
      ...inputs,
      type: "caregivee",
      mobilePlatform: "NA",
    };
    try {
      const response = await fetch("https://www.carebit.xyz/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
      });
      const json = await response.json();
      const shellID = json.userID;
      console.log("registerShellCaregivee: " + JSON.stringify(json));
      if (json.access_token) {
        navigation.navigate("ModifiedAuthScreen", { tokenData, json });
      }
    } catch (error) {
      console.log("Caught error in /user: " + error);
    }
  };
  {
    //Can't do accept until Fitbit auth. caregiveeID comes from /createCaregivee which takes FitBit code and userID}
    const acceptRequest = async (caregiveeID, caregiverID) => {
      try {
        const response = await fetch("https://www.carebit.xyz/acceptRequest", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caregiveeID: caregiveeID,
            caregiverID: caregiverID,
          }),
        });
        const json = await response.json();
        console.log("acceptRequest" + JSON.stringify(json));
        navigation.navigate("ModifiedAuthScreen", shellID);
        if (json.error)
          console.log(
            "Error is probably invalid uri in backend. Maybe not tho"
          );
      } catch (error) {
        console.log("Caught error in /acceptCaregiverRequest: " + error);
      }
    };

    const handleChange = (text, input) => {
      setInputs((prevState) => ({ ...prevState, [input]: text }));
    };

    const handleError = (errorMessage, input) => {
      setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
    };

    return (
      <ImageBackground
        source={require("../../assets/images/background-hearts.imageset/background03.png")}
        resizeMode="cover"
        style={GlobalStyle.Background}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            hidden={false}
            translucent={true}
            backgroundColor="black"
          />
          <View
            style={[
              GlobalStyle.Container,
              {
                marginTop: "5%",

                //backgroundColor: "blue",
              },
            ]}
          >
            <View
              style={{
                height: "25%",
                width: "100%",
                //backgroundColor: "red",
                justifyContent: "flex-end",
                marginBottom: "5%",
              }}
            >
              <Text style={GlobalStyle.Subtitle2}>Caregivee Registration</Text>
            </View>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
              <View style={{ height: "80%", width: "100%" }}>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    //backgroundColor: "blue",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={GlobalStyle.Background}>
                      <CustomTextInput
                        placeholder="First Name"
                        iconName="account-outline"
                        label="Name*"
                        error={errors.firstName}
                        onChangeText={(text) => handleChange(text, "firstName")}
                        onFocus={() => {
                          handleError(null, "firstName");
                        }}
                      />
                    </View>
                    <View style={GlobalStyle.Background}>
                      <CustomTextInput
                        placeholder="Last Name"
                        label="  "
                        error={errors.lastName}
                        onChangeText={(text) => handleChange(text, "lastName")}
                        onFocus={() => {
                          handleError(null, "lastName");
                        }}
                      />
                    </View>
                  </View>
                  <CustomTextInput
                    placeholder="(XXX)-XXX-XXXX"
                    iconName="phone-outline"
                    label="Phone*"
                    keyboardType="number-pad"
                    error={errors.phone}
                    onChangeText={(text) =>
                      // Removes everything but numbers, so it complies with the api
                      handleChange(text.replace(/[^0-9]+/g, ""), "phone")
                    }
                    onFocus={() => {
                      handleError(null, "phone");
                    }}
                  />

                  <CustomTextInput
                    placeholder="example@domain.com"
                    iconName="email-outline"
                    label="Email*"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    onChangeText={(text) => handleChange(text, "email")}
                    onFocus={() => {
                      handleError(null, "email");
                    }}
                  />

                  <CustomTextInput
                    placeholder="Password"
                    iconName="lock-outline"
                    label="Password*"
                    error={errors.password}
                    onChangeText={(text) => handleChange(text, "password")}
                    onFocus={() => {
                      handleError(null, "password");
                    }}
                    password
                  />
                </View>
                <View
                  style={{
                    height: "20%",
                    marginTop: "5%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      GlobalStyle.Button,
                      {
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, .2)",
                      },
                    ]}
                    onPress={validate}
                  >
                    <Text style={GlobalStyle.ButtonText}>Create Account</Text>
                  </TouchableOpacity>
                </View>
                <Text> </Text>
                <Text> </Text>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
