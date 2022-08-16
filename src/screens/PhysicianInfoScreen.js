import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Keyboard,
  ImageBackground,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomTextInput from "../utils/CustomTextInput";
import { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";

export default function PhysicianInfo({ navigation }) {
  const [inputs, setInputs] = useState({
    physicianName: "",
    physicanPhone: "",
    physicianStreet: "",
    physicianCity: "",
    physicianState: "",
    physicianZipCode: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.physicianName) {
      handleError("Physician's Name Required", "physicianName");
      valid = false;
    }
    if (!inputs.phone) {
      handleError("Phone Number Required", "phone");
      valid = false;
    } else if (
      !inputs.phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      handleError("Invalid phone number", "phone");
      valid = false;
    }
    if (!inputs.physicianStreet) {
      handleError("Physician's Address Required", "physicianStreet");
      valid = false;
    }
    if (!inputs.physicianCity) {
      handleError("Physician's City Required", "physicianCity");
      valid = false;
    }
    if (!inputs.physicianState) {
      handleError("Physician's State Required", "physicianState");
      valid = false;
    }
    if (!inputs.physicianZipCode) {
      handleError("Physician's Zipcode Required", "physicianZipcode");
      valid = false;
    }
    if (valid) {
      physicianUpload;
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
          <Text style={[GlobalStyle.Subtitle, { marginTop: 70 }]}>
            Physician Contact
          </Text>

          <CustomTextInput
            placeholder="Physician's Name"
            iconName="account-outline"
            label="Physician's Name"
            error={errors.name}
            onChangeText={(text) => handleChange(text, "physicianName")}
            onFocus={() => {
              handleError(null, "physicianName");
            }}
          />
          <CustomTextInput
            placeholder="(XXX) XXX-XXXX"
            iconName="phone-outline"
            label="Physician's Number"
            keyboardType="number-pad"
            error={errors.phone}
            onChangeText={(text) =>
              handleChange(text.replace(/[^0-9]+/g, ""), "phone")
            }
            onFocus={() => {
              handleError(null, "Physician's Number");
            }}
          />
          <CustomTextInput
            placeholder="e.g. 111 Lane Road"
            //iconName="phone-outline"
            label="Physician's Street Address"
            error={errors.address}
            onChangeText={(text) => handleChange(text, "physicianStreet")}
            onFocus={() => {
              handleError(null, "physicianStreet");
            }}
          />

          <CustomTextInput
            placeholder="e.g. London"
            //iconName="phone-outline"
            label="City"
            error={errors.city}
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
                error={errors.state}
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
                error={errors.state}
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
