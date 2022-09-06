import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";

export default function AccountCreationScreen({ navigation, route }) {
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")} // Edit me if you find a better image~!
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={GlobalStyle.Container}>
        <Text style={GlobalStyle.Subtitle}>Activity Level</Text>
        <SafeAreaView style={styles.TextBox}>
          <Text style={styles.DescriptiveText}>
            Choose the usual level of activity for your Caregivee
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            backgroundColor: "green",
            width: "100%",
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SafeAreaView style={styles.InnerContainers}></SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  TextBox: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  DescriptiveText: {
    fontSize: responsiveFontSize(2.2),
    color: "white",
  },
  InnerContainers: {
    marginTop: "8%",
    height: "15%",
    width: "100%",
    borderTopColor: "lightgray",
    borderTopWidth: 1,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    alignItems: "center",
    flexDirection: "row",
  },
});
