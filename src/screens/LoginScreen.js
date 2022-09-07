import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import CustomTextInput from "../utils/CustomTextInput";
import { setTokenData, setUserData } from "../redux/actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    if (!inputs.email) {
      handleError(" Please enter your email", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError(" Invalid email", "email");
      valid = false;
    }

    if (!inputs.password) {
      handleError(" Please enter your password", "password");
      valid = false;
    }

    if (valid === true) {
      login();
    }
  };

  const login = async () => {
    try {
      let response = await fetch("https://www.carebit.xyz/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      });
      const json = await response.json();
      if (json.access_token !== undefined) {
        dispatch(setTokenData(json));
        fetchUserData(json);
      } else {
        if (json.message === " Email not found")
          handleError(" Email not found", "email");
        else handleError(" Incorrect password", "password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async (jsonTokenData) => {
    try {
      let url = "https://www.carebit.xyz/user/" + jsonTokenData.userId;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jsonTokenData.access_token,
        },
      });
      const json = await response.json();
      dispatch(setUserData(json.user));
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <SafeAreaView style={GlobalStyle.Container}>
          <Text style={GlobalStyle.Title}>Log into Carebit</Text>
          <SafeAreaView
            style={{
              height: "60%",
              marginTop: "12%",
              justifyContent: "space-evenly",
            }}
          >
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
                { backgroundColor: "rgba(255, 255, 255, .2)", marginTop: 20 },
              ]}
              onPress={validate}
            >
              <Text style={GlobalStyle.ButtonText}>Log In</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
