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
import { setPhysicianData } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

export default function PhysicianInfoScreen({ navigation }) {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    physicianName: "",
    physicianPhone: "",
    physicianStreet: "",
    physicianCity: "",
    physicianState: "",
    physicianZipCode: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (
      inputs.physicianPhone !== "" &&
      !inputs.physicianPhone.match(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      )
    ) {
      handleError(" Invalid phone number", "physicianPhone");
      valid = false;
    }
    if (valid) {
      dispatch(setPhysicianData(inputs));
      // TODO: Also handle fetch / asynch storage here
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
            label="Physician's Name"
            onChangeText={(text) => handleChange(text, "physicianName")}
          />
          <CustomTextInput
            placeholder="(XXX) XXX-XXXX"
            iconName="phone-outline"
            label="Physician's Number"
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
            onChangeText={(text) => handleChange(text, "physicianStreet")}
          />

          <CustomTextInput
            placeholder="e.g. London"
            //iconName="phone-outline"
            label="City"
            onChangeText={(text) => handleChange(text, "physicianCity")}
          />
          <View style={{ flexDirection: "row" }}>
            <View style={[GlobalStyle.Background]}>
              <CustomTextInput
                placeholder="e.g. Florida"
                //iconName="phone-outline"
                label="State"
                onChangeText={(text) => handleChange(text, "physicianState")}
              />
            </View>
            <View style={[GlobalStyle.Background]}>
              <CustomTextInput
                placeholder="e.g. 90210"
                //iconName="phone-outline"
                label="Zipcode"
                keyboardType="number-pad"
                onChangeText={(text) => handleChange(text, "physicianZipCode")}
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
