import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Alert,
  LogBox,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import {response} from '../network/Authprocess';
import { makeRequest } from "../network/Carebitapi";
export default function ModifiedAuthScreen({ navigation, route }) {
  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));

  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);

 
  React.useEffect(async () => {
    if (response?.type === "success") {
      console.log(
        "\nSuccess on Fitbit Auth. Data being sent to makeCaregivee: "
      );
    
      const json  = await makeCaregivee(response.params.code, route.params.json.userID);

      if (json.caregiveeID !== undefined) {
        const makeRequest_json  = await makeRequest(tokenData, route);

        if (makeRequest_json.error) {
          console.log(makeRequest_json.error);
          // TODO: Prettify these errors.
          if (makeRequest_json.error === "This request already exists") {
            handleError("  Already added", "phone");
          } else {
            handleError("  Not Found", "phone");
          }
        }
  
        if (makeRequest_json.request) {
          const json = await acceptRequest(json.request.caregiveeID, tokenData.caregiverID);
          if (json.request.caregiveeID) {
            console.log("acceptRequest" + JSON.stringify(json));
            navigation.navigate("ModifiedPhysScreen", json.request);
          }
          if (json.error)
            console.log("Error is probably invalid uri in backend. Maybe not tho");
        }
      } else
        Alert.alert("Error", json.error, json.error_0, [
          { text: "Ok", onPress: () => {}, style: "cancel" },
        ]);
    }
  }, [response]);

 

  const [errors, setErrors] = useState({});
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const logOutButtonHandler = async () => {
    await SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
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
          <SafeAreaView
            style={{
              width: "100%",
              height: "15%",
              flexDirection: "row",
              marginTop: "25%",
              alignItems: "center",
            }}
          >
            <Image
              style={{ marginRight: "1%" }}
              source={require("../../assets/images/midCheck/icons-check.png")}
            />
            <Text style={{ fontSize: responsiveFontSize(2.8), color: "white" }}>
              Account Created
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "15%",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "white",
                fontSize: responsiveFontSize(2.5),
              }}
            >
              Link the Caregivee's Fitbit account to provide the Caregiver
              monitoring access
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              width: "100%",
              height: "20%",
              marginTop: "15%",
              justifyContent: "flex-start",
            }}
          >
            <TouchableOpacity
              style={[GlobalStyle.Button]}
              onPress={() => {
                promptAsync();
              }}
            >
              <Text style={GlobalStyle.ButtonText}>Link Fitbit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                { marginTop: 20, backgroundColor: "transparent" },
              ]}
              onPress={() => {
                logOutButtonHandler();
              }}
            >
              <Text style={GlobalStyle.ButtonText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
