import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function RoleSelectScreen({ navigation }) {
  const caregiverCreateAccountButtonHandler = () => {
    navigation.navigate("AccountCreationScreen", { careType: true });
  };

  const caregiveeCreateAccountButtonHandler = () => {
    navigation.navigate("AccountCreationScreen", { careType: false });
  };
  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={[GlobalStyle.Container, { paddingTop: 100 }]}>
        <Text style={GlobalStyle.Subtitle}>Choose Your</Text>
        <Text style={GlobalStyle.Title}>Role</Text>
        <Text style={[GlobalStyle.Text, { paddingTop: 35, paddingBottom: 50 }]}>
          To create your account, let us know if you're giving care or are being
          cared for
        </Text>
        <TouchableOpacity
          style={[GlobalStyle.Button, { marginBottom: 12 }]}
          onPress={caregiverCreateAccountButtonHandler}
        >
          <Text style={GlobalStyle.ButtonText}>I'm Caregiving</Text>
        </TouchableOpacity>
        <Text />
        <TouchableOpacity
          style={GlobalStyle.Button}
          onPress={caregiveeCreateAccountButtonHandler}
        >
          <Text style={GlobalStyle.ButtonText}>I'm Receiving Care</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
