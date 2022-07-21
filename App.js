import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TitleScreen from "./src/screens/TitleScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AccountCreationScreen from "./src/screens/AccountCreationScreen";

import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TitleScreen"
          component={TitleScreen}
          options={{
            headerTransparent: true,
            headerTintColor: "#fff",
            title: "",
          }}
        />
        <Stack.Screen
          name="RoleSelectScreen"
          component={RoleSelectScreen}
          options={{
            headerTransparent: true,
            headerTintColor: "#fff",
            title: "",
          }}
        />
        <Stack.Screen
          name="AccountCreationScreen"
          component={AccountCreationScreen}
          options={{
            headerTransparent: true,
            headerTintColor: "#fff",
            title: "",
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerTransparent: true,
            headerTintColor: "#fff",
            title: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
