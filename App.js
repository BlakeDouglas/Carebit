import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import TitleScreen from "./src/screens/TitleScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AccountCreationScreen from "./src/screens/AccountCreationScreen";
import GiveeHomeScreen from "./src/screens/GiveeHomeScreen";
import GiverHomeScreen from "./src/screens/GiverHomeScreen";
import GiveeSettingsScreen from "./src/screens/GiveeSettingsScreen";
import GiverSettingsScreen from "./src/screens/GiverSettingsScreen";
import PhysicianInfoScreen from "./src/screens/PhysicianInfoScreen";

import { Provider, useSelector } from "react-redux";
import { Store } from "./src/redux/store";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const [loaded] = useFonts({
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }

  return (
    <Provider store={Store}>
      <RootNavigation />
    </Provider>
  );
};

const RootNavigation = () => {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const physicianData = useSelector((state) => state.Reducers.physicianData);

  // Issue is as follows: tokendata.type becomes undefined at some point
  return (
    <NavigationContainer>
      {tokenData.access_token === "" ? (
        <AuthStack />
      ) : tokenData.type === "Caregivee" &&
        physicianData.physicianName === "" ? (
        <MiddleStack />
      ) : (
        <HomeStack />
      )}
    </NavigationContainer>
  );
};

// Stack of screens to handle little things between authentication and the home screen,
// like physician data, first-time instructions, etc
const MiddleStack = () => {
  const physicianData = useSelector((state) => state.Reducers.physicianData);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          headerTintColor: "#fff",
          title: "",
        }}
      >
        <Stack.Screen
          name="PhysicianInfoScreen"
          component={PhysicianInfoScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          headerTintColor: "#fff",
          title: "",
        }}
      >
        <Stack.Screen name="TitleScreen" component={TitleScreen} />
        <Stack.Screen name="RoleSelectScreen" component={RoleSelectScreen} />
        <Stack.Screen
          name="AccountCreationScreen"
          component={AccountCreationScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  return (
    <Tab.Navigator>
      <Tab.Group
        screenOptions={{
          headerShown: false,
          title: "",
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={
            tokenData.type === "Caregiver" ? GiverHomeScreen : GiveeHomeScreen
          }
        />
        <Tab.Screen
          name="SettingsScreen"
          component={
            tokenData.type === "Caregiver"
              ? GiverSettingsScreen
              : GiveeSettingsScreen
          }
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default App;
