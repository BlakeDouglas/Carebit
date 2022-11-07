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
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
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

  const [request, response, promptAsync] = getAuthRequest();

  React.useEffect(() => {
    if (response?.type === "success") {
      makeCaregivee(response.params.code, tokenData.optedUser.userID);
    }
  }, [response]);

  const makeCaregivee = async (code, userID) => {
    const params = {
      auth: tokenData.access_token,
      body: { authCode: code, userID: userID },
    };
    const json = await caregiveeCreateEndpoint(params);

    if (json.caregiveeID !== undefined) {
      dispatch(
        setTokenData({
          ...tokenData,
          optedUser: { ...tokenData.optedUser, caregiveeID: json.caregiveeID },
        })
      );
      await makeRequest();
    } else
      Alert.alert("Error", json.error, json.error_0, [
        { text: "Ok", onPress: () => {}, style: "cancel" },
      ]);
  };

  const makeRequest = async () => {
    if (!tokenData.phone || !tokenData.optedUser.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? {
            caregiveePhone: tokenData.phone,
            caregiverPhone: tokenData.optedUser.phone,
            sender: tokenData.type,
          }
        : {
            caregiverPhone: tokenData.phone,
            caregiveePhone: tokenData.optedUser.phone,
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

  const acceptRequest = async (caregiveeID, caregiverID) => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiveeID: caregiveeID,
        caregiverID: caregiverID,
      },
    };
    const json = await acceptRequestEndpoint(params);
    if (json.request.caregiveeID) {
      dispatch(
        setTokenData({
          ...tokenData,
          authPhase: 4,
        })
      );
    }
    if (json.error) console.log("Error accepting request: ", json.error);
  };

  const [errors, setErrors] = useState({});
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

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
            <Text
              style={{
                fontSize: responsiveFontSize(2.8) / fontScale,
                color: "white",
              }}
            >
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
                fontSize: responsiveFontSize(2.5) / fontScale,
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
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: responsiveFontSize(2.51) / fontScale },
                ]}
              >
                Link Fitbit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                {
                  marginTop: 20,
                  backgroundColor: "transparent",
                  fontSize: responsiveFontSize(2.51) / fontScale,
                },
              ]}
              onPress={() => {
                logOutButtonHandler();
              }}
            >
              <Text
                style={[
                  GlobalStyle.ButtonText,
                  { fontSize: responsiveFontSize(2.51) / fontScale },
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
