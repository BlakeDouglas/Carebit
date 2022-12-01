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
import { moderateScale } from "react-native-size-matters";
import validator from "validator";
import { phone } from "phone";
import { getDefaultEndpoint, physicianEndpoint } from "../network/CarebitAPI";
import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
export default function ModifiedPhysScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physName: "",
    physPhone: "",
  });
  const requiredText = " Input required";

  const [errors, setErrors] = useState({});

  // Validates all input fields before sending to back end
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
      registerPhysician();
    }
  };

  // Sends physician info for caregivee 'shell' account
  const registerPhysician = async () => {
    if (!selectedUser.caregiveeID) {
      console.log(
        "selectedUser.caregiveeID is not defined. Canceling registration"
      );
      dispatch(setTokenData({ ...tokenData, authPhase: 2 }));
    }
    const params = {
      body: {
        ...inputs,
        caregiveeID: selectedUser.caregiveeID,
        caregiverID: tokenData.caregiverID,
      },
      auth: tokenData.access_token,
    };
    const json = await physicianEndpoint(params);

    if (json.cgvee) {
      await getDefault();
      dispatch(setTokenData({ ...tokenData, authPhase: 5 }));
    } else console.log("Error on /physician: ", json.error);
  };
  // Returns default user to change authPhase
  const getDefault = async () => {
    const params = {
      auth: tokenData.access_token,
      body: { caregiverID: tokenData.caregiverID, caregiveeID: null },
    };
    const json = await getDefaultEndpoint(params);

    if (json.error) {
      if (json.error.startsWith("request not")) {
        dispatch(resetSelectedData());
      } else {
        console.log("Error getting default: ", json.error);
      }
      return;
    }

    if (json.default) {
      dispatch(setSelectedUser(json.default));
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
  const { fontScale } = useWindowDimensions();
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
              marginTop: "25%",
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
