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

import { Provider, useSelector, useDispatch } from "react-redux";
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
  const token = useSelector((state) => state.Reducers.authToken);
  const dispatch = useDispatch();
  console.log(token);

  return (
    <NavigationContainer>
      {token === true ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
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
  const careType = useSelector((state) => state.Reducers.careType);
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
          component={careType === true ? GiverHomeScreen : GiveeHomeScreen}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={
            careType === true ? GiverSettingsScreen : GiveeSettingsScreen
          }
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default App;
