import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";

import { NavigationActions } from "react-navigation";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";

import GlobalStyle from "../utils/GlobalStyle";

export default function AccountCreationScreen({ navigation, route }) {
  const loginButtonHandler = () => {
    navigation.dispatch({
      ...CommonActions.reset({
        index: 0,
        routes: [
          { name: careType ? "GiverTabNavigator" : "GiveeTabNavigator" },
        ],
      }),
    });

    // Also pull data and authenticate
  };

  // careType will be a boolean, true for "caregiver" and false for "caregivee"
  const careType = route.params?.careType;

  // TODO: BIG MAJOR BUG. DO PRESSABLES FROM PREVIOUS SCREENS STILL HAVE INTERACTABILITY
  // I CLICKED SOMEWHERE ON ROLE SELECT AND IT OPENED THE HYPERLINK ON TITLE SCREEN
  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={GlobalStyle.Container}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={[GlobalStyle.Container, { marginTop: 110 }]}>
              <Text style={GlobalStyle.Subtitle}>
                {careType ? "Caregiver" : "Caregivee"}
              </Text>
              <Text style={[GlobalStyle.Title, { marginBottom: 55 }]}>
                Account
              </Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
