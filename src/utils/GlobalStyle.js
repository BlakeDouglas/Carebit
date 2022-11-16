import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { responsiveFontSize } from "react-native-responsive-dimensions";
export default StyleSheet.create({
  Title: {
    fontSize: responsiveFontSize(6.95),
    fontFamily: "RobotoBold",
    color: "white",
  },
  Subtitle: { fontSize: responsiveFontSize(6.3), color: "white" },
  Text: { fontSize: responsiveFontSize(2.51), color: "white" },
  ButtonText: {
    fontSize: responsiveFontSize(2.51),
    color: "white",
    fontWeight: "bold",
  },
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
    fontSize: responsiveFontSize(4.4),
    color: "white",
  },
  Background: {
    flex: 1,
  },
  Container: {
    flex: 1,
    marginLeft: scale(42),
    marginRight: scale(42),
    marginTop: moderateScale(112, 0.3),
  },
  HeaderText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontSize: 16,
  },
  SettingsContainer: {
    alignSelf: "center",
    width: "80%",
    borderRadius: 15,
    height: "15%",
    margin: "15%",
    marginTop: "3%",

    backgroundColor: "white",
  },
  SettingsText: {
    marginLeft: "10%",
    color: "gray",
    fontSize: 16,
  },
  Inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
});
