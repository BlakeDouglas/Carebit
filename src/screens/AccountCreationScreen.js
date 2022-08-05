import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Login } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

export default function AccountCreationScreen({ navigation, route }) {
  // These are the two tools of the redux state manager. Use them instead of hooks
  const careType = useSelector((state) => state.Reducers.careType);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginButtonHandler = () => {
    // Switch from Login to new account creation function

    // Uses a default user
    dispatch(Login(username, password));
  };

  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={[GlobalStyle.Container, { marginTop: 110 }]}>
          <Text style={GlobalStyle.Subtitle}>
            {careType ? "Caregiver" : "Caregivee"}
          </Text>
          <Text style={[GlobalStyle.Title, { marginBottom: 55 }]}>Account</Text>
          <TextInput
            placeholderTextColor="white"
            style={[GlobalStyle.InputBox, { marginBottom: 40 }]}
            placeholder="Name"
          />
          <TextInput
            placeholderTextColor="white"
            keyboardType="email-address"
            style={[GlobalStyle.InputBox, { marginBottom: 40 }]}
            placeholder="Email"
            onChangeText={(value) => setUsername(value)}
          />
          <TextInput
            placeholderTextColor="white"
            keyboardType="phone-pad"
            style={[GlobalStyle.InputBox, { marginBottom: 40 }]}
            placeholder="Phone"
          />
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="white"
            style={GlobalStyle.InputBox}
            onChangeText={(value) => setPassword(value)}
          />

          <TouchableOpacity
            style={[
              GlobalStyle.Button,
              { backgroundColor: "rgba(255, 255, 255, .2)", marginTop: 65 },
            ]}
            onPress={loginButtonHandler}
          >
            <Text style={GlobalStyle.ButtonText}>Create Account</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
