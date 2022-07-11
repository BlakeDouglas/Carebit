import { StyleSheet, Text, SafeAreaView, TextInput, View } from "react-native";

import GlobalStyle from "../utils/GlobalStyle";

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={GlobalStyle.Title}>Carebit</Text>
            <Text style={GlobalStyle.Subtitle}>Remote caregiving</Text>

            <View style={styles.auth_container}>
                <Text style={GlobalStyle.Text}> Username: </Text>
                <TextInput style={styles.input_box}> </TextInput>
                <Text style={GlobalStyle.Text}> Password: </Text>
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
