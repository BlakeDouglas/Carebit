import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import validator from "validator";
import { phone } from "phone";
import { userEndpoint } from "../network/CarebitAPI";
import { setKeychain } from "../network/Auth";

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
    } else if (!validator.isEmail(inputs.email)) {
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

    let phoneData = phone(inputs.phone);

    if (!phoneData.isValid) {
      handleError(" Invalid Number", "phone");
      valid = false;
    } else {
      inputs.phone = phoneData.phoneNumber;
    }

    if (!validator.isStrongPassword(inputs.password, { minSymbols: 0 })) {
      valid = false;
      if (!inputs.password) {
        handleError(requiredText, "password");
      } else if (inputs.password.length < 8) {
        handleError(" Too short (8 minimum)", "password");
      } else if (!/[0-9]/.test(inputs.password)) {
        handleError(" Must contain a number", "password");
      } else if (!/[A-Z]/.test(inputs.password)) {
        handleError(" Must contain capital", "password");
      } else {
        handleError(" Invalid password", "password");
      }
    }

    if (valid) {
      register();
    }
  };

  const register = async () => {
    const body = {
      ...inputs,
      type: tokenData.type,
      mobilePlatform: Platform.OS,
    };

    const storageBody = {
      email: inputs.email,
      password: inputs.password,
    };
    const json = await userEndpoint(body);
    if (json.error) {
      if (json.error === "Phone number already exists.") {
        handleError(" Phone number taken", "phone");
        console.log(json.error);
      } else if (json.error === "Email already exists.") {
        handleError(" Email taken", "email");
        console.log(json.error);
      } else if (json.error === "Phone length.") {
        handleError(" Invalid phone", "phone");
        console.log(json.error);
      } else if (json.error === "Email is not valid") {
        handleError(" Invalid email", "email");
        console.log(json.error);
      } else {
        handleError(" Error creating account", "email");
        console.log(json.error);
      }
    } else {
      dispatch(
        setTokenData({
          ...tokenData,
          ...json,
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          email: inputs.email,
        })
      );
      setKeychain(storageBody);
    }
  };

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <View
          style={[
            GlobalStyle.Container,
            {
              marginTop: "0%",

              //backgroundColor: "blue",
            },
          ]}
        >
          <View
            style={{
              height: "22%",
              width: "100%",
              //backgroundColor: "red",
              justifyContent: "flex-end",
              marginBottom: "8%",
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle2,
                { fontSize: responsiveFontSize(3.71) / fontScale },
              ]}
            >
              {tokenData.type.charAt(0).toUpperCase() +
                tokenData.type.slice(1) +
                " Registration"}
            </Text>
          </View>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
          >
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
                      onChangeText={(text) =>
                        handleChange(validator.trim(text), "firstName")
                      }
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
                      onChangeText={(text) =>
                        handleChange(validator.trim(text), "lastName")
                      }
                      onFocus={() => {
                        handleError(null, "lastName");
                      }}
                    />
                  </View>
                </View>
                <CustomTextInput
                  label="Phone*"
                  error={errors.phone}
                  onChangeFormattedText={(text) => {
                    handleChange(text, "phone");
                    handleError(null, "phone");
                  }}
                  phone
                />

                <CustomTextInput
                  placeholder="example@domain.com"
                  iconName="email-outline"
                  label="Email*"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  onChangeText={(text) =>
                    handleChange(validator.trim(text), "email")
                  }
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
                  marginTop: "7%",
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
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: responsiveFontSize(2.51) / fontScale },
                    ]}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
