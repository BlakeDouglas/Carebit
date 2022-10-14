// Credit for the code in this file goes to kymzTech's youtube tutorial

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

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
  return (
    <View style={{ marginBottom: "4%" }}>
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
      <View
        style={[
          style.inputContainer,
          { borderColor: error ? "red" : "rgba(255, 255, 255, .25)" },
        ]}
      >
        <Icon
          name={iconName}
          style={{
            fontSize: responsiveFontSize(2.8),
            color: "white",
            marginRight: "3%",
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
            fontSize: responsiveFontSize(2.15),
          }}
          placeholderTextColor="rgba(255, 255, 255, .5)"
          secureTextEntry={hidePassword}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => {
              setHidePassword(!hidePassword);
            }}
            style={{ fontSize: responsiveFontSize(2.8), color: "white" }}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
          />
        )}
      </View>
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
