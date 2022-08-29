import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  View,
  KeyboardAvoidingView,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { setTokenData, setUserData } from "../redux/actions";

export default function AccountCreationScreen({ navigation, route }) {
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
      handleError(requiredText, "email");
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

  const register = () => {
    const output = {
      ...inputs,
      type: tokenData.type,
      mobilePlatform: Platform.OS,
    };
    fetch("https://www.carebit.xyz/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.access_token !== undefined) {
          dispatch(setUserData({ ...output, password: undefined }));
          dispatch(setTokenData({ ...tokenData, ...json }));
        } else {
          handleError(
            "The email could not be registered. It may already exist.",
            "email"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <KeyboardAwareScrollView>
        <View style={GlobalStyle.Inner}>
          <Text
            style={[GlobalStyle.Subtitle2, { marginTop: 70, marginBottom: 40 }]}
          >
            {tokenData.type.charAt(0).toUpperCase() +
              tokenData.type.slice(1) +
              " Registration"}
          </Text>
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

          <TouchableOpacity
            style={[
              GlobalStyle.Button,
              {
                backgroundColor: "rgba(255, 255, 255, .2)",
                marginTop: "8%",
              },
            ]}
            onPress={validate}
          >
            <Text style={GlobalStyle.ButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
