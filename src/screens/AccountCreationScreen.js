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

import GlobalStyle from "../utils/GlobalStyle";

import { useSelector, useDispatch } from "react-redux";
import { Login } from "../redux/actions";

export default function AccountCreationScreen({ navigation, route }) {
  // These are the two tools of the redux state manager. Use them instead of hooks
  const careType = useSelector((state) => state.Reducers.careType);
  const dispatch = useDispatch();

  const loginButtonHandler = () => {
    // TODO: Pull from text inputs, plug into dispatch
    dispatch(Login("evan", "123"));
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
