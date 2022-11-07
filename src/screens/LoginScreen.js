import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import CustomTextInput from "../utils/CustomTextInput";
import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import validator from "validator";
import { getDefaultEndpoint, loginEndpoint } from "../network/CarebitAPI";
import { setKeychain } from "../network/Auth";
import { responsiveFontSize } from "react-native-responsive-dimensions";
export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    if (!inputs.email) {
      handleError(" Please enter your email", "email");
      valid = false;
    } else if (!validator.isEmail(inputs.email)) {
      handleError(" Invalid email", "email");
      valid = false;
    }

    if (!inputs.password) {
      handleError(" Please enter your password", "password");
      valid = false;
    }

    if (valid === true) {
      login(inputs.email, inputs.password);
    }
  };

  const login = async (email, password) => {
    const body = { email: email, password: password };

    const json = await loginEndpoint(body);
    if (json.access_token !== undefined) {
      if (json.caregiveeID && json.caregiveeID.length === 0)
        json.caregiveeID = null;
      getDefault(json);
      dispatch(setTokenData(json));
      setKeychain(body);
    } else {
      if (json.message === "Email not found")
        handleError(" Email not found", "email");
      else {
        handleError(" Incorrect password", "password");
      }
    }
  };

  const getDefault = async (tokenJson) => {
    const body =
      tokenJson.type === "caregiver"
        ? { caregiverID: tokenJson.caregiverID, caregiveeID: null }
        : { caregiverID: null, caregiveeID: tokenJson.caregiveeID };

    const params = { body: body, auth: tokenJson.access_token };

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
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <SafeAreaView style={GlobalStyle.Container}>
            <Text
              style={[
                GlobalStyle.Title,
                { fontSize: responsiveFontSize(6.95) / fontScale },
              ]}
            >
              Log into Carebit
            </Text>
            <SafeAreaView
              style={{
                height: "60%",
                marginTop: "12%",
                justifyContent: "space-evenly",
              }}
            >
              <CustomTextInput
                placeholder="Enter your email address"
                iconName="email-outline"
                label="Email"
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
                placeholder="Enter your password"
                iconName="lock-outline"
                label="Password"
                error={errors.password}
                onChangeText={(text) => handleChange(text, "password")}
                onFocus={() => {
                  handleError(null, "password");
                }}
                password
              />

              <TouchableOpacity
                style={[
                  GlobalStyle.Button,
                  {
                    backgroundColor: "rgba(255, 255, 255, .2)",
                    marginTop: "8%",
                  },
                ]}
                onPress={validate}
              >
                <Text
                  style={[
                    GlobalStyle.ButtonText,
                    { fontSize: responsiveFontSize(2.51) / fontScale },
                  ]}
                >
                  Log In
                </Text>
              </TouchableOpacity>
              <Text></Text>
            </SafeAreaView>
            <Text></Text>
            <Text></Text>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
