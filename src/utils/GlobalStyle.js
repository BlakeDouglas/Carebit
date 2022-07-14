import { StyleSheet } from "react-native";

export default StyleSheet.create({
    Title: { fontSize: 55, fontFamily: "RobotoBold", color: "white" },
    Subtitle: { fontSize: 50, color: "white" },
    Text: { fontSize: 20, color: "white" },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "deepskyblue",
        borderRadius: 5,
        padding: 15,
        width: 150,
    },
    InputBox: {
        borderColor: "black",
        borderWidth: 1,
        minWidth: 150,
        backgroundColor: "white",
        padding: 5,
    },
    Container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        paddingLeft: 30,
        paddingRight: 45,
        alignItems: "center",
    },
});
