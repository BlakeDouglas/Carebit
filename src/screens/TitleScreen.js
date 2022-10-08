import {
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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

export default function TitleScreen({ navigation }) {
  const dispatch = useDispatch();
  const createAccountButtonHandler = () => {
    navigation.navigate("RoleSelectScreen");
  };
  const loginButtonHandler = () => {
    navigation.navigate("LoginScreen");
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const login = async (email, password) => {
    const body = JSON.stringify({ email, password });
    try {
      let response = await fetch("https://www.carebit.xyz/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      });
      const json = await response.json();
      if (json.access_token !== undefined) {
        getDefault(json);
        dispatch(setTokenData(json));
        SecureStore.setItemAsync("carebitcredentials", body);
      } else {
        SecureStore.deleteItemAsync("carebitcredentials");
        console.log("Saved credentials are invalid. Removing...");
      }
    } catch (error) {
      console.log("Caught error in /login in title screen: " + error);
    }
  };

  const getDefault = async (tokenJson) => {
    const body =
      tokenJson.type === "caregiver"
        ? { caregiverID: tokenJson.caregiverID, caregiveeID: null }
        : { caregiverID: null, caregiveeID: tokenJson.caregiveeID };
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getDefaultRequest",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenJson.access_token,
          },
          body: JSON.stringify(body),
        }
      );
      const responseText = await response.text();
      const json = JSON.parse(responseText);

      // Accounts for array return value
      // Accounts for no-default scenario
      // Accounts for no-default causing an error scenario
      if (json.default) {
        if (json.default[0]) dispatch(setSelectedUser(json.default[0]));
        else dispatch(setSelectedUser(json.default));
      } else {
        const cgveeArray = tokenJson.caregiveeID;
        const res = cgveeArray.filter((iter) => iter.status === "accepted");
        if (res[0]) dispatch(setSelectedUser(res[0]));
        else dispatch(resetSelectedData());
      }
    } catch (error) {
      console.log(
        "Caught error in /getDefaultRequest on title screen: " + error
      );
    }
  };

  const fetchCredentials = async (key) => {
    try {
      const credentials = await SecureStore.getItemAsync("carebitcredentials");
      if (credentials) {
        const json = JSON.parse(credentials);
        login(json.email, json.password, dispatch, true);
      }
    } catch (error) {
      console.log("Error accessing credentials: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={GlobalStyle.Container}>
          <Text style={GlobalStyle.Subtitle}>Welcome to</Text>
          <Text style={GlobalStyle.Title}>Carebit</Text>
          <SafeAreaView
            style={{
              height: "35%",
              width: "100%",
              marginTop: "5%",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <Text style={GlobalStyle.Text}>
              Carebit uses Fitbit devices to monitor the heart rate and activity
              of you or your loved one {"\n\n"}If you or your loved one's Fitbit
              is not set up, visit{" "}
              <Text
                onPress={() => Linking.openURL("https://www.fitbit.com/start")}
                style={[
                  GlobalStyle.Text,
                  {
                    textDecorationLine: "underline",
                  },
                ]}
              >
                fitbit.com/start
              </Text>
            </Text>
          </SafeAreaView>

          <TouchableOpacity
            style={GlobalStyle.Button}
            onPress={createAccountButtonHandler}
          >
            <Text style={GlobalStyle.ButtonText}>Create an Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyle.Button,
              { backgroundColor: "transparent", marginTop: "7%" },
            ]}
            onPress={loginButtonHandler}
          >
            <Text style={GlobalStyle.ButtonText}>Log In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
