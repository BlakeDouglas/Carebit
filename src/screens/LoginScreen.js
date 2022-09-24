import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import CustomTextInput from "../utils/CustomTextInput";
import {
  setPhysicianData,
  setSelectedUser,
  setTokenData,
  setUserData,
} from "../redux/actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";

// The outside variable is a boolean to see if login is called within our outside LoginScreen.js
export const login = async (email, password, dispatch, outside) => {
  const body = JSON.stringify({ email, password });
  try {
    let response = await fetch("https://www.carebit.xyz/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    });
    const json = await response.json();
    if (json.access_token !== undefined) {
      SecureStore.setItemAsync("carebitcredentials", body);
      fetchUserData(json, dispatch);
      dispatch(setTokenData({ ...json, selected: 0 }));
    } else {
      if (outside) {
        await SecureStore.deleteItemAsync("carebitcredentials");
        console.log("Saved credentials are invalid. Removing...");
      } else if (json.message === "Email not found")
        handleError(" Email not found", "email");
      else {
        handleError(" Incorrect password", "password");
      }
    }
  } catch (error) {
    console.log("Caught error in /login: " + error);
  }
};

export const fetchUserData = async (jsonTokenData, dispatch) => {
  try {
    let url = "https://www.carebit.xyz/user/" + jsonTokenData.userID;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jsonTokenData.access_token,
      },
    });
    const json = await response.json();
    dispatch(
      setUserData({
        firstName: json.user.firstName,
        lastName: json.user.lastName,
        email: json.user.email,
        phone: json.user.phone,
        mobilePlatform: json.user.mobilePlatform,
      })
    );
    if (json.user.physName !== undefined)
      dispatch(
        setPhysicianData({
          physName: json.user.physName,
          physPhone: json.user.physPhone,
          physStreet: json.user.physStreet,
          physCity: json.user.physCity,
          physState: json.user.physState,
          physZip: json.user.physZip,
        })
      );
  } catch (error) {
    console.log("Caught error in /user: " + error);
  }
};

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
      login(inputs.email, inputs.password, dispatch, false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
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
                autoCapitalize="none"
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
                    marginTop: "8%",
                  },
                ]}
                onPress={validate}
              >
                <Text style={GlobalStyle.ButtonText}>Log In</Text>
              </TouchableOpacity>
              <Text></Text>
            </SafeAreaView>
            <Text></Text>
            <Text></Text>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
