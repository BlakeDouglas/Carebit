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
import { setTokenData } from "../redux/actions";
import validator from "validator";
import { phone } from "phone";
import { physicianEndpoint } from "../network/CarebitAPI";

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

  const registerPhysician = async () => {
    const params = {
      body: {
        ...inputs,
        caregiveeID: tokenData.caregiveeID,
      },
      auth: tokenData.access_token,
    };
    const json = await physicianEndpoint(params);

    // TODO: Error handling
    dispatch(
      setTokenData({
        ...tokenData,
        physName: json.cgvee.physName,
        physPhone: json.cgvee.physPhone,
        authPhase: 8,
      })
    );
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
                      { fontSize: responsiveFontSize(2.51) / fontScale },
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
