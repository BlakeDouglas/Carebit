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
  TouchableOpacity,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomTextInput from "../utils/CustomTextInput";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import validator from "validator";
import { phone } from "phone";

export default function ModifiedPhysScreen({ navigation, route }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const {fontScale} = useWindowDimensions();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physName: "",
    physPhone: "",
  });
  console.log("\nData on Modified Phy Screen: ");
  console.log(route.params);
  console.log("Above\n\n");
  console.log("Token Data on ModPhys");
  console.log(tokenData);
  console.log("Info above \n\n");
  const requiredText = " Input required";

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    let phoneData = phone(inputs.physPhone);

    if (!inputs.physName) {
      handleError(requiredText, "physName");
      valid = false;
    }

    if (!phoneData.isValid) {
      handleError(" Invalid Number", "physPhone");
      valid = false;
    } else {
      inputs.physPhone = phoneData.phoneNumber;
    }
    if (valid) {
      registerPhysician(inputs);
    }
  };

  const registerPhysician = async (inputs) => {
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
          caregiveeID: route.params.caregiveeID,
        }),
      });
      const json = await response.json();
      if (json.cgvee) {
        getDefault(tokenData);
        navigation.navigate("ModifiedActivityScreen", route.params);
      }
    } catch (error) {
      console.log("Caught error in /physician: " + error);
    }
  };

  const getDefault = async (tokenJson) => {
    const body = { caregiverID: tokenJson.caregiverID, caregiveeID: null };
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getDefaultRequest",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenJson.access_token,
          },
          body: JSON.stringify(body),
        }
      );
      const responseText = await response.text();
      const json = JSON.parse(responseText);

      // Accounts for array return value and missing default scenarios
      if (json.default) {
        if (json.default[0]) dispatch(setSelectedUser(json.default[0]));
        else dispatch(setSelectedUser(json.default));
      } else {
        const array = tokenJson.caregiveeID;
        const res = array.filter((iter) => iter.status === "accepted");
        if (res[0]) dispatch(setSelectedUser(res[0]));
        else dispatch(resetSelectedData());
      }
    } catch (error) {
      console.log(
        "Caught error in /getDefaultRequest on modified phys screen: " + error
      );
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
                  { fontSize: responsiveFontSize(5.1) / fontScale },
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
                onChangeText={(text) =>
                  handleChange(validator.trim(text), "physName")
                }
                onFocus={() => {
                  handleError(null, "physName");
                }}
              />
              <CustomTextInput
                label="Physician's Number*"
                error={errors.physPhone}
                onChangeFormattedText={(text) => {
                  handleChange(text, "physPhone");
                  handleError(null, "physPhone");
                }}
                phone
              />

              <View style={{ width: "100%", marginTop: "12%" }}>
                <TouchableOpacity
                  style={[
                    GlobalStyle.Button,
                    {
                      backgroundColor: "rgba(255, 255, 255, .2)",
                    },
                  ]}
                  onPress={() => {
                    validate();
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
