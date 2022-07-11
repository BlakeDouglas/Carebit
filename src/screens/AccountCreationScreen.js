import { StyleSheet, Text, SafeAreaView, TextInput, View } from "react-native";

import GlobalStyle from "../utils/GlobalStyle";

export default function AccountCreationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Carebit</Text>
            <Text style={styles.subtitle}>Remote caregiving</Text>

            <View style={styles.auth_container}>
                <Text style={styles.label}> Username: </Text>
                <TextInput style={styles.input_box}> </TextInput>
                <Text style={styles.label}> Password: </Text>
                <TextInput secureTextEntry={true} style={styles.input_box} />
            </View>
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
        alignItems: "baseline",
        padding: 30,
        paddingTop: 15,
    },
    input_box: {
        borderColor: "black",
        borderWidth: 1,
        minWidth: 150,
        backgroundColor: "white",
        padding: 5,
    },
});
