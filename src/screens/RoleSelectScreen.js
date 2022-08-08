import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

import { useSelector, useDispatch } from "react-redux";
import { setCareType } from "../redux/actions";

export default function RoleSelectScreen({ navigation }) {
  const dispatch = useDispatch();

  const caregiverCreateAccountButtonHandler = () => {
    dispatch(setCareType("caregiver"));
    navigation.navigate("AccountCreationScreen");
  };

  const caregiveeCreateAccountButtonHandler = () => {
    dispatch(setCareType("caregivee"));
    navigation.navigate("AccountCreationScreen");
  };
  return (
    <ImageBackground
      source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={[GlobalStyle.Container, { marginTop: 120 }]}>
        <Text style={GlobalStyle.Subtitle}>Choose Your</Text>
        <Text style={GlobalStyle.Title}>Role</Text>
        <Text style={[GlobalStyle.Text, { marginTop: 35, marginBottom: 75 }]}>
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
