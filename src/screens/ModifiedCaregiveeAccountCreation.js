import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import PhoneInput from "react-native-phone-number-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import CustomTextInput from "../utils/CustomTextInput";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function ModifiedCaregiveeAccountCreation({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const requiredText = " Input required";

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

  const [errors, setErrors] = useState({});
  //console.log(tokenData);
  // Checks for formatting in text fields
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError(requiredText, "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
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

    if (!inputs.phone) {
      handleError(requiredText, "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError(" Invalid phone number", "phone");
      valid = false;
    }
    if (!inputs.password) {
      handleError(requiredText, "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError(" Too short (8 minimum)", "password");
      valid = false;
    } else if (!/[0-9]/.test(inputs.password)) {
      handleError(" Must contain a number", "password");
      valid = false;
    } else if (!/[A-Z]/.test(inputs.password)) {
      handleError(" Must contain capital", "password");
      valid = false;
    }
    if (valid) {
      toggleModal2();
    }
  };

  const registerShellCaregivee = async () => {
    const output = {
      ...inputs,
      type: "caregivee",
      mobilePlatform: "NA",
    };
    try {
      const response = await fetch("https://www.carebit.xyz/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
      });
      const json = await response.json();
      console.log("registerShellCaregivee: " + JSON.stringify(json));
      if (json.access_token) {
        navigation.navigate("ModifiedAuthScreen", { json });
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
    } catch (error) {
      console.log("Caught error in /user: " + error);
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
            height: "30%",
            width: "75%",
            backgroundColor: "white",
            borderRadius: 8,
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
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Opting Out
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
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
                    fontSize: responsiveFontSize(2),
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

              //backgroundColor: "blue",
            },
          ]}
        >
          <View
            style={{
              height: "22%",
              width: "100%",
              //backgroundColor: "red",
              justifyContent: "flex-end",
              marginBottom: "8%",
            }}
          >
            <Text
              style={[
                GlobalStyle.Subtitle2,
                { fontSize: responsiveFontSize(3.71) },
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
                  //backgroundColor: "blue",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={GlobalStyle.Background}>
                    <CustomTextInput
                      placeholder="First Name"
                      iconName="account-outline"
                      label="Name*"
                      error={errors.firstName}
                      onChangeText={(text) => handleChange(text, "firstName")}
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
                      onChangeText={(text) => handleChange(text, "lastName")}
                      onFocus={() => {
                        handleError(null, "lastName");
                      }}
                    />
                  </View>
                </View>
                {/*==============NEW PHONE NUMBER BOX WITH COUNTRY CODE ============================*/}
                <View style={{ marginTop: "4%" }}>
                  <Text style={{ color: "white", marginBottom: "1%" }}>
                    Phone*
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
                <CustomTextInput
                  placeholder="example@domain.com"
                  iconName="email-outline"
                  label="Email*"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  onChangeText={(text) => handleChange(text, "email")}
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
                  marginTop: "7%",
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
