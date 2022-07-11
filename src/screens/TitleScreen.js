import { StyleSheet, SafeAreaView, Text, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function TitleScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TitleText />

            <TouchableOpacity style={styles.registerButton}>
                <Text style={[GlobalStyle.Text, { fontWeight: "bold" }]}>
                    Register
                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text
                    style={[
                        GlobalStyle.Text,
                        { fontWeight: "bold", paddingTop: 20 },
                    ]}
                >
                    Login
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const TitleText = () => {
    return (
        <View>
            <Text style={[GlobalStyle.Subtitle, { paddingTop: 100 }]}>
                Welcome to
            </Text>
            <Text style={GlobalStyle.Title}>Carebit</Text>
            <Text
                style={[
                    GlobalStyle.Text,
                    { paddingTop: 30, paddingBottom: 30 },
                ]}
            >
                Carebit uses Fitbit devices to monitor the heart rate and
                activity of you or your loved one {"\n\n"}If you or your loved
                one's Fitbit is not set up, visit{" "}
                <Text
                    onPress={() =>
                        Linking.openURL("https://www.fitbit.com/start")
                    }
                    style={[
                        GlobalStyle.Text,
                        {
                            alignSelf: "flex-end",
                            textDecorationLine: "underline",
                        },
                    ]}
                >
                    fitbit.com/start
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "dodgerblue",
        paddingLeft: 30,
        paddingRight: 45,
        alignItems: "center",
    },
    registerButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "deepskyblue",
        borderRadius: 5,
        padding: 15,
        width: 150,
    },
});
