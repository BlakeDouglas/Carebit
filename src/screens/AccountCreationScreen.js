import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { Register } from "../redux/actions";

export default function AccountCreationScreen({ navigation, route }) {
  // These are the two tools of the redux state manager. Use them instead of hooks
  const careType = useSelector((state) => state.Reducers.careType);
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

  const [name, setName] = useState("");

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

    if (!name) {
      handleError("Please enter your name", "name");
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
    let nameTrimmed = name.trim();
    let splitIndex = nameTrimmed.indexOf(" ");

    let firstName = "";
    let lastName = "";

    // If there is no space, then the entire string is the firstName
    if (splitIndex === -1) {
      firstName = nameTrimmed;
    } else {
      // firstName is the first word in name
      // lastName is every other word, with spaces changed to hyphens

      firstName = nameTrimmed.substring(0, splitIndex);
      lastName = nameTrimmed.substring(splitIndex + 1);
      lastName.replace(/\s+/g, "-");
    }

    setInputs((prevState) => ({
      ...prevState,
      ["type"]: careType,
      ["mobilePlatform"]: Platform.OS,
      ["firstName"]: firstName,
      ["lastName"]: lastName,
    }));

    dispatch(Register(inputs));
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
            <SafeAreaView style={[GlobalStyle.Container, { marginTop: 90 }]}>
              <Text style={GlobalStyle.Subtitle}>
                {(careType ? "Caregiver" : "Caregivee") + " Registration"}
              </Text>
              <CustomTextInput
                placeholder="Enter your name"
                iconName="account-outline"
                label="Name"
                error={errors.name}
                onChangeText={(text) => setName(text)}
                onFocus={() => {
                  handleError(null, "name");
                }}
              />
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
                    marginTop: 15,
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
