import { StyleSheet } from "react-native";

export default StyleSheet.create({
    Title: {
        fontSize: 55,
        fontFamily: "RobotoBold",
        color: "white",
    },
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
        borderColor: "#AAA",
        borderBottomWidth: 1,
        backgroundColor: "transparent",
        margin: 10,
        fontSize: 20,
        color: "#d5eff7",
    },
    Container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        paddingLeft: 30,
        paddingRight: 45,
        alignItems: "center",
    },

    SuperContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
    },

    SubContainer: {
        flex: 1,
        padding: 30,
        alignItems: "center",
    },

    Background: {
        flex: 1,
    },

    Container1: {
        // Change to container
        flex: 1,
        paddingLeft: 30,
        paddingRight: 45,
    },
});
