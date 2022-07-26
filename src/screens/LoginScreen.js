import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function LoginScreen() {
  const loginButtonHandler = () => {
    //navigation.navigate("DashboardScreen");
  };

  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={[GlobalStyle.Container, { marginTop: 150 }]}>
        <Text style={[GlobalStyle.Title, { marginBottom: 50 }]}>Log into Carebit</Text>
        <TextInput 
          style={GlobalStyle.InputBox} 
          placeholder="Email" 
          placeholderTextColor="white"
          />
        <TextInput
          secureTextEntry={true}
          style={[GlobalStyle.InputBox, {marginTop: 40}]}
          placeholder="Password"
          placeholderTextColor = "white"
        />
        <TouchableOpacity
          style={[
            GlobalStyle.Button,
            { backgroundColor: "rgba(255, 255, 255, .2)", marginTop: 68 },
          ]}
          onPress={loginButtonHandler}
        >
          <Text style={GlobalStyle.ButtonText}>Log In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
