// Credit for the code in this file goes to kymzTech's youtube tutorial

import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PhoneInput from "react-native-phone-number-input";

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

  return (
    <View
      style={{
        marginBottom: phone ? "0%" : "4%",
        marginTop: phone ? "3%" : "0%",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={style.label}>{label}</Text>
        {error && (
          <Text
            style={{
              color: "red",
              fontSize: responsiveFontSize(1.9),
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
            fontSize: responsiveFontSize(2.15),
          }}
          countryPickerButtonStyle={{
            marginRight: "-6.5%",
          }}
          textInputProps={{
            placeholderTextColor: "rgba(255, 255, 255, .5)",
          }}
          codeTextStyle={{
            color: "white",
            fontSize: responsiveFontSize(2),
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
            style={{ height: 22, width: 22, marginRight: 10 }}
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
              fontSize: responsiveFontSize(2.15),
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
                style={{ height: 22, width: 22 }}
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
    fontSize: responsiveFontSize(1.9),
    color: "white",
  },
  inputContainer: {
    height: 55,
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingHorizontal: "3%",
    borderWidth: 1.5,
    alignItems: "center",
  },
});

export default CustomTextInput;
