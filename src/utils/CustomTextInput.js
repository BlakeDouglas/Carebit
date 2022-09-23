// Credit for the code in this file goes to kymzTech's youtube tutorial

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { StyleSheet, Text, Image, TextInput, View } from "react-native";

const CustomTextInput = ({
  label,
  iconName,
  error,
  password,
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

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={{ flexDirection: "row" }}>
        <Text style={style.label}>{label}</Text>
        {error && (
          <Text
            style={{
              color: "red",
              fontSize: 15,
              marginBottom: 5,
              fontFamily: "RobotoBold",
            }}
          >
            {error}
          </Text>
        )}
      </View>
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
              : iconName === "phone-outline"
              ? phoneImage
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
          style={{ color: "white", flex: 1, fontSize: 17 }}
          placeholderTextColor="rgba(255, 255, 255, .5)"
          secureTextEntry={hidePassword}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => {
              setHidePassword(!hidePassword);
            }}
            style={{ fontSize: 22, color: "white" }}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
          />
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 15,
    color: "white",
  },
  inputContainer: {
    height: 55,
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingHorizontal: 15,
    borderWidth: 1.5,
    alignItems: "center",
  },
});

export default CustomTextInput;
