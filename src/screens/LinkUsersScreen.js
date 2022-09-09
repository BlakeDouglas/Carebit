import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  Linking,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import CustomTextInput from "../utils/CustomTextInput";
import React, { useEffect, useState, useCallback } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";

export default function LinkUsersScreen({ navigation }) {
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
      source={require("../../assets/images/background-hearts.imageset/background03.png")} // Edit me if you find a better image~!
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView
        style={[GlobalStyle.Container, { justifyContent: "space-evenly" }]}
      >
        <Text
          style={[GlobalStyle.Subtitle, { fontSize: responsiveFontSize(5.3) }]}
        >
          Connect to Caregivee
        </Text>
        <SafeAreaView
          style={{
            height: "75%",
            width: "100%",
            marginTop: "10%",
            justifyContent: "center",

            //backgroundColor: "green",
          }}
        >
          <SafeAreaView
            style={{
              height: "50%",
              width: "100%",
              alignSelf: "center",
              //backgroundColor: "blue",
              justifyContent: "center",
            }}
          >
            <Text
              style={[GlobalStyle.Text, { fontSize: responsiveFontSize(2.3) }]}
            >
              Send request to Caregivee to begin monitoring them (recommended
              method)
            </Text>
            <SafeAreaView
              style={{
                alignSelf: "center",
                width: "100%",
                //backgroundColor: "blue",
                justifyContent: "center",
                marginTop: "5%",
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
            </SafeAreaView>
            <TouchableOpacity style={[GlobalStyle.Button, { marginTop: "5%" }]}>
              <Text style={GlobalStyle.ButtonText}>Send Request</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView
            style={{ flex: 1, marginTop: "20%", alignItems: "center" }}
          >
            <Text
              style={[GlobalStyle.Text, { fontSize: responsiveFontSize(2.3) }]}
            >
              Proceed without Caregivee having the app SHOW ALERT
            </Text>
            <TouchableOpacity style={[GlobalStyle.Button, { marginTop: "8%" }]}>
              <Text style={GlobalStyle.ButtonText}>Opt Out</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
