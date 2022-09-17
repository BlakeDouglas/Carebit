import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AccountCreationScreen from "./src/screens/AccountCreationScreen";
import ActivityLevelScreen from "./src/screens/ActivityLevelScreen";
import AddScreen from "./src/screens/AddScreen";
import AuthenticationScreen from "./src/screens/AuthenticationScreen";
import CustomNotificationScreen from "./src/screens/CustomNotificationScreen";
import GiveeHomeScreen from "./src/screens/GiveeHomeScreen";
import GiveeSettingsScreen from "./src/screens/GiveeSettingsScreen";
import GiverHomeScreen from "./src/screens/GiverHomeScreen";
import GiverSettingsScreen from "./src/screens/GiverSettingsScreen";
import LinkUsersScreen from "./src/screens/LinkUsersScreen";
import ListOfFriendsScreen from "./src/screens/ListOfFriendsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ModifiedCaregiveeAccountCreation from "./src/screens/ModifiedCaregiveeAccountCreation";
import PhysicianInfoScreen from "./src/screens/PhysicianInfoScreen";
import RequestScreen from "./src/screens/RequestScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import SettingsOverviewScreen from "./src/screens/SettingsOverviewScreen";
import TitleScreen from "./src/screens/TitleScreen";

import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { Provider, useSelector } from "react-redux";
import { Store } from "./src/redux/store";
import { useFonts } from "expo-font";
import * as React from "react";
import { Menu, Divider, Provider as Provider2 } from "react-native-paper";
import { responsiveFontSize } from "react-native-responsive-dimensions";

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
      ) : (tokenData.type === "caregivee" && !physData.physName) ||
        !tokenData.caregiveeID ? (
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
        {tokenData.type !== "caregiver" && !tokenData.caregiveeID && (
          <Stack.Screen
            name="AuthenticationScreen"
            component={AuthenticationScreen}
          />
        )}
        {tokenData.type === "caregiver" && !tokenData.caregiveeID && (
          <Stack.Screen name="LinkUsersScreen" component={LinkUsersScreen} />
        )}
        {tokenData.type === "caregiver" &&
          tokenData.caregiveeID &&
          tokenData.caregiveeID.length === 0 && (
            <Stack.Screen
              name="ModifiedCaregiveeAccountCreation"
              component={ModifiedCaregiveeAccountCreation}
            />
          )}

        {/* TODO: Put some real logic here, or implement elsewhere */}
        {false && (
          <Stack.Screen
            name="ActivityLevelScreen"
            component={ActivityLevelScreen}
          />
        )}
        {tokenData.type === "caregivee" && !physData.physName && (
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
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
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
              <Provider2>
                <View
                  style={{
                    marginTop: Platform.OS === "ios" ? "7%" : "12%",
                    marginLeft: "8%",
                    //alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={{
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={openMenu}
                      >
                        <Image
                          style={{
                            height: 28,
                            width: 28,
                            alignSelf: "center",
                          }}
                          source={require("./assets/images/moreIcon/moreIcon.png")}
                        />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      leadingIcon={require("./assets/images/avatar/userList.png")}
                      onPress={() => (
                        closeMenu(), navigation.navigate("ListOfFriendsScreen")
                      )}
                      titleStyle={{
                        color: "black",
                        fontSize: responsiveFontSize(1.9),
                      }}
                      title={
                        tokenData.type === "caregivee"
                          ? "My Caregivers"
                          : "My Caregivees"
                      }
                    />
                    <Divider />
                    <Menu.Item
                      leadingIcon={require("./assets/images/avatar/outline_people_outline_white_24dp.png")}
                      onPress={() => (
                        closeMenu(), navigation.navigate("RequestScreen")
                      )}
                      titleStyle={{
                        color: "black",
                        fontSize: responsiveFontSize(1.9),
                      }}
                      title="Requests"
                    />
                    <Divider />
                    <Menu.Item
                      leadingIcon={require("./assets/images/avatar/addUser.png")}
                      onPress={() => (
                        closeMenu(), navigation.navigate("AddScreen")
                      )}
                      titleStyle={{
                        color: "black",
                        fontSize: responsiveFontSize(1.9),
                      }}
                      title={
                        tokenData.type === "caregivee"
                          ? "Add Caregiver"
                          : "Add Caregivee"
                      }
                    />
                  </Menu>
                </View>
              </Provider2>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
                style={{ marginRight: "8%" }}
              >
                <Image
                  source={require("./assets/images/settings/settings.png")}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
        <Stack.Screen
          name="SettingsScreen"
          component={
            tokenData.type === "caregivee"
              ? GiveeSettingsScreen
              : GiverSettingsScreen
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
            headerTitle: "Alert Settings",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginLeft: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginRight: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="CustomNotification"
          component={CustomNotificationScreen}
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Alert Settings",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginLeft: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginRight: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
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
            headerTitle: "Friend Requests",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginLeft: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddScreen")}
              >
                <Image
                  style={{
                    width: 28,
                    height: 28,
                    marginRight: "8%",
                  }}
                  source={require("./assets/images/avatar/addUser.png")}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ListOfFriendsScreen"
          component={ListOfFriendsScreen}
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle:
              tokenData.type === "caregiver"
                ? "Linked Caregivees"
                : "Linked Caregiver",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{ marginLeft: "8%" }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2.3), color: "white" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="AddScreen" component={AddScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default App;
