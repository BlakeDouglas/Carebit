// Credit for the code in this file goes to kymzTech's youtube tutorial

import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PhoneInput from "react-native-phone-number-input";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
const CustomTextInput = ({
  label,
  iconName,
  error,
  password,
  phone,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);
  const imageFile = "../../assets/images/" + iconName + ".png";
  const accountImage = require("../../assets/images/account-outline.png");
  const phoneImage = require("../../assets/images/phone-outline.png");
  const emailImage = require("../../assets/images/email-outline.png");
  const lockImage = require("../../assets/images/lock-outline.png");
  const eyeImage = require("../../assets/images/eye-outline.png");
  const eyeOffImage = require("../../assets/images/eye-off-outline.png");
  const { fontScale } = useWindowDimensions();
  return (
    <View
      style={{
        marginBottom: phone ? "0%" : moderateScale(8),
        marginTop: phone ? moderateScale(8) : "0%",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text
          style={[style.label, { fontSize: moderateScale(19) / fontScale }]}
        >
          {label}
        </Text>
        {error && (
          <Text
            style={{
              color: "red",
              fontSize: moderateScale(15) / fontScale,
              fontFamily: "RobotoBold",
            }}
          >
            {error}
          </Text>
        )}
      </View>
      {phone && (
        <PhoneInput
          {...props}
          placeholder="(XXX) XXX-XXXX"
          defaultCode={"US"}
          placeholderTextColor="rgba(255, 255, 255, .5)"
          containerStyle={{
            backgroundColor: "transparent",
            marginBottom: "4%",
            borderWidth: 1.5,
            borderColor: error ? "red" : "rgba(255, 255, 255, .25)",
            alignItems: "center",
            width: "100%",
          }}
          textContainerStyle={{
            backgroundColor: "transparent",
          }}
          textInputStyle={{
            color: "white",
            fontSize: moderateScale(16) / fontScale,
          }}
          countryPickerButtonStyle={{
            marginRight: moderateScale(-20, 0.9),
          }}
          textInputProps={{
            placeholderTextColor: "rgba(255, 255, 255, .5)",
          }}
          codeTextStyle={{
            color: "white",
            fontSize: moderateScale(16) / fontScale,
          }}
        />
      )}
      {!phone && (
        <View
          style={[
            style.inputContainer,
            { borderColor: error ? "red" : "rgba(255, 255, 255, .25)" },
          ]}
        >
          <Image
            source={
              iconName === "account-outline"
                ? accountImage
                : iconName === "email-outline"
                ? emailImage
                : iconName === "lock-outline"
                ? lockImage
                : accountImage
            }
            style={{
              height: moderateScale(22),
              width: moderateScale(22),
              marginRight: scale(8),
            }}
          />

          <TextInput
            autoCorrect={false}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            style={{
              color: "white",
              flex: 1,
              fontSize: moderateScale(16.5) / fontScale,
            }}
            placeholderTextColor="rgba(255, 255, 255, .5)"
            secureTextEntry={hidePassword}
            {...props}
          />
          {password && (
            <TouchableOpacity
              onPress={() => {
                setHidePassword(!hidePassword);
              }}
            >
              <Image
                source={hidePassword ? eyeOffImage : eyeImage}
                style={{ height: moderateScale(22), width: moderateScale(22) }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginBottom: "1.8%",
    color: "white",
  },
  inputContainer: {
    height: moderateScale(55, 0.3),
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingHorizontal: "3%",
    borderWidth: 1.5,
    alignItems: "center",
  },
});

export default CustomTextInput;
