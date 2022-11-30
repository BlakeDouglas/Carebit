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
import { resetData, setTokenData } from "../redux/actions";
import validator from "validator";
import { phone } from "phone";
import { logoutEndpoint, physicianEndpoint } from "../network/CarebitAPI";
import { moderateScale } from "react-native-size-matters";
import { deleteKeychain } from "../network/Auth";

export default function PhysicianInfoScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physName: "",
    physPhone: "",
  });
  const { fontScale } = useWindowDimensions();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [errors, setErrors] = useState({});

  // Validates all input fields before sending to back end
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    let phoneData = phone(inputs.physPhone);
    if (!phoneData.isValid) {
      handleError(" Invalid Number", "physPhone");
      valid = false;
    } else {
      inputs.physPhone = phoneData.phoneNumber;
    }
    if (valid) {
      registerPhysician();
    }
  };

  // Sends physician info to back end
  const registerPhysician = async () => {
    // If you somehow got here without giveeID, then log out
    if (!tokenData.caregiveeID) {
      if (tokenData.userID)
        await logoutEndpoint({
          auth: tokenData.access_token,
          targetID: tokenData.userID,
        });

      await deleteKeychain();
      dispatch(resetData());
      return;
    }
    const params = {
      body: {
        ...inputs,
        caregiveeID: tokenData.caregiveeID,
        caregiverID: null,
      },
      auth: tokenData.access_token,
    };
    const json = await physicianEndpoint(params);

    if (json.cgvee) {
      dispatch(
        setTokenData({
          ...tokenData,
          physName: json.cgvee.physName,
          physPhone: json.cgvee.physPhone,
          authPhase: 8,
        })
      );
    } else console.log("Error registering physician: ", json.error);
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
      <SafeAreaView style={{ height: windowHeight, width: windowWidth }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        {/* Title container */}
        <View
          style={[
            GlobalStyle.Container,
            {
              marginLeft: "5%",
              marginRight: "5%",
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ height: "18%", width: "100%" }}>
              <Text
                style={[
                  GlobalStyle.Subtitle,
                  { fontSize: moderateScale(39.5) / fontScale },
                ]}
              >
                Physician Contact
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
              {/* Create account button container */}
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
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: moderateScale(19.4) / fontScale },
                    ]}
                  >
                    Create Account
                  </Text>
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
