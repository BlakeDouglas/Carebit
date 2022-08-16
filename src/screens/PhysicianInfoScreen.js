import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ImageBackground,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomTextInput from "../utils/CustomTextInput";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";

export default function PhysicianInfoScreen({ navigation }) {
  const [inputs, setInputs] = useState({
    physicianName: "",
    physicianPhone: "",
    physicianStreet: "",
    physicianCity: "",
    physicianState: "",
    physicianZipCode: "",
  });

  const requiredText = " Input required";

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.physicianName) {
      handleError(requiredText, "physicianName");
      valid = false;
    }
    if (!inputs.physicianPhone) {
      handleError(requiredText, "physicianPhone");
      valid = false;
    } else if (
      !inputs.physicianPhone.match(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      )
    ) {
      handleError(" Invalid phone number", "physicianPhone");
      valid = false;
    }
    if (!inputs.physicianStreet) {
      handleError(requiredText, "physicianStreet");
      valid = false;
    }
    if (!inputs.physicianCity) {
      handleError(requiredText, "physicianCity");
      valid = false;
    }
    if (!inputs.physicianState) {
      handleError(requiredText, "physicianState");
      valid = false;
    }
    if (!inputs.physicianZipCode) {
      handleError(requiredText, "physicianZipCode");
      valid = false;
    }
    if (valid) {
      physicianUpload();
    }
  };

  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const physicianUpload = () => {
    setInputs((prevState) => ({
      ...prevState,
      ["physicianName"]: physicianName,
      ["physicianPhone"]: physicianPhone,
      ["physicianStreet"]: physicianStreet,
      ["physicianCity"]: physicianCity,
      ["physicianState"]: physicianState,
      ["physicianZipCode"]: physicianZipCode,
    }));
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")}
      resizeMode="stretch"
      style={GlobalStyle.Background}
    >
      <KeyboardAwareScrollView>
        <View style={GlobalStyle.Inner}>
          <Text
            style={[
              GlobalStyle.Subtitle,
              { marginTop: 70, fontSize: 40, marginBottom: 30 },
            ]}
          >
            Physician Contact
          </Text>

          <CustomTextInput
            placeholder="Physician's Name"
            iconName="account-outline"
            label="Physician's Name*"
            error={errors.physicianName}
            onChangeText={(text) => handleChange(text, "physicianName")}
            onFocus={() => {
              handleError(null, "physicianName");
            }}
          />
          <CustomTextInput
            placeholder="(XXX) XXX-XXXX"
            iconName="phone-outline"
            label="Physician's Number*"
            keyboardType="number-pad"
            error={errors.physicianPhone}
            onChangeText={(text) =>
              handleChange(text.replace(/[^0-9]+/g, ""), "physicianPhone")
            }
            onFocus={() => {
              handleError(null, "physicianPhone");
            }}
          />
          <CustomTextInput
            placeholder="e.g. 111 Lane Road, STE. 120"
            //iconName="phone-outline"
            label="Physician's Street Address"
            error={errors.physicianStreet}
            onChangeText={(text) => handleChange(text, "physicianStreet")}
            onFocus={() => {
              handleError(null, "physicianStreet");
            }}
          />

          <CustomTextInput
            placeholder="e.g. London"
            //iconName="phone-outline"
            label="City"
            error={errors.physicianCity}
            onChangeText={(text) => handleChange(text, "physicianCity")}
            onFocus={() => {
              handleError(null, "physicianCity");
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <View style={[GlobalStyle.Background]}>
              <CustomTextInput
                placeholder="e.g. Florida"
                //iconName="phone-outline"
                label="State"
                error={errors.physicianState}
                onChangeText={(text) => handleChange(text, "physicianState")}
                onFocus={() => {
                  handleError(null, "physicianState");
                }}
              />
            </View>
            <View style={[GlobalStyle.Background]}>
              <CustomTextInput
                placeholder="e.g. 90210"
                //iconName="phone-outline"
                label="Zipcode"
                keyboardType="number-pad"
                error={errors.physicianZipCode}
                onChangeText={(text) => handleChange(text, "physicianZipCode")}
                onFocus={() => {
                  handleError(null, "physicianZipCode");
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[
              GlobalStyle.Button,
              {
                backgroundColor: "rgba(255, 255, 255, .2)",
                marginTop: 15,
                marginBottom: 30,
              },
            ]}
            onPress={validate}
          >
            <Text style={GlobalStyle.ButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
