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
<<<<<<< Updated upstream
=======
import PhysicianInfoScreen from "./src/screens/PhysicianInfoScreen";
import ChatScreen from "./src/screens/ChatScreen";
>>>>>>> Stashed changes

import { useFonts } from "expo-font";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu69cdb30ONSKMcrIrL7P4YT0ghQoNEdg",
  authDomain: "carebit-48f39.firebaseapp.com",
  databaseURL: "https://carebit-48f39.firebaseio.com",
  projectId: "carebit-48f39",
  storageBucket: "carebit-48f39.appspot.com",
  messagingSenderId: "1042058218989",
  appId: "1:1042058218989:web:f28598ffbacb69e3a9ebe4",
  measurementId: "G-QCBPVPX8QC",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

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

        <Stack.Group
          screenOptions={{
            headerShown: false,
            title: "",
          }}
        >
          <Stack.Screen
            name="GiverTabNavigator"
            component={GiverTabNavigator}
          />
          <Stack.Screen
            name="GiveeTabNavigator"
            component={GiveeTabNavigator}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function GiverTabNavigator() {
  return (
<<<<<<< Updated upstream
    <Tab.Navigator initialRouteName="HomeScreen">
      <Tab.Screen name="HomeScreen" component={GiverHomeScreen} />
      <Tab.Screen name="SettingsScreen" component={GiverSettingsScreen} />
    </Tab.Navigator>
=======
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          title: "",
        }}
      >
        <Stack.Screen name="RoleSelectScreen" component={GiveeHomeScreen} />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerTransparent: false,

            title: "Chatting",
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="AccountCreationScreen"
          component={AccountCreationScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
>>>>>>> Stashed changes
  );
}

function GiveeTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="HomeScreen">
      <Tab.Screen name="HomeScreen" component={GiveeHomeScreen} />
      <Tab.Screen name="SettingsScreen" component={GiveeSettingsScreen} />
    </Tab.Navigator>
  );
}
