import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AccountCreationScreen from "./src/screens/AccountCreationScreen";
import ActivityLevelScreen from "./src/screens/ActivityLevelScreen";
import AddIntroScreen from "./src/screens/AddIntroScreen";
import AddOptionsScreen from "./src/screens/AddOptionsScreen";
import AddScreen from "./src/screens/AddScreen";
import AuthenticationScreen from "./src/screens/AuthenticationScreen";
import CustomNotificationScreen from "./src/screens/CustomNotificationScreen";
import GiveeHomeScreen from "./src/screens/GiveeHomeScreen";
import GiveeReceivedAlertsScreen from "./src/screens/GiveeReceivedAlertsScreen";
import GiveeSettingsScreen from "./src/screens/GiveeSettingsScreen";
import GiverHomeScreen from "./src/screens/GiverHomeScreen";
import GiverSettingsScreen from "./src/screens/GiverSettingsScreen";
import LinkUsersScreen from "./src/screens/LinkUsersScreen";
import ListOfFriendsScreen from "./src/screens/ListOfFriendsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ModifiedAuthScreen from "./src/screens/ModifiedAuthScreen";
import ModifiedActivityScreen from "./src/screens/ModifiedActivityScreen";
import ModifiedCaregiveeAccountCreation from "./src/screens/ModifiedCaregiveeAccountCreation";
import ModifiedPhysScreen from "./src/screens/ModifiedPhysScreen";
import PhysicianInfoScreen from "./src/screens/PhysicianInfoScreen";
import ReceivedAlertsScreen from "./src/screens/ReceivedAlertsScreen";
import RequestScreen from "./src/screens/RequestScreen";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import SettingsOverviewScreen from "./src/screens/SettingsOverviewScreen";
import TitleScreen from "./src/screens/TitleScreen";
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Store } from "./src/redux/store";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { Menu, Divider, Provider as Provider2 } from "react-native-paper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { getRequestCount } from "./src/network/CarebitAPI";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { setTokenData } from "./src/redux/actions";
import { getFontScale } from "react-native/Libraries/Utilities/PixelRatio";

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
  return (
    <NavigationContainer>
      {tokenData.authPhase === 0 ? (
        <AuthStack />
      ) : tokenData.authPhase === 2 || tokenData.authPhase === 9 ? (
        <HomeStack />
      ) : (
        <MiddleStack />
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

// Stack of screens to handle little things between authentication and the home screen,
// like phys data, first-time instructions, etc
const MiddleStack = () => {
  const { fontScale } = useWindowDimensions();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          headerTintColor: "#fff",
          title: "",
        }}
      >
        {tokenData.authPhase === 6 && (
          <Stack.Screen
            name="AuthenticationScreen"
            component={AuthenticationScreen}
          />
        )}
        {tokenData.authPhase === 1 && (
          <Stack.Screen
            name="LinkUsersScreen"
            component={LinkUsersScreen}
            options={({ navigation }) => ({
              headerTransparent: true,
              headerTitleAlign: "center",

              headerStyle: {
                backgroundColor: "transparent",
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() =>
                    dispatch(setTokenData({ ...tokenData, authPhase: 2 }))
                  }
                  style={{ marginRight: "8%" }}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.5) / fontScale,
                      color: "white",
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
        )}
        {tokenData.authPhase === 10 && (
          <Stack.Screen
            name="ModifiedCaregiveeAccountCreation"
            component={ModifiedCaregiveeAccountCreation}
          />
        )}

        {tokenData.authPhase === 3 && (
          <Stack.Screen
            name="ModifiedAuthScreen"
            component={ModifiedAuthScreen}
          />
        )}
        {tokenData.authPhase === 4 && (
          <Stack.Screen
            name="ModifiedPhysScreen"
            component={ModifiedPhysScreen}
          />
        )}
        {tokenData.authPhase === 7 && (
          <Stack.Screen
            name="PhysicianInfoScreen"
            component={PhysicianInfoScreen}
          />
        )}
        {(tokenData.authPhase === 5 || tokenData.authPhase === 8) && (
          <Stack.Screen
            name="ModifiedActivityScreen"
            component={ModifiedActivityScreen}
          />
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const [visible, setVisible] = React.useState(false);
  const [visibleAlert, setVisibleAlert] = React.useState(false);

  // Endpoint to check requests
  const showAlert = async () => {
    const params = {
      auth: tokenData.access_token,
      selfID:
        tokenData.type === "caregivee"
          ? tokenData.caregiveeID
          : tokenData.caregiverID,
    };
    const json = await getRequestCount(params);
    const responseText = JSON.parse(json);

    // Boolean to decide when to show the alert icons
    responseText.pendingRequestCount
      ? setVisibleAlert(true)
      : setVisibleAlert(false);
  };
  const { fontScale } = useWindowDimensions();
  const openMenu = () => setVisible(true);
  // Refreshes every x seconds to check if a friend request exists
  // If one does, set visibleAlert to true to show the alert icons
  useEffect(() => {
    const toggle = setInterval(() => {
      showAlert();
    }, 10000);
    return () => clearInterval(toggle);
  });

  useEffect(() => {
    showAlert();
  });
  const closeMenu = () => setVisible(false);
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
          name="HomeScreen"
          component={
            tokenData.type === "caregivee" ? GiveeHomeScreen : GiverHomeScreen
          }
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
              fontSize: responsiveFontSize(2.5) / fontScale,
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
                    // Sets color of the opened menu
                    contentStyle={{ backgroundColor: "white" }}
                    // Icons/Text shown to open the menu
                    anchor={
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // Need to check if there are any alerts everytime you open the menu
                          // Helps handle accepting a request before a refresh
                          onPress={() => (openMenu(), showAlert())}
                        >
                          <Image
                            style={{
                              height: 28,
                              width: 28,
                              alignSelf: "center",
                            }}
                            source={require("./assets/images/moreIcon/menu.png")}
                          />
                        </TouchableOpacity>
                        {visibleAlert && (
                          <Image
                            source={require("./assets/images/alerts/shakeAlert.png")}
                            style={{
                              width: 20,
                              height: 20,
                              tintColor: "white",
                            }}
                          />
                        )}
                      </View>
                    }
                  >
                    {/* Items contained within the menu with functionality */}
                    <Menu.Item
                      leadingIcon={require("./assets/images/avatar/userList.png")}
                      onPress={() => (
                        closeMenu(), navigation.navigate("ListOfFriendsScreen")
                      )}
                      titleStyle={{
                        color: "black",
                        fontSize: responsiveFontSize(1.9) / fontScale,
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
                      trailingIcon={({}) =>
                        visibleAlert && (
                          <Image
                            source={require("./assets/images/alerts/shakeAlert.png")}
                            style={{
                              width: 25,
                              height: 25,

                              tintColor: "dodgerblue",
                            }}
                          />
                        )
                      }
                      // Close the menu, then get rid of the alert.
                      // It will check again if there's an alert when the timer runs out
                      // or when the menu is clicked again
                      onPress={() => (
                        closeMenu(),
                        setVisibleAlert(false),
                        navigation.navigate("RequestScreen")
                      )}
                      titleStyle={{
                        color: "black",
                        fontSize: responsiveFontSize(1.9) / fontScale,
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
                        fontSize: responsiveFontSize(1.9) / fontScale,
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
                onPress={() => [
                  closeMenu(),
                  navigation.navigate("SettingsScreen"),
                ]}
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
            tokenData.type === "caregiver"
              ? GiverSettingsScreen
              : GiveeSettingsScreen
          }
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
              fontSize: responsiveFontSize(2.5) / fontScale,
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Alert Settings",
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
              fontSize: responsiveFontSize(2.5) / fontScale,
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Alert Settings",
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
              fontSize: responsiveFontSize(2.5) / fontScale,
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Friend Requests",

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
              fontSize: responsiveFontSize(2.5) / fontScale,
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle:
              tokenData.type === "caregiver"
                ? "Linked Caregivees"
                : "Linked Caregiver",
          })}
        />
        <Stack.Screen
          name="ReceivedAlertsScreen"
          component={
            tokenData.type === "caregivee"
              ? GiveeReceivedAlertsScreen
              : ReceivedAlertsScreen
          }
          options={({ navigation }) => ({
            headerTransparent: false,
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
              fontSize: responsiveFontSize(2.5) / fontScale,
            },
            headerStyle: {
              backgroundColor: "dodgerblue",
            },
            headerTitle: "Alert History",
          })}
        />
        <Stack.Screen name="AddScreen" component={AddScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default App;
