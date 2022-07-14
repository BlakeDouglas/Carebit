import { StyleSheet, Text, SafeAreaView, TextInput, View } from "react-native";

import GlobalStyle from "../utils/GlobalStyle";

export default function AccountCreationScreen({ navigation, route }) {
    // careType will be a boolean, true for "caregiver" and false for "caregivee"
    const careType = route.params?.careType;

    // TODO: BIG MAJOR BUG. DO PRESSABLES FROM PREVIOUS SCREENS STILL HAVE INTERACTABILITY
    // I CLICKED SOMEWHERE ON ROLE SELECT AND IT OPENED THE HYPERLINK ON TITLE SCREEN
    return (
        <SafeAreaView
            style={[GlobalStyle.Container, { alignItems: "baseline" }]}
        >
            <SafeAreaView style={{ paddingTop: 100 }}>
                <Text style={GlobalStyle.Subtitle}>
                    {careType ? "Caregiver" : "Caregivee"}
                </Text>
                <Text style={[GlobalStyle.Title, { paddingBottom: 20 }]}>
                    Account
                </Text>
            </SafeAreaView>
            <TextInput style={GlobalStyle.InputBox} placeholder="Name" />
            <TextInput style={GlobalStyle.InputBox} placeholder="Email" />
            <TextInput style={GlobalStyle.InputBox} placeholder="Phone" />
            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                style={GlobalStyle.InputBox}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        paddingLeft: 30,
        paddingRight: 45,
        alignItems: "center",
    },
});
