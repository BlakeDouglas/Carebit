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
import { makeRedirectUri } from "expo-auth-session";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setTokenData } from "../redux/actions";
import { deleteKeychain, getAuthRequest } from "../network/Auth";
import { caregiveeCreateEndpoint, logoutEndpoint } from "../network/CarebitAPI";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function AuthenticationScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [request, response, promptAsync] = getAuthRequest();

  // Gives caregivee account their missing info from Fitbit (caregiveeID)
  const makeCaregivee = async (code) => {
    const params = {
      auth: tokenData.access_token,
      body: { authCode: code, userID: tokenData.userID, caregiverID: null },
    };
    const json = await caregiveeCreateEndpoint(params);

    if (json.caregiveeID) {
      dispatch(
        setTokenData({ ...tokenData, ...json, type: "caregivee", authPhase: 7 })
      );
    } else
      Alert.alert("Error", json.error, json.error_0, [
        { text: "Ok", onPress: () => {}, style: "cancel" },
      ]);
  };
  // If you get stuck on this screen, you can log out using this
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

  React.useEffect(() => {
    if (response?.type === "success") makeCaregivee(response.params.code);
  }, [response]);
  // Used for accessibility zoom fix
  const { fontScale } = useWindowDimensions();
  // Redirect URI for testing in Development mode
  console.log(makeRedirectUri({ scheme: "carebit", path: "callback" }));
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={GlobalStyle.Container}>
          {/* Title container for Check mark/Account created */}
          <SafeAreaView
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              marginTop: moderateScale(30, 0.2),
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
          {/* Container for description */}
          <SafeAreaView
            style={{
              marginTop: moderateScale(30),
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
              To allow your Caregiver to monitor you, you'll need to link your
              Fitbit account
            </Text>
          </SafeAreaView>
          {/* Link button container */}
          <SafeAreaView
            style={{
              width: "100%",
              height: "20%",
              marginTop: "15%",
              justifyContent: "flex-start",
            }}
          >
            {/* On press will send you to Fitbit page and have you sign in to permit access */}
            <TouchableOpacity
              style={[GlobalStyle.Button]}
              onPress={() => {
                promptAsync();
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
            {/* Used if you get stuck on this screen with no Fitbit account */}
            <TouchableOpacity
              style={[
                GlobalStyle.Button,
                { marginTop: scale(15), backgroundColor: "transparent" },
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
