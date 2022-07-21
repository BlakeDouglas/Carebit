import {
    StyleSheet,
    Text,
    SafeAreaView,
    TextInput,
    View,
    ImageBackground,
} from "react-native";

import GlobalStyle from "../utils/GlobalStyle";

export default function AccountCreationScreen({ navigation, route }) {
    // careType will be a boolean, true for "caregiver" and false for "caregivee"
    const careType = route.params?.careType;

    // TODO: BIG MAJOR BUG. DO PRESSABLES FROM PREVIOUS SCREENS STILL HAVE INTERACTABILITY
    // I CLICKED SOMEWHERE ON ROLE SELECT AND IT OPENED THE HYPERLINK ON TITLE SCREEN
    return (
        <ImageBackground
            source={require("../../assets/gradient.png")} // Edit me if you find a better image~!
            resizeMode="stretch"
            style={GlobalStyle.Background}
        >
            <SafeAreaView style={[GlobalStyle.Container1, { paddingTop: 100 }]}>
                <Text style={GlobalStyle.Subtitle}>
                    {careType ? "Caregiver" : "Caregivee"}
                </Text>
                <Text style={[GlobalStyle.Title, { paddingBottom: 20 }]}>
                    Account
                </Text>
                <TextInput style={GlobalStyle.InputBox} placeholder="Name" />
                <TextInput style={GlobalStyle.InputBox} placeholder="Email" />
                <TextInput style={GlobalStyle.InputBox} placeholder="Phone" />
                <TextInput
                    secureTextEntry={true}
                    placeholder="Password"
                    style={GlobalStyle.InputBox}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({});
