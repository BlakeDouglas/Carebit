import {
  Text,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  StatusBar,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import CustomTextInput from "../utils/CustomTextInput";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import validator from "validator";
import { phone } from "phone";
import { userEndpoint } from "../network/CarebitAPI";
import { setSelectedUser, setTokenData } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { moderateScale } from "react-native-size-matters";

export default function ModifiedCaregiveeAccountCreation({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const requiredText = " Input required";
  const dispatch = useDispatch();
  // Content between this point and the return statement
  // are inspired by kymzTech's React Native Tutorial

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    type: "",
    mobilePlatform: "",
  });
  const { fontScale } = useWindowDimensions();
  const [errors, setErrors] = useState({});
  // Checks for formatting in text fields
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError(requiredText, "email");
      valid = false;
    } else if (!validator.isEmail(inputs.email)) {
      handleError(" Invalid email", "email");
      valid = false;
    }

    if (!inputs.firstName) {
      handleError(requiredText, "firstName");
      valid = false;
    }

    if (!inputs.lastName) {
      handleError(requiredText, "lastName");
      valid = false;
    }

    let phoneData = phone(inputs.phone);

    if (!phoneData.isValid) {
      handleError(" Invalid Number", "phone");
      valid = false;
    } else {
      inputs.phone = phoneData.phoneNumber;
    }

    if (!validator.isStrongPassword(inputs.password, { minSymbols: 0 })) {
      valid = false;
      if (!inputs.password) {
        handleError(requiredText, "password");
      } else if (inputs.password.length < 8) {
        handleError(" Too short (8 minimum)", "password");
      } else if (!/[0-9]/.test(inputs.password)) {
        handleError(" Must contain a number", "password");
      } else if (!/[A-Z]/.test(inputs.password)) {
        handleError(" Must contain capital", "password");
      } else {
        handleError(" Invalid password", "password");
      }
    }
    if (valid) {
      toggleModal2();
    }
  };

  const registerShellCaregivee = async () => {
    const body = {
      ...inputs,
      type: "caregivee",
      mobilePlatform: "NA",
      caregiverID: tokenData.caregiverID,
    };
    const json = await userEndpoint(body);
    if (json.access_token) {
      dispatch(
        setTokenData({
          ...tokenData,
          authPhase: 3,
        })
      );
      dispatch(
        setSelectedUser({
          ...selectedUser,
          phone: json.phone,
          userID: json.userID,
        })
      );
    } else if (json.error === "Phone number already exists.") {
      handleError(" Phone number taken", "phone");
      console.log(json.error);
    } else if (json.error === "Email already exists.") {
      handleError(" Email taken", "email");
      console.log(json.error);
    } else {
      handleError(" Invalid email", "email");
      console.log(json.error);
    }
  };

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const [isModal2Visible, setModal2Visible] = useState(false);
  const toggleModal2 = () => {
    setModal2Visible(!isModal2Visible);
  };
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <Modal
        isVisible={isModal2Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: moderateScale(windowHeight / 4, 0.7),
            width: "75%",
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "78%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: moderateScale(17, 0.6) / fontScale,
              }}
            >
              Opting Out
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14, 0.6) / fontScale,
                fontWeight: "400",
                textAlign: "left",
              }}
            >
              By opting out, your caregivee won't need the app. However, please
              have them use this account if they download the app in the future
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "22%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal2();
                  registerShellCaregivee();
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />

        <View
          style={[
            GlobalStyle.Container,
            {
              marginTop: "0%",
            },
          ]}
        >
          <View
            style={{
              height: "22%",
              width: "100%",
              justifyContent: "flex-end",
              marginBottom: moderateScale(22),
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle2,
                { fontSize: moderateScale(36.5) / fontScale },
              ]}
            >
              Caregivee Registration
            </Text>
          </View>
          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View style={{ height: "80%", width: "100%" }}>
              <View
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={GlobalStyle.Background}>
                    <CustomTextInput
                      placeholder="First Name"
                      iconName="account-outline"
                      label="Name*"
                      error={errors.firstName}
                      onChangeText={(text) =>
                        handleChange(validator.trim(text), "firstName")
                      }
                      onFocus={() => {
                        handleError(null, "firstName");
                      }}
                    />
                  </View>
                  <View style={GlobalStyle.Background}>
                    <CustomTextInput
                      placeholder="Last Name"
                      label="  "
                      error={errors.lastName}
                      onChangeText={(text) =>
                        handleChange(validator.trim(text), "lastName")
                      }
                      onFocus={() => {
                        handleError(null, "lastName");
                      }}
                    />
                  </View>
                </View>
                <CustomTextInput
                  label="Phone*"
                  error={errors.phone}
                  onChangeFormattedText={(text) => {
                    handleChange(text, "phone");
                    handleError(null, "phone");
                  }}
                  phone
                />

                <CustomTextInput
                  placeholder="example@domain.com"
                  iconName="email-outline"
                  label="Email*"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  onChangeText={(text) =>
                    handleChange(validator.trim(text), "email")
                  }
                  onFocus={() => {
                    handleError(null, "email");
                  }}
                />

                <CustomTextInput
                  placeholder="Password"
                  iconName="lock-outline"
                  label="Password*"
                  error={errors.password}
                  onChangeText={(text) => handleChange(text, "password")}
                  onFocus={() => {
                    handleError(null, "password");
                  }}
                  password
                />
              </View>
              <View
                style={{
                  height: "20%",
                  marginTop: moderateScale(20),
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={[
                    GlobalStyle.Button,
                    {
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, .2)",
                    },
                  ]}
                  onPress={validate}
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
