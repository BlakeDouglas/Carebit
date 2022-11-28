import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Modal from "react-native-modal";
import call from "react-native-phone-call";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { resetSelectedData, setSelectedUser } from "../redux/actions";
import {
  caregiveeGetEndpoint,
  caregiveeSetEndpoint,
  notificationTokenEndpoint,
  getDefaultEndpoint,
  fitbitDataEndpoint,
  alertCounter,
} from "../network/CarebitAPI";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);
export default function GiveeHomeScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const dispatch = useDispatch();
  const number = selectedUser.phone || null;
  const [refreshing, setRefreshing] = React.useState(false);
  const args = {
    number,
    prompt: true,
    skipCanOpen: true,
  };
  const [BatteryLevel, setBatteryLevel] = useState(null);
  const [caregivee, setCaregivee] = useState(null);
  const [update, setUpdate] = useState(null);

  // Booleans to display the 3 different alerts (sleep, dnd, monitoring)
  const [isModal1Visible, setModal1Visible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [isModal3Visible, setModal3Visible] = useState(false);
  // Toggles to set the 3 different alerts as true/false
  const toggleModal1 = () => {
    setModal1Visible(!isModal1Visible);
  };
  const toggleModal2 = () => {
    setModal2Visible(!isModal2Visible);
  };
  const toggleModal3 = () => {
    setModal3Visible(!isModal3Visible);
  };

  // Underlying boolean values for the privacy modes
  // Value used to determine slider position as well
  const [isEnabledSleep, setIsEnabledSleep] = useState(false);
  const [isEnabledDisturb, setIsEnabledDisturb] = useState(false);
  const [isEnabledMonitor, setIsEnabledMonitor] = useState(true);

  // Used to toggle privacy modes back to their original state
  const toggleSleep = () => {
    setIsEnabledSleep(!isEnabledSleep);
    setCaregiveeInfo({ sleep: 0 });
  };
  const toggleDisturb = () => {
    setIsEnabledDisturb(!isEnabledDisturb);
    setCaregiveeInfo({ doNotDisturb: 0 });
  };
  const toggleMonitor = () => {
    setIsEnabledMonitor(!isEnabledMonitor);
    setCaregiveeInfo({ monitoring: 1 });
  };

  const [counter, setCounter] = useState(null);

  // Store the current date
  const moment = extendMoment(Moment);
  let date = moment().format("dddd, MMM D");

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  // When the user refreshes the page, it calls these functions
  // Sets refreshing prop to false after x seconds
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    updateConnections();
    fetchData();
    getAlertCounter();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // Finds default caregiver to display data
  const updateConnections = async () => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiverID: null,
        caregiveeID: tokenData.caregiveeID,
      },
    };
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

  // Get Device expo-token-Notification
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      storeMessageToken(token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  // Stores expo-token-notification in user's database
  const storeMessageToken = async (token) => {
    const params = {
      payload: token,
      selfID: tokenData.userID,
      auth: tokenData.access_token,
    };

    const json = await notificationTokenEndpoint(params);
    // TODO: Implement error catching here
  };

  // Receive a count of how many alerts are present
  const getAlertCounter = async () => {
    if (!selectedUser.caregiverID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
      selfID: selectedUser.caregiverID,
    };
    const json = await alertCounter(params);
    if (json) {
      console.log(json);
      setCounter(json.counter);
    } else {
      console.log("Failed to get alertCounter");
      return;
    }
  };

  // Used to set the default values for privacy modes based off of last selection
  const getCaregiveeInfo = async () => {
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
    };
    const json = await caregiveeGetEndpoint(params);
    if (json.caregivee) {
      setCaregivee(json.caregivee);
      setIsEnabledSleep(json.caregivee.sleep === 1);
      setIsEnabledDisturb(json.caregivee.doNotDisturb === 1);
      setIsEnabledMonitor(json.caregivee.monitoring === 1);
    }
  };

  // Endpoint to send privacy values to backend
  const setCaregiveeInfo = async (newJson) => {
    const params = {
      targetID: tokenData.caregiveeID,
      auth: tokenData.access_token,
      body: {
        ...caregivee,
        ...newJson,
        physCity: undefined,
        physName: undefined,
        physPhone: undefined,
        physState: undefined,
        physStreet: undefined,
        physZip: undefined,
        caregiveeID: undefined,
        userID: undefined,
      },
    };
    const json = await caregiveeSetEndpoint(params);
    if (json.caregivee) setCaregivee(json.caregivee);
  };

  // Function to calculate time between last sync and the current time
  const calculateTime = (pullTime) => {
    let currTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let range = moment.range(pullTime, currTime);

    let diffDays = range.diff("days");
    if (diffDays > 0) {
      return diffDays + " day" + (diffDays === 1 ? "" : "s") + " ago";
    }
    let diffHours = range.diff("hours");

    if (diffHours > 0) {
      return diffHours + " hour" + (diffHours === 1 ? "" : "s") + " ago";
    }

    let diffMinutes = range.diff("minutes");

    if (diffMinutes > 0) {
      return diffMinutes + " minute" + (diffMinutes === 1 ? "" : "s") + " ago";
    }

    let diffSeconds = range.diff("seconds");

    if (diffSeconds > 0) {
      return diffSeconds + " second" + (diffSeconds === 1 ? "" : "s") + " ago";
    }

    if (diffSeconds === 0) {
      return "now";
    }

    return "Invalid Time";
  };

  // Returns device info (battery data)
  const fetchData = async () => {
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
      metric: "device",
      period: "recent",
    };
    const json = await fitbitDataEndpoint(params);

    if (json.error) {
      console.log("Error on battery data pull: ", json.error);
      return;
    }

    if (json.device) {
      setBatteryLevel(json.device.battery);
      setUpdate(calculateTime(json.device.lastSyncTime));
    }
  };

  // TODO: Move to login, redo caregivee field to accomodate. Will speed up things
  useEffect(() => {
    getCaregiveeInfo();
    fetchData();
    getAlertCounter();
  }, [selectedUser]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const { fontScale } = useWindowDimensions();
  return (
    <View style={{ height: windowHeight, width: windowWidth }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      {/* Sleep toggle switch pop up window for confirmation/decline */}
      <Modal
        isVisible={isModal1Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: moderateScale(windowHeight / 4, 0.7),
            width: "70%",
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: moderateScale(17, 0.6) / fontScale,
              }}
            >
              Sleep Mode
            </Text>
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                width: "110%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: moderateScale(14, 0.6) / fontScale,
                fontWeight: "400",
                textAlign: "left",
                padding: moderateScale(7),
              }}
            >
              Turning on Sleep Mode will inform your caregiver(s) that you are
              going to sleep. They will not receive alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  setIsEnabledSleep((isEnabledSleep) => true);
                  setCaregiveeInfo({ sleep: 1 });
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Turn Sleep Mode On
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  setIsEnabledSleep((isEnabledSleep) => false);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Keep Sleep Mode Off
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* DnD toggle switch pop up window for confirmation/decline */}
      <Modal
        isVisible={isModal2Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: moderateScale(windowHeight / 4, 0.7),
            width: "70%",
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: moderateScale(17, 0.6) / fontScale,
              }}
            >
              Do Not Disturb
            </Text>
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: moderateScale(1),
                width: "110%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: moderateScale(14, 0.6) / fontScale,
                fontWeight: "400",
                padding: moderateScale(7),
                textAlign: "left",
              }}
            >
              Turning on Do Not Disturb will inform your caregiver(s) that you
              do not want to be called. They will not receive alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal2();
                  setIsEnabledDisturb((isEnabledDisturb) => true);
                  setCaregiveeInfo({ doNotDisturb: 1 });
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Turn Do Not Disturb On
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal2();
                  setIsEnabledDisturb((isEnabledDisturb) => false);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Keep Do Not Disturb Off
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Monitoring toggle switch pop up window for confirmation/decline */}
      <Modal
        isVisible={isModal3Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: moderateScale(windowHeight / 4, 0.7),
            width: "70%",
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "100%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: moderateScale(17, 0.6) / fontScale,
              }}
            >
              Monitoring
            </Text>
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: moderateScale(1),
                width: "100%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: moderateScale(14, 0.6) / fontScale,
                fontWeight: "400",
                padding: moderateScale(7),
                textAlign: "left",
              }}
            >
              Pausing Monitoring will prevent your caregiver(s) from receiving
              any of your health data, including alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal3();
                  setIsEnabledMonitor((isEnabledMonitor) => false);
                  setCaregiveeInfo({ monitoring: 0 });
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Pause Monitoring
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal3();
                  setIsEnabledMonitor((isEnabledMonitor) => true);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: moderateScale(15.1, 0.6) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Keep Monitoring
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Container for all visible data */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            height: windowHeight - verticalScale(30),
            width: windowWidth,
          }}
        >
          {/* Shows reminder to sync to Fitbit if its been over an hour */}
          <SafeAreaView
            style={{
              height: scale(21),
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(15.3) / fontScale,
                color: "red",
              }}
              numberOfLines={1}
            >
              {update
                ? update.includes("hour", 0) || update.includes("day", 0)
                  ? "Reminder to sync to the Fitbit app"
                  : ""
                : ""}
            </Text>
          </SafeAreaView>

          {/* Greeting/phone container */}
          <SafeAreaView
            style={{
              height: "10%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "64%",
                justifyContent: "center",
                marginRight: "2%",
              }}
            >
              <Text
                style={{
                  marginLeft: "4%",
                  color: "darkgrey",
                  fontSize: moderateScale(14.7) / fontScale,
                }}
                numberOfLines={1}
              >
                Hello {tokenData.firstName || "N/A"}
              </Text>
              {/* All users must have a phone number, otherwise there's no way to add them. Thus, no phone = no user */}
              {/* The only way for us not to have a Caregiver is if we don't have anyone added */}
              {/* Thus, send to add screen if no Caregiver exists. (Only exception is having requests) */}
              {selectedUser.phone ? (
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17) / fontScale,
                    fontWeight: "500",
                    marginLeft: "4%",
                  }}
                  numberOfLines={1}
                >
                  Your Caregiver is {selectedUser.firstName}
                </Text>
              ) : (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: "dodgerblue",
                      fontSize: moderateScale(17) / fontScale,
                      fontWeight: "500",
                      marginLeft: "4%",
                    }}
                    numberOfLines={1}
                    onPress={() => {
                      navigation.navigate("AddScreen");
                    }}
                  >
                    Click To Add A Caregiver
                  </Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>

            {/* Phone container */}
            <SafeAreaView
              style={{
                height: "100%",
                width: "28%",
                justifyContent: "center",
                flexShrink: 1,
              }}
            >
              {/* Only display phone/name if a phone number exists. Can't call null */}
              {number && (
                <TouchableOpacity
                  style={styles.callBody}
                  onPress={() => {
                    call(args).catch(console.error);
                  }}
                >
                  <Image
                    source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
                    style={{
                      height: moderateScale(25),
                      width: moderateScale(25),
                    }}
                  />
                  <Text
                    style={{
                      flexShrink: 1,
                      fontSize: moderateScale(15.5) / fontScale,
                      color: "dodgerblue",
                      fontWeight: "bold",
                      marginLeft: "2%",
                    }}
                    numberOfLines={2}
                  >
                    Call {selectedUser.firstName || "N/A"}
                  </Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </SafeAreaView>

          {/* Large Card Container for alerts/battery  */}
          <SafeAreaView
            style={{
              flexDirection: "row",
              height: "19%",
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: moderateScale(19, 0.3),
            }}
          >
            {/* Container for alerts */}
            <SafeAreaView
              style={[
                styles.alertBody,
                {
                  ...Platform.select({
                    ios: {
                      shadowColor: "gray",
                      shadowOffset: {
                        width: moderateScale(4),
                        height: moderateScale(10),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                },
              ]}
            >
              <SafeAreaView
                style={{
                  marginTop: moderateScale(8.5),
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => {
                    navigation.navigate("ReceivedAlertsScreen");
                  }}
                >
                  <Image
                    style={{
                      height: moderateScale(45),
                      width: moderateScale(45),
                    }}
                    source={require("../../assets/images/icons-alert-big-color.imageset/icons-alert-big-color.png")}
                  />
                </TouchableOpacity>
              </SafeAreaView>

              <SafeAreaView
                style={{
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
                    { fontSize: moderateScale(17.2) / fontScale },
                  ]}
                >
                  Alerts
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(16.1) / fontScale,
                    color: "darkgrey",
                    fontWeight: "500",
                  }}
                >
                  {counter ? counter : "0"} Today
                </Text>
              </SafeAreaView>
            </SafeAreaView>

            {/* Container for battery */}
            <SafeAreaView
              style={[
                styles.chatBody,
                {
                  ...Platform.select({
                    ios: {
                      shadowColor: "gray",
                      shadowOffset: {
                        width: moderateScale(4),
                        height: moderateScale(10),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                },
              ]}
            >
              <SafeAreaView
                style={{
                  marginTop: moderateScale(8.5),
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {BatteryLevel === "High" ? (
                  <Image
                    style={{
                      height: moderateScale(29),
                      width: moderateScale(51),
                    }}
                    source={require("../../assets/images/battery-full.imageset/battery-full.png")}
                  />
                ) : BatteryLevel === "Medium" ? (
                  <Image
                    style={{
                      height: moderateScale(29),
                      width: moderateScale(51),
                    }}
                    source={require("../../assets/images/battery-medium.imageset/battery-medium.png")}
                  />
                ) : (
                  <Image
                    style={{
                      height: moderateScale(29),
                      width: moderateScale(51),
                    }}
                    source={require("../../assets/images/battery-low.imageset/battery-low.png")}
                  />
                )}
              </SafeAreaView>
              <SafeAreaView
                style={{
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
                    { fontSize: moderateScale(17.2) / fontScale },
                  ]}
                >
                  Battery
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(16.1) / fontScale,
                    color: "darkgrey",
                    fontWeight: "500",
                  }}
                >
                  {BatteryLevel === null ? "Unlinked" : BatteryLevel}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>

          {/* Grey divider */}
          <SafeAreaView
            style={{
              borderBottomColor: "lightgray",
              borderBottomWidth: moderateScale(1),
              marginTop: moderateScale(31, 0.3),
              width: "100%",
            }}
          ></SafeAreaView>

          {/* Preferences/date container */}
          <SafeAreaView
            style={{
              alignSelf: "center",
              alignItems: "center",
              height: "8%",
              width: "92%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                marginLeft: "2%",
                fontSize: moderateScale(17.8) / fontScale,
              }}
            >
              Preferences
            </Text>
            <Text
              style={{
                color: "darkgrey",
                fontSize: moderateScale(13.9) / fontScale,
                marginRight: "2%",
              }}
            >
              {date}
            </Text>
          </SafeAreaView>

          {/* Sleep mode Container */}
          <SafeAreaView
            style={[
              styles.bottomRowBody,
              isEnabledSleep
                ? {
                    ...Platform.select({
                      ios: {
                        shadowColor: "blue",
                        shadowOffset: {
                          width: moderateScale(4),
                          height: moderateScale(10),
                        },
                        shadowOpacity: moderateScale(0.6),
                      },
                      android: {
                        elevation: moderateScale(4),
                      },
                    }),
                  }
                : {
                    ...Platform.select({
                      ios: {
                        shadowColor: "gray",
                        shadowOffset: {
                          width: moderateScale(4),
                          height: moderateScale(10),
                        },
                        shadowOpacity: moderateScale(0.6),
                      },
                      android: {
                        elevation: moderateScale(6),
                      },
                    }),
                  },
              isEnabledSleep
                ? { backgroundColor: "black" }
                : { backgroundColor: "white" },
            ]}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "75%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isEnabledSleep ? (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-sleep-on.imageset/icons-caregivee-sleep-on.png")}
                />
              ) : (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-sleep-off.imageset/icons-caregivee-sleep-off.png")}
                />
              )}
              {/* Middle text container */}
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  height: "100%",
                  width: "40%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
                    isEnabledSleep ? { color: "white" } : { color: "black" },
                    { fontSize: moderateScale(17.4) / fontScale },
                  ]}
                >
                  Sleep Mode
                </Text>
                <Text
                  style={[
                    styles.buttonSmallText,
                    { fontSize: moderateScale(16.5) / fontScale },
                  ]}
                >
                  {isEnabledSleep ? "On" : "Off"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            {/* Sleep toggle switch */}
            <SafeAreaView
              style={{
                marginRight: "4%",
                height: "100%",
                width: "20%",
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isEnabledSleep ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={!isEnabledSleep ? toggleModal1 : toggleSleep}
                value={isEnabledSleep}
              />
            </SafeAreaView>
          </SafeAreaView>

          {/* Do Not Disturb Container */}
          <SafeAreaView
            style={[
              styles.bottomRowBody,
              {
                ...Platform.select({
                  ios: {
                    shadowColor: "gray",
                    shadowOffset: {
                      width: moderateScale(4),
                      height: moderateScale(10),
                    },
                    shadowOpacity: moderateScale(0.6),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              },
              { marginTop: "5%" },
            ]}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "75%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isEnabledDisturb ? (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-dnd-on.imageset/icons-caregivee-dnd-on.png")}
                />
              ) : (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-dnd-off.imageset/icons-caregivee-dnd-off.png")}
                />
              )}
              {/* Middle text container */}
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "60%",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
                    { fontSize: moderateScale(17.4) / fontScale },
                  ]}
                >
                  Do Not Disturb
                </Text>
                <Text
                  style={[
                    styles.buttonSmallText,
                    { fontSize: moderateScale(16.5) / fontScale },
                  ]}
                >
                  {isEnabledDisturb ? "On" : "Off"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            {/* DnD toggle switch container */}
            <SafeAreaView
              style={{
                height: "100%",
                width: "20%",
                marginRight: "3%",
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isEnabledDisturb ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={!isEnabledDisturb ? toggleModal2 : toggleDisturb}
                value={isEnabledDisturb}
              />
            </SafeAreaView>
          </SafeAreaView>
          {/* Monitoring container */}
          <SafeAreaView
            style={[
              styles.bottomRowBody,
              { marginTop: "5%" },
              {
                ...Platform.select({
                  ios: {
                    shadowColor: "gray",
                    shadowOffset: {
                      width: moderateScale(4),
                      height: moderateScale(10),
                    },
                    shadowOpacity: moderateScale(0.6),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              },
            ]}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "75%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isEnabledMonitor ? (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-monitor-on.imageset/icons-caregivee-monitor-on.png")}
                />
              ) : (
                <Image
                  style={styles.imagesBody}
                  source={require("../../assets/images/icons-caregivee-monitor-off.imageset/icons-caregivee-monitor-off.png")}
                />
              )}
              {/* Middle text container */}
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "60%",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
                    { fontSize: moderateScale(17.4) / fontScale },
                  ]}
                >
                  Monitoring
                </Text>
                <Text
                  style={[
                    styles.buttonSmallText,
                    { fontSize: moderateScale(16.5) / fontScale },
                  ]}
                >
                  {isEnabledMonitor ? "Active" : "Paused"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            {/* Monitoring toggle switch container */}
            <SafeAreaView
              style={{
                marginRight: "4%",
                height: "100%",
                width: "20%",
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isEnabledMonitor ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={isEnabledMonitor ? toggleModal3 : toggleMonitor}
                value={isEnabledMonitor}
              />
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  callBody: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: "4%",
    marginTop: Platform.OS == "ios" ? "10%" : "5%",
    justifyContent: "center",
  },
  alertBody: {
    backgroundColor: "white",
    alignItems: "center",
    height: "100%",
    width: "43%",
    borderRadius: moderateScale(5),
  },
  chatBody: {
    backgroundColor: "white",
    alignItems: "center",
    height: "100%",
    width: "43%",
    borderRadius: moderateScale(5),
  },
  imagesBody: {
    width: moderateScale(45),
    height: moderateScale(45),
    marginLeft: "5%",
    marginRight: "5%",
  },
  switchBody: {
    transform: [{ scaleX: moderateScale(1.1) }, { scaleY: moderateScale(1.1) }],
    marginRight: moderateScale(20, 0.8),
  },
  bottomRowBody: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    height: "12%",
    flexDirection: "row",
    borderRadius: moderateScale(5),
  },
  buttonBigText: {
    fontSize: moderateScale(17.4),
    fontWeight: "500",
  },
  buttonSmallText: {
    color: "darkgrey",
    fontWeight: "500",
    marginTop: "3%",
  },
});
