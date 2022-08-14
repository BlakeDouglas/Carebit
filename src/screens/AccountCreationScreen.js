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

import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { setTokenData, setUserData } from "../redux/actions";

export default function AccountCreationScreen({ navigation, route }) {
  // These are the two tools of the redux state manager. Use them instead of hooks
  const careType = useSelector((state) => state.Reducers.tokenData.type);
  const dispatch = useDispatch();

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
      handleError("Please enter your email", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Invalid email", "email");
      valid = false;
    }

    if (!inputs.firstName) {
      handleError("Please enter your first name", "firstName");
      valid = false;
    }

    if (!inputs.lastName) {
      handleError("Please enter your last name", "lastName");
      valid = false;
    }

    if (!inputs.phone) {
      handleError("Please enter your phone number", "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError("Invalid phone number", "phone");
      valid = false;
    }

    if (!inputs.password) {
      handleError("Please enter your password", "password");
      valid = false;
    } else if (inputs.password.length < 5) {
      handleError("Your password is too short", "password");
      valid = false;
    } else if (!/[0-9]/.test(inputs.password)) {
      handleError("Password must contain a number", "password");
      valid = false;
    }

    if (valid) {
      register();
    }
  };

  const register = () => {
    setInputs((prevState) => ({
      ...prevState,
      ["type"]: careType,
      ["mobilePlatform"]: Platform.OS,
    }));

    fetch("https://www.carebit.xyz/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.access_token !== undefined) {
          console.log(json);
          // Clever line using span to exclude password etc from the userdata
          const { type, password, ...output } = inputs;
          dispatch(setUserData(output));
          dispatch(setTokenData(json));
        } else {
          handleError(
            "An account is already associated with this email",
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={GlobalStyle.Background}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <SafeAreaView style={[GlobalStyle.Container, { marginTop: 80 }]}>
              <Text style={GlobalStyle.Subtitle2}>
                {careType + " Registration"}
              </Text>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={GlobalStyle.Background}>
                  <CustomTextInput
                    placeholder="First Name"
                    iconName="account-outline"
                    label="Name"
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
                placeholder="Enter your phone number"
                iconName="phone-outline"
                label="Phone"
                keyboardType="phone-pad"
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
                placeholder="Enter your email address"
                iconName="email-outline"
                label="Email"
                keyboardType="email-address"
                error={errors.email}
                onChangeText={(text) => handleChange(text, "email")}
                onFocus={() => {
                  handleError(null, "email");
                }}
              />

              <CustomTextInput
                placeholder="Enter your password"
                iconName="lock-outline"
                label="Password"
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
                    marginTop: 60,
                    marginBottom: 30,
                  },
                ]}
                onPress={validate}
              >
                <Text style={GlobalStyle.ButtonText}>Create Account</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
