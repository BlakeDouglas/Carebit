import {
    StyleSheet,
    SafeAreaView,
    Text,
    Linking,
    View,
    ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function TitleScreen({ navigation }) {
    const createAccountButtonHandler = () => {
        navigation.navigate("RoleSelectScreen");
    };
    const loginButtonHandler = () => {
        navigation.navigate("LoginScreen");
    };

    return (
        <SafeAreaView style={GlobalStyle.SuperContainer}>
            <ImageBackground
                source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
                resizeMode="stretch"
            >
                <View style={GlobalStyle.SubContainer}>
                    <TitleText />

                    <TouchableOpacity
                        style={GlobalStyle.Button}
                        onPress={createAccountButtonHandler}
                    >
                        <Text
                            style={[GlobalStyle.Text, { fontWeight: "bold" }]}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                    <Text></Text>
                    <TouchableOpacity
                        style={GlobalStyle.Button}
                        onPress={loginButtonHandler}
                    >
                        <Text
                            style={[GlobalStyle.Text, { fontWeight: "bold" }]}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
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

const styles = StyleSheet.create({});
