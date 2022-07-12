import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TitleScreen from "./src/screens/TitleScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import LoginScreen from "./src/screens/LoginScreen";

import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
    const [loaded] = useFonts({
        RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
    });
    if (!loaded) {
        return null;
    }

    // TODO: Need to implement navigation between screens
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Title"
                    component={TitleScreen}
                    options={{ header: () => null }}
                />
                <Stack.Screen
                    name="Role Select"
                    component={RoleSelectScreen}
                    options={{ header: () => null }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ header: () => null }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
