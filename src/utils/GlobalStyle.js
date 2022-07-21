import { StyleSheet } from "react-native";

export default StyleSheet.create({
  Title: {
    fontSize: 55,
    fontFamily: "RobotoBold",
    color: "white",
  },
  Subtitle: { fontSize: 50, color: "white" },
  Text: { fontSize: 20, color: "white" },
  ButtonText: { fontSize: 20, color: "white", fontWeight: "bold" },
  Button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "deepskyblue",
    alignSelf: "center",
    borderRadius: 5,
    padding: 15,
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, .2)",
  },
  InputBox: {
    borderColor: "#AAA",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    margin: 10,
    fontSize: 20,
    color: "#d5eff7",
  },

  Background: {
    flex: 1,
  },

  Container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 45,
  },
});
