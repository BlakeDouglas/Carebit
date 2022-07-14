import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function RoleSelectScreen({ navigation }) {
    const caregiverCreateAccountButtonHandler = () => {
        navigation.navigate("AccountCreationScreen", { careType: true });
    };

    const caregiveeCreateAccountButtonHandler = () => {
        navigation.navigate("AccountCreationScreen", { careType: false });
    };
    return (
        <SafeAreaView style={GlobalStyle.Container}>
            <View>
                <Text style={[GlobalStyle.Subtitle, { paddingTop: 100 }]}>
                    Choose Your
                </Text>
                <Text style={GlobalStyle.Title}>Role</Text>
                <Text
                    style={[
                        GlobalStyle.Text,
                        { paddingTop: 30, paddingBottom: 30 },
                    ]}
                >
                    To create your account, let us know if you're giving care or
                    are being cared for
                </Text>
            </View>

            <TouchableOpacity
                style={GlobalStyle.Button}
                onPress={caregiverCreateAccountButtonHandler}
            >
                <Text style={[GlobalStyle.Text, { fontWeight: "bold" }]}>
                    I'm Caregiving
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={GlobalStyle.Button}
                onPress={caregiveeCreateAccountButtonHandler}
            >
                <Text
                    style={[
                        GlobalStyle.Text,
                        { fontWeight: "bold", paddingTop: 20 },
                    ]}
                >
                    I'm Reveiving Care
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
