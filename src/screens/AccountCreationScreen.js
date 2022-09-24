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
import { setTokenData, setUserData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function AccountCreationScreen({ navigation }) {
  // These are the two tools of the redux state manager. Use them instead of hooks
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
    }

    if (valid) {
      register();
    }
  };

  const register = async () => {
    const output = {
      ...inputs,
      type: tokenData.type,
      mobilePlatform: Platform.OS,
    };
    const body = {
      email: inputs.email,
      password: inputs.password,
    };
    try {
      let response = await fetch("https://www.carebit.xyz/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
      });
      const json = await response.json();
      if (json.access_token !== undefined) {
        dispatch(setUserData({ ...output, password: undefined }));
        dispatch(setTokenData({ ...tokenData, ...json, selected: 0 }));
        await SecureStore.setItemAsync(
          "carebitcredentials",
          JSON.stringify(body)
        );
      } else if (json.error === "Phone number already exists.") {
        handleError(" Phone Number already exists", "phone");
        console.log(json.error);
      } else {
        handleError(" Invalid email", "email");
        console.log(json.error);
      }
    } catch (error) {
      console.log("Caught error in /user: " + error);
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
      source={require("../../assets/images/background-hearts.imageset/background03.png")} // Edit me if you find a better image~!
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
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
            <Text style={GlobalStyle.Subtitle2}>
              {tokenData.type.charAt(0).toUpperCase() +
                tokenData.type.slice(1) +
                " Registration"}
            </Text>
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

const styles = StyleSheet.create({});
