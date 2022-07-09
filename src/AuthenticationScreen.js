import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, TextInput } from "react-native";

export default function AuthenticationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Carebit</Text>
            <Text style={styles.subtitle}>Remote caregiving</Text>

            <SafeAreaView style={styles.auth_container}>
                <TextInput style={styles.input_box}> </TextInput>
                <TextInput style={styles.input_box}> </TextInput>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        alignItems: "center",
    },
    auth_container: {
        backgroundColor: "grey",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "black",
    },
    title: {
        paddingTop: 100,
        fontSize: 60,
        color: "white",
    },
    subtitle: {
        padding: 30,
        fontSize: 16,
        color: "white",
    },
    input_box: {
        borderColor: "black",
        borderWidth: 1,
        minWidth: 150,
        backgroundColor: "white",
    },
});
