import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  getDefaultEndpoint,
  setActivityEndpoint,
  setDefaultActivityEndpoint,
  optHolder,
} from "../network/CarebitAPI";
import { useEffect } from "react";
export default function ModifiedActivityScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const { fontScale } = useWindowDimensions();

  // Used to set default activity level on givee side that givers use initially
  const setActivity = async (level) => {
    let params = {
      auth: tokenData.access_token,
      body: {
        healthProfile: level.toString(),
      },
    };
    // In case we're going through the opt-out feature
    if (tokenData.type === "caregiver") {
      params.body.caregiverID = tokenData.caregiverID;
      params.body.caregiveeID = selectedUser.caregiveeID;

      // Set the default fresh and set connection-specific activity as well
      let subParams = {
        level: level,
        targetID: selectedUser.caregiveeID,
        selfID: tokenData.caregiverID,
        auth: tokenData.access_token,
      };
      await setActivityEndpoint(subParams);
      dispatch(setSelectedUser({ ...selectedUser, healthProfile: level }));
      getDefault();
    }
    // Account creation, caregivee edition, authPhase = 8, will be set to 9 after calling /updateHealthProfile
    else {
      params.body.caregiverID = null;
      params.body.caregiveeID = tokenData.caregiveeID;
      dispatch(setTokenData({ ...tokenData, healthProfile: level }));
    }
    let responseText = await setDefaultActivityEndpoint(params);

    if (!responseText) {
      // If we are just changing the value and already completed account creation
      if (tokenData.authPhase === 9) {
        navigation.goBack();
        return;
      }
      // Send to 2 (giverhome) for opt-out, and 9 (giveehome) for normal givee account creation
      let newPhase = tokenData.type === "caregiver" ? 2 : 9;
      dispatch(
        setTokenData({
          ...tokenData,
          authPhase: newPhase,
        })
      );
    } else console.log("Error setting activity level: ", responseText);
  };
  console.log(selectedUser);
  // Sets selectedUser to opt out person if needed
  useEffect(() => {
    getOptNumber();
  }, []);

  // Retrieve user info if they logged out
  const getOptNumber = async () => {
    const params = {
      auth: tokenData.access_token,
      type: "POST",
      body: {
        caregiverID: tokenData.caregiverID,
      },
    };
    const json = await optHolder(params);
    if (!json) {
      console.log("Problem getting opt number");
    }

    dispatch(
      setSelectedUser({
        ...selectedUser,
        caregiveeID: json.caregiveeID,
        caregiverID: tokenData.caregiverID,
        userID: json.caregivee.userID,
        firstName: json.caregivee.firstName,
        lastName: json.caregivee.lastName,
        email: json.caregivee.email,
        phone: json.caregivee.phone,
      })
    );
    return json;
  };

  // Find your default user
  const getDefault = async () => {
    const body =
      tokenData.type === "caregiver"
        ? {
            caregiverID: tokenData.caregiverID,
            caregiveeID: null,
          }
        : {
            caregiverID: null,
            caregiveeID: tokenData.caregiveeID,
          };
    const params = { auth: tokenData.access_token, body: body };
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

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode={"cover"}
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        {/* Title container */}
        <SafeAreaView style={{ flex: 1 }}>
          <SafeAreaView
            style={[
              GlobalStyle.Container,
              { marginLeft: "10%", marginRight: "10%" },
            ]}
          >
            <Text
              style={[
                GlobalStyle.Subtitle,
                { fontSize: moderateScale(49) / fontScale },
              ]}
            >
              Activity Level
            </Text>
            {/* Description container */}
            <SafeAreaView style={styles.TextBox}>
              <Text
                style={[
                  styles.DescriptiveText,
                  { fontSize: moderateScale(17) / fontScale },
                ]}
              >
                Choose the usual level of activity for this account
              </Text>
            </SafeAreaView>
            {/* Activity levels container */}
            <SafeAreaView
              style={{
                width: "100%",
                height: "80%",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {/* Each button sends appropriate level to back end which handles thresholds based off that */}
              <TouchableOpacity
                style={styles.InnerContainers}
                onPress={() => {
                  setActivity(1);
                }}
              >
                <SafeAreaView>
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: moderateScale(18.5) / fontScale },
                    ]}
                  >
                    Active
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: moderateScale(17) / fontScale },
                    ]}
                  >
                    Living an active life
                  </Text>
                </SafeAreaView>
                <Image
                  style={{
                    height: moderateScale(15),
                    width: moderateScale(15),
                    marginRight: "5%",
                  }}
                  source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.InnerContainers}
                onPress={() => {
                  setActivity(2);
                }}
              >
                <SafeAreaView>
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: moderateScale(18.5) / fontScale },
                    ]}
                  >
                    Sedentary
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: moderateScale(17) / fontScale },
                    ]}
                  >
                    Not active, but not homebound
                  </Text>
                </SafeAreaView>
                <Image
                  style={{
                    height: moderateScale(15),
                    width: moderateScale(15),
                    marginRight: "5%",
                  }}
                  source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.InnerContainers}
                onPress={() => {
                  setActivity(3);
                }}
              >
                <SafeAreaView>
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: moderateScale(18.5) / fontScale },
                    ]}
                  >
                    Homebound
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: moderateScale(17) / fontScale },
                    ]}
                  >
                    Unable to leave home
                  </Text>
                </SafeAreaView>

                <Image
                  style={{
                    height: moderateScale(15),
                    width: moderateScale(15),
                    marginRight: "5%",
                  }}
                  source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  TextBox: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  DescriptiveText: {
    fontSize: moderateScale(17),
    color: "white",
  },
  InnerContainers: {
    flexDirection: "row",
    marginTop: "7%",
    backgroundColor: "rgba(218, 223, 225, 1)",
    height: "15%",
    width: "100%",
    borderRadius: moderateScale(8),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: moderateScale(1), height: moderateScale(3) },
        shadowOpacity: moderateScale(0.4),
      },
      android: {
        elevation: moderateScale(4),
      },
    }),
    justifyContent: "space-between",
    alignItems: "center",
  },
  InnerTitle: {
    marginLeft: "6%",
    color: "black",
    fontWeight: "600",
    fontSize: moderateScale(18.5),
  },
  InnerText: {
    marginLeft: "6%",
    marginTop: "2%",
    color: "darkgray",
    fontWeight: "400",
    fontSize: moderateScale(17),
  },
});
