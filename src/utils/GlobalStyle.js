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
    borderRadius: 15,
    padding: 15,
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, .2)",
  },
  InputBox: {
    borderColor: "rgba(255, 255, 255, .25)",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    margin: 10,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  Subtitle2: {
    fontSize: 30,
    color: "white",
    marginBottom: 20,
  },
  Background: {
    flex: 1,
  },
  Container: {
    flex: 1,
    marginLeft: 40,
    marginRight: 45,
  },
});
