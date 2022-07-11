import { StyleSheet, SafeAreaView } from "react-native";

import GlobalStyle from "../utils/GlobalStyle";

export default function RoleSelectScreen() {
    return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        alignItems: "center",
    },
});
