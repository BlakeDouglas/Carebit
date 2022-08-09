import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Login } from "../redux/actions";
import CustomTextInput from "../utils/CustomTextInput";

export default function LoginScreen() {
  const careType = useSelector((state) => state.Reducers.careType);
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

    // TODO Error checks go here, set valid to false

    if (valid) {
      let response = dispatch(Login(inputs.email, inputs.password));
      console.log(response);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={[GlobalStyle.Container, { marginTop: "25%" }]}>
          <Text style={[GlobalStyle.Title, { marginBottom: 20 }]}>
            Log into Carebit
          </Text>
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
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
