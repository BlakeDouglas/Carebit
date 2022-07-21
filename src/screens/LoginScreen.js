import {
    StyleSheet,
    Text,
    SafeAreaView,
    TextInput,
    View,
    ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";

export default function LoginScreen() {
    return (
        <ImageBackground
            source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
            resizeMode="stretch"
            style={GlobalStyle.Background}
        >
            <SafeAreaView style={[GlobalStyle.Container1, { paddingTop: 100 }]}>
                <Text style={[GlobalStyle.Title, { paddingBottom: 20 }]}>
                    Log In
                </Text>
                <TextInput
                    style={GlobalStyle.InputBox}
                    placeholder="Username"
                />
                <TextInput
                    secureTextEntry={true}
                    style={GlobalStyle.InputBox}
                    placeholder="Password"
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({});
