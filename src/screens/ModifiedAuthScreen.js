import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Alert,
  LogBox,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import GlobalStyle from "../utils/GlobalStyle";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setSelectedUser, setTokenData } from "../redux/actions";
import { deleteKeychain, getAuthRequest } from "../network/Auth";
import {
  acceptRequestEndpoint,
  createRequestEndpoint,
  caregiveeCreateEndpoint,
  logoutEndpoint,
} from "../network/CarebitAPI";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function ModifiedAuthScreen({ navigation }) {
  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));

  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);

  const [request, response, promptAsync] = getAuthRequest();

  // If success from Fitbit, finish caregivee account
  React.useEffect(() => {
    if (response?.type === "success") {
      makeCaregivee(response.params.code, selectedUser.userID);
    }
  }, [response]);

  // Adds caregiveeID to caregivee if success from Fitbit
  const makeCaregivee = async (code, userID) => {
    const params = {
      auth: tokenData.access_token,
      body: {
        authCode: code,
        userID: userID,
        caregiverID: tokenData.caregiverID,
      },
    };
    const json = await caregiveeCreateEndpoint(params);

    if (json.caregiveeID !== undefined) {
      dispatch(
        setSelectedUser({ ...selectedUser, caregiveeID: json.caregiveeID })
      );
      await makeRequest();
    } else
      Alert.alert("Error", json.error, json.error_0, [
        { text: "Ok", onPress: () => {}, style: "cancel" },
      ]);
  };

  // Auto send link request between the two accounts so they don't need to log in
  const makeRequest = async () => {
    if (!tokenData.phone || !selectedUser.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? {
            caregiveePhone: tokenData.phone,
            caregiverPhone: selectedUser.phone,
            sender: tokenData.type,
          }
        : {
            caregiverPhone: tokenData.phone,
            caregiveePhone: selectedUser.phone,
            sender: tokenData.type,
          };
    const params = { auth: tokenData.access_token, body: body };
    const json = await createRequestEndpoint(params);

    if (json.error) {
      if (json.error === "This request already exists") {
        handleError("  Already added", "phone");
      } else {
        handleError("  Not Found", "phone");
      }
    }

    if (json.request) {
      console.log("\nSending accept request: ");
      console.log(json.request.caregiveeID);
      console.log(tokenData.caregiverID);
      console.log("End of sent\n\n");
      await acceptRequest(json.request.caregiveeID, tokenData.caregiverID);
    }
  };

  // Auto accept the request so they don't need to log in
  const acceptRequest = async (caregiveeID, caregiverID) => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiveeID: caregiveeID,
        caregiverID: caregiverID,
      },
    };
    const json = await acceptRequestEndpoint(params);
    if (!json.error) {
      dispatch(
        setTokenData({
          ...tokenData,
          authPhase: 4,
        })
      );
    } else console.log("Error accepting request: ", json.error);
  };

  const [errors, setErrors] = useState({});
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  // Log out handler in case you get stuck on this screen
  const logOutButtonHandler = async () => {
    const json = await logoutEndpoint({
      auth: tokenData.access_token,
      targetID: tokenData.userID,
    });
    if (json.error) {
      console.log("Failed /logout: ", json.error);
    }

    deleteKeychain();
    dispatch(resetData());
  };
  // Fixes accessibility zoom issue
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={GlobalStyle.Container}>
          {/* Title container */}
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
              style={{ marginRight: scale(5) }}
              source={require("../../assets/images/midCheck/icons-check.png")}
            />
            <Text
              style={{
                fontSize: moderateScale(21, 0.8) / fontScale,
                color: "white",
              }}
            >
              Account Created
            </Text>
          </SafeAreaView>
          {/* Description container */}
          <SafeAreaView
            style={{
              height: moderateScale(30),
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "white",
                fontSize: moderateScale(19.2) / fontScale,
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
            {/* Link Fitbit button */}
            <TouchableOpacity
              style={[GlobalStyle.Button]}
              onPress={() => {
                if (!selectedUser.userID)
                  dispatch(setTokenData({ ...tokenData, authPhase: 2 }));
                else promptAsync();
              }}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: moderateScale(19.4) / fontScale },
                ]}
              >
                Link Fitbit
              </Text>
            </TouchableOpacity>
            {/* Cancel button to log out */}
            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                {
                  marginTop: scale(15),
                  backgroundColor: "transparent",
                },
              ]}
              onPress={() => {
                logOutButtonHandler();
              }}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: moderateScale(19.4) / fontScale },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
