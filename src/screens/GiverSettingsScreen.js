import {
  StyleSheet,
  SafeAreaView,
  Text,
  Linking,
  View,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { React } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Provider, useSelector } from "react-redux";

export default function ChatScreen({ navigation }) {
  const userData = useSelector((state) => state.Reducers.userData);
  console.log(userData.firstName);

  return (
    // Header Container
    <SafeAreaView style={{ flex: 1, backgroundColor: "dodgerblue" }}>
      {/* Holds all header elements */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: "5%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Replace for a button */}
        <Text
          style={{
            marginLeft: "3%",
            color: "white",
            fontSize: 16,
          }}
        >
          HI
        </Text>

        <Text style={GlobalStyle.HeaderText}>Alert Settings</Text>

        {/* Replace for a button */}
        <Text
          style={{
            textAlign: "right",
            marginRight: "3%",
            color: "white",
            fontSize: 16,
          }}
        >
          HI
        </Text>
      </View>
      {/* Background Container for whole screen */}
      <SafeAreaView
        style={{
          marginTop: "4%",
          height: "100%",
          backgroundColor: "whitesmoke",
        }}
      >
        <Text
          style={[
            GlobalStyle.SettingsText,
            {
              marginTop: "20%",
            },
          ]}
        >
          Caregiver
        </Text>
        {/* Container for Caregiver Info */}
        <SafeAreaView
          style={[GlobalStyle.SettingsContainer, { marginBottom: "10%" }]}
        >
          <Text>Hello {userData.firstName}</Text>
        </SafeAreaView>

        <Text style={GlobalStyle.SettingsText}>Caregivee</Text>
        {/* Container for Caregivee Info */}
        <SafeAreaView style={GlobalStyle.SettingsContainer}>
          <Text>Hello {userData.firstName}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}
