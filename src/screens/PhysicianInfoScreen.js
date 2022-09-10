import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomTextInput from "../utils/CustomTextInput";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { setPhysicianData } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function PhysicianInfoScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physName: "",
    physPhone: "",
    physStreet: "",
    physCity: "",
    physState: "",
    physZip: "",
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
          caregiveeID: tokenData.caregiveeId,
        }),
      });
      const json = await response.json();
      console.log(json.cgvee);
      dispatch(setPhysicianData(json.cgvee));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <KeyboardAwareScrollView>
          <View
            style={[
              GlobalStyle.Container,
              {
                marginTop: Platform.OS === "ios" ? "25%" : "10%",
                marginLeft: "5%",
                marginRight: "5%",
              },
            ]}
          >
            <View style={{ width: "100%" }}>
              <Text
                style={[
                  GlobalStyle.Subtitle,
                  { fontSize: responsiveFontSize(5.1) },
                ]}
              >
                Physician Contact
              </Text>
            </View>
            <View
              style={{
                marginTop: Platform.OS === "ios" ? "10%" : "4%",
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
              <CustomTextInput
                placeholder="(XXX) XXX-XXXX"
                iconName="phone-outline"
                label="Physician's Number*"
                keyboardType="number-pad"
                error={errors.physPhone}
                onChangeText={(text) =>
                  handleChange(text.replace(/[^0-9]+/g, ""), "physPhone")
                }
                onFocus={() => {
                  handleError(null, "physPhone");
                }}
              />
              <CustomTextInput
                placeholder="e.g. 111 Lane Road, STE. 120"
                //iconName="phone-outline"
                label="Physician's Street Address"
                error={errors.physStreet}
                onChangeText={(text) => handleChange(text, "physStreet")}
                onFocus={() => {
                  handleError(null, "physStreet");
                }}
              />

              <CustomTextInput
                placeholder="e.g. London"
                //iconName="phone-outline"
                label="City"
                error={errors.physCity}
                onChangeText={(text) => handleChange(text, "physCity")}
                onFocus={() => {
                  handleError(null, "physCity");
                }}
              />
              <View style={{ flexDirection: "row" }}>
                <View style={[GlobalStyle.Background]}>
                  <CustomTextInput
                    placeholder="e.g. Florida"
                    //iconName="phone-outline"
                    label="State"
                    error={errors.physState}
                    onChangeText={(text) => handleChange(text, "physState")}
                    onFocus={() => {
                      handleError(null, "physState");
                    }}
                  />
                </View>
                <View style={[GlobalStyle.Background]}>
                  <CustomTextInput
                    placeholder="e.g. 90210"
                    //iconName="phone-outline"
                    label="Zipcode"
                    keyboardType="number-pad"
                    error={errors.physZip}
                    onChangeText={(text) => handleChange(text, "physZip")}
                    onFocus={() => {
                      handleError(null, "physZip");
                    }}
                  />
                </View>
              </View>
              <View style={{ width: "100%", marginTop: "4%" }}>
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
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
