import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import TitleScreen from "./src/screens/TitleScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AccountCreationScreen from "./src/screens/AccountCreationScreen";
import GiveeHomeScreen from "./src/screens/GiveeHomeScreen";
import GiverHomeScreen from "./src/screens/GiverHomeScreen";
import AuthenticationScreen from "./src/screens/AuthenticationScreen";
import GiveeSettingsScreen from "./src/screens/GiveeSettingsScreen";
import GiverSettingsScreen from "./src/screens/GiverSettingsScreen";
import PhysicianInfoScreen from "./src/screens/PhysicianInfoScreen";
import RequestScreen from "./src/screens/RequestScreen";
import AddScreen from "./src/screens/AddScreen";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import { Store } from "./src/redux/store";
import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
const Stack = createStackNavigator();
initializeApp(firebaseConfig);

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
  const physData = useSelector((state) => state.Reducers.physData);
  console.log(tokenData);
  return (
    <NavigationContainer>
      {tokenData.access_token === "" ? (
        <AuthStack />
      ) : (tokenData.type !== "caregiver" && !physData.physName) ||
        (tokenData.type !== "caregiver" && !tokenData.caregiveeId) ? (
        <MiddleStack />
      ) : (
        <HomeStack />
      )}
    </NavigationContainer>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          //headerTintColor: "#fff",
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

// Stack of screens to handle little things between authentication and the home screen,
// like phys data, first-time instructions, etc
const MiddleStack = () => {
  const physData = useSelector((state) => state.Reducers.physData);
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
        {tokenData.type !== "caregiver" && !tokenData.caregiveeId && (
          <Stack.Screen
            name="AuthenticationScreen"
            component={AuthenticationScreen}
          />
        )}

        {tokenData.type !== "caregiver" && !physData.physName && (
          <Stack.Screen
            name="PhysicianInfoScreen"
            component={PhysicianInfoScreen}
          />
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          title: "",
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={
            tokenData.type === "caregivee" ? GiveeHomeScreen : GiverHomeScreen
          }
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Carebit",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
                style={{ marginLeft: "5%" }}
              >
                <Image
                  source={require("./assets/images/settings/settings.png")}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={
            tokenData.type === "caregivee"
              ? GiveeSettingsScreen
              : GiverSettingsScreen
          }
        />
        <Stack.Screen name="AddScreen" component={AddScreen} />
        <Stack.Screen
          name="RequestScreen"
          component={RequestScreen}
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Incoming Requests",

            headerRight: () => (
              <Icon
                onPress={() => navigation.navigate("AddScreen")}
                style={{ fontSize: 32, color: "white", marginRight: 20 }}
                name={"account-plus-outline"}
              />
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default App;
