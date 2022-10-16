import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-number-input";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomTextInput from "../utils/CustomTextInput";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { setTokenData } from "../redux/actions";

export default function PhysicianInfoScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physName: "",
    physPhone: "",
  });

  const requiredText = " Input required";

  const [errors, setErrors] = useState({});

  const validate = (tokenData) => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.physName) {
      handleError(requiredText, "physName");
      valid = false;
    }
    if (!inputs.physPhone) {
      handleError(requiredText, "physPhone");
      valid = false;
    } else if (
      !inputs.physPhone.match(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      )
    ) {
      handleError(" Invalid phone number", "physPhone");
      valid = false;
    }
    if (valid) {
      registerPhysician(inputs, tokenData);
    }
  };

  const registerPhysician = async (inputs, tokenData) => {
    try {
      let response = await fetch("https://www.carebit.xyz/physician", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify({
          ...inputs,
          caregiveeID: tokenData.caregiveeID,
        }),
      });
      const json = await response.json();
      dispatch(
        setTokenData({
          ...tokenData,
          physName: json.cgvee.physName,
          physPhone: json.cgvee.physPhone,
        })
      );
    } catch (error) {
      console.log("Caught error in /physician: " + error);
    }
  };

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ height: windowHeight, width: windowWidth }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />

        <View
          style={[
            GlobalStyle.Container,
            {
              marginTop: "25%",
              marginLeft: "5%",
              marginRight: "5%",
              //backgroundColor: "blue",
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "18%", width: "100%" }}>
              <Text
                style={[
                  GlobalStyle.Subtitle,
                  { fontSize: responsiveFontSize(5.1) },
                ]}
              >
                Physician Contact
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView>
            <View
              style={{
                marginTop: "6%",
                height: "80%",
                width: "100%",
              }}
            >
              <CustomTextInput
                placeholder="Physician's Name"
                iconName="account-outline"
                label="Physician's Name*"
                error={errors.physName}
                onChangeText={(text) => handleChange(text, "physName")}
                onFocus={() => {
                  handleError(null, "physName");
                }}
              />
              {/*==============NEW PHONE NUMBER BOX WITH COUNTRY CODE ============================*/}
              <View style={{ marginTop: "4%" }}>
                <Text style={{ color: "white", marginBottom: "1%" }}>
                  Physician's Number*
                </Text>
                <PhoneInput
                  defaultCode={"US"}
                  pickerBackgroundColor={"white"}
                  containerStyle={{
                    backgroundColor: "transparent",
                    marginBottom: "4%",
                    borderWidth: 1.0,
                    borderColor: "rgba(255, 255, 255, .25)",
                    alignItems: "center",
                    width: "100%",
                  }}
                  textContainerStyle={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    paddingHorizontal: "3%",
                    borderColor: "rgba(255, 255, 255, .5)",
                  }}
                  textInputStyle={{
                    color: "white",
                  }}
                  textInputProps={{
                    placeholderTextColor: "rgba(255, 255, 255, .5)",
                  }}
                  codeTextStyle={{
                    color: "rgba(255, 255, 255, .5)",
                  }}
                  placeholder="(XXX) XXX - XXXX"
                  onChangeText={(text) =>
                    // Removes everything but numbers, so it complies with the api
                    // TODO: Handle this differently
                    handleChange(text.replace(/[^0-9]+/g, ""), "phone")
                  }
                />
              </View>
              <View style={{ width: "100%", marginTop: "12%" }}>
                <TouchableOpacity
                  style={[
                    GlobalStyle.Button,
                    {
                      backgroundColor: "rgba(255, 255, 255, .2)",
                    },
                  ]}
                  onPress={() => {
                    validate(tokenData);
                  }}
                >
                  <Text style={GlobalStyle.ButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
