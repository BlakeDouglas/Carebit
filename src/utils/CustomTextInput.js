// Credit for the code in this file goes to kymzTech's youtube tutorial

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
    <View style={{ marginBottom: 15 }}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          { borderColor: error ? "red" : "rgba(255, 255, 255, .25)" },
        ]}
      >
        <Icon
          name={iconName}
          style={{ fontSize: 22, color: "white", marginRight: 10 }}
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
          placeholderTextColor="white"
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
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 15,
            marginTop: 3,
            fontFamily: "RobotoBold",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
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
