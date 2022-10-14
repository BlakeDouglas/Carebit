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
import { setSelectedUser, setTokenData } from "../redux/actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";
import { login } from "../network/Carebitapi";
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
      
      const json  = login(inputs.email, inputs.password, dispatch, false);
      
      if (json.access_token !== undefined) {
        dispatch(setTokenData(json));

        const oppositeType =
          json.type === "caregiver" ? "caregivee" : "caregiver";
        if (
          json[oppositeType + "ID"] &&
          json[oppositeType + "ID"].length !== 0
        ) {
          const selected = json[oppositeType + "ID"].find(
            (iter) => iter.status === "Accepted"
          );
          dispatch(setSelectedUser(selected));
        }

        SecureStore.setItemAsync("carebitcredentials", body);
      } else {
        SecureStore.deleteItemAsync("carebitcredentials");
        console.log("Saved credentials are invalid. Removing...");
      }
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
