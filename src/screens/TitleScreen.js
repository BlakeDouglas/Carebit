import {
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import GlobalStyle from "../utils/GlobalStyle";
import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
import { loginEndpoint, getDefaultEndpoint } from "../network/CarebitAPI";
import { deleteKeychain, getKeychain } from "../network/Auth";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function TitleScreen({ navigation }) {
  const dispatch = useDispatch();
  // Sends user to RoleSelectScreen once they choose their account type
  const createAccountButtonHandler = () => {
    navigation.navigate("RoleSelectScreen");
  };
  // Sends user to LoginScreen when they log out
  const loginButtonHandler = () => {
    navigation.navigate("LoginScreen");
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  // Login endpoint
  const login = async (body) => {
    const json = await loginEndpoint(body);
    if (json.access_token !== undefined) {
      getDefault(json);
      if (json.caregiveeID && json.caregiveeID.length === 0)
        json.caregiveeID = null;
      dispatch(setTokenData(json));
    } else {
      deleteKeychain();
      console.log("Saved credentials are invalid. Removing...");
    }
  };
  // Endpoint for setting default person's data to view
  const getDefault = async (tokenJson) => {
    const body =
      tokenJson.type === "caregiver"
        ? { caregiverID: tokenJson.caregiverID, caregiveeID: null }
        : { caregiverID: null, caregiveeID: tokenJson.caregiveeID };
    const params = { auth: tokenJson.access_token, body: body };
    const json = await getDefaultEndpoint(params);

    if (json.error) {
      if (json.error.startsWith("request not")) {
        dispatch(resetSelectedData());
      } else {
        console.log("Error getting default: ", json.error);
      }
      return;
    }

    if (json.default) {
      dispatch(setSelectedUser(json.default));
    }
  };

  // Async Storage for user credentials
  // Makes user not have to sign in every time they open the app
  const fetchCredentials = async () => {
    try {
      const credentials = await getKeychain();
      if (credentials) {
        const json = JSON.parse(credentials);
        login({ email: json.email, password: json.password });
      }
    } catch (error) {
      console.log("Error accessing credentials: ", error);
    }
  };
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Set status bar color and properties. Fixes Android UI issue*/}
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={GlobalStyle.Container}>
          {/* Title Container */}
          <SafeAreaView style={{ width: "100%", height: "22%" }}>
            <Text
              style={[
                GlobalStyle.Subtitle,
                { fontSize: responsiveFontSize(6.3) / fontScale },
              ]}
            >
              Welcome to
            </Text>
            <Text
              style={[
                GlobalStyle.Title,
                { fontSize: responsiveFontSize(6.95) / fontScale },
              ]}
            >
              Carebit
            </Text>
          </SafeAreaView>
          {/* Text body Container */}
          <SafeAreaView
            style={{
              height: "35%",
              width: "100%",
              marginTop: "5%",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <Text
              style={[
                GlobalStyle.Text,
                { fontSize: responsiveFontSize(2.51) / fontScale },
              ]}
            >
              Carebit uses Fitbit devices to monitor the heart rate and activity
              of you or your loved one {"\n\n"}If you or your loved one's Fitbit
              is not set up, visit{" "}
              <Text
                onPress={() => Linking.openURL("https://www.fitbit.com/start")}
                style={[
                  GlobalStyle.Text,
                  {
                    textDecorationLine: "underline",
                    fontSize: responsiveFontSize(2.51) / fontScale,
                  },
                ]}
              >
                fitbit.com/start
              </Text>
            </Text>
          </SafeAreaView>

          {/* Log in and make account button container */}
          <SafeAreaView style={{ width: "100%", height: "22%" }}>
            {/* Button to create an account along with onPress navigation */}
            <TouchableOpacity
              style={GlobalStyle.Button}
              onPress={createAccountButtonHandler}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: responsiveFontSize(2.51) / fontScale },
                ]}
              >
                Create an Account
              </Text>
            </TouchableOpacity>
            {/* Log in button and navigation to log in page handler */}
            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                { backgroundColor: "transparent", marginTop: "7%" },
              ]}
              onPress={loginButtonHandler}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: responsiveFontSize(2.51) / fontScale },
                ]}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
