import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomTextInput from "../utils/CustomTextInput";
export default function AddScreen({ navigation }) {
  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const [inputs, setInputs] = useState({
    addUser: "",
  });
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const [errors, setErrors] = useState({});
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")} // Edit me if you find a better image~!
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="#000000"
        />
        <ScrollView style={{ marginTop: "25%", flex: 1 }}>
          <SafeAreaView
            style={{
              height: "20%",
              alignSelf: "center",
              width: "100%",
              //backgroundColor: "blue",
              alignItems: "center",
            }}
          >
            <Text style={[GlobalStyle.Subtitle, { alignSelf: "center" }]}>
              {typeOfRequester === "caregivee"
                ? "Add Caregivee"
                : "Add Caregiver"}
            </Text>
          </SafeAreaView>

          <SafeAreaView
            style={{
              marginTop: "15%",
              height: "20%",
              width: "100%",
              //backgroundColor: "red",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: responsiveFontSize(2.5), color: "white" }}>
              {typeOfRequester === "caregivee"
                ? "Please enter your Caregivee's phone number to add them"
                : "Please enter your Caregiver's phone number to add them"}
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "80%",
              width: "80%",
              alignSelf: "center",

              justifyContent: "center",
            }}
          >
            <CustomTextInput
              label={
                typeOfRequester === "caregivee"
                  ? "Caregivee's Phone Number"
                  : "Caregiver's Phone Number"
              }
              placeholder="(XXX) XXX-XXXX"
              iconName="phone-outline"
              keyboardType="number-pad"
              error={errors.addUser}
              onChangeText={(text) =>
                handleChange(text.replace(/[^0-9]+/g, ""), "addUser")
              }
              onFocus={() => {
                handleError(null, "addUser");
              }}
            />
            <TouchableOpacity style={[GlobalStyle.Button, { marginTop: "8%" }]}>
              <Text style={GlobalStyle.ButtonText}>Send Request</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
