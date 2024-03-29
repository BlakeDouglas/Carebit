import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import React, { useState } from "react";
import { useEffect } from "react";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import call from "react-native-phone-call";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { resetSelectedData, setSelectedUser } from "../redux/actions";
import {
  caregiveeGetEndpoint,
  fitbitDataEndpoint,
  getDefaultEndpoint,
  notificationTokenEndpoint,
  setNoSyncAlert,
  alertCounter,
  getLastNoSyncAlert,
  setLastNoSyncAlert,
} from "../network/CarebitAPI";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);
export default function GiverHomeScreen({ navigation }) {
  // Fixes accessibility zoom
  const { fontScale } = useWindowDimensions();

  // Holds all fitbit returned values
  const [dailySteps, setDailySteps] = useState(null);
  const [hourlySteps, setHourlySteps] = useState(null);
  const [stepUpdate, setStepUpdate] = useState(null);
  const [HeartBPM, setHeart] = useState(null);
  const [HeartMax, setHeartMax] = useState(null);
  const [HeartMin, setHeartMin] = useState(null);
  const [HeartAvg, setHeartAvg] = useState(null);
  const [BatteryLevel, setBatteryLevel] = useState(null);
  const [BatterySyncTime, setBatterySyncTime] = useState(null);
  const [HeartSyncTime, setHeartSyncTime] = useState(null);
  const [StepsSyncTime, setStepsSyncTime] = useState(null);
  const [isEnabledSleep, setIsEnabledSleep] = useState(false);
  const [isEnabledDisturb, setIsEnabledDisturb] = useState(false);
  const [isEnabledMonitor, setIsEnabledMonitor] = useState(true);
  const [counter, setCounter] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);

  const dispatch = useDispatch();

  // Finds date to display
  const moment = extendMoment(Moment);
  let date = moment().format("dddd, MMM D");

  // Sets phone number
  var number = selectedUser.phone || null;
  var args = {
    number,
    prompt: true,
    skipCanOpen: true,
  };

  // Refreshing prop to grab all info on manual refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDefault();
    getCaregiveeInfo();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // Sets privacy option variables to givee privacy options
  const getCaregiveeInfo = async () => {
    if (!selectedUser.caregiveeID) return;
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
    };
    const json = await caregiveeGetEndpoint(params);
    if (json.caregivee) {
      setIsEnabledSleep(json.caregivee.sleep === 1);
      setIsEnabledDisturb(json.caregivee.doNotDisturb === 1);
      setIsEnabledMonitor(json.caregivee.monitoring === 1);
    }
  };

  // Returns default givee
  const getDefault = async () => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiverID: tokenData.caregiverID,
        caregiveeID: null,
      },
    };
    const json = await getDefaultEndpoint(params);

    if (json.error) {
      if (json.error.startsWith("request not")) {
        reset();
      } else {
        console.log("Error getting default: ", json.error);
      }
      return;
    }

    if (json.default) {
      dispatch(setSelectedUser(json.default));
    }
  };
  // Resets all values if user is deleted or no one selected
  const reset = () => {
    setBatteryLevel(null);
    setBatterySyncTime(null);
    setHeart(null);
    setHeartMin(null);
    setHeartAvg(null);
    setHeartMax(null);
    setHeartSyncTime(null);
    setHourlySteps(null);
    setDailySteps(null);
    setStepUpdate(null);
    setStepsSyncTime(null);
    setHeartSyncTime(null);
    setIsEnabledSleep(false);
    setIsEnabledDisturb(false);
    setIsEnabledMonitor(true);
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

  // Returns time for all fields to show when we pulled the data
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
    return "now";
  };

  // Returns # daily alerts
  const getAlertCounter = async () => {
    if (!selectedUser.caregiveeID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
    };
    const json = await alertCounter(params);
    if (json) {
      setCounter(json.counter);
    } else {
      console.log("Failed to get alertCounter");
      return;
    }
  };

  // Returns last sync time to limit # no sync alerts
  const getLastSyncTime = async (syncTime) => {
    if (!selectedUser.caregiveeID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      time: syncTime,
    };
    const responseText = await getLastNoSyncAlert(params);
    const json = JSON.parse(responseText);
    if (!json) {
      console.log("Problem getting last sync time");
      return;
    }
    return json.lastSyncAlert;
  };

  // Sets last sync time to compare against getLastSyncTime so no alerts for an hour
  const setLastSyncTime = async (syncTime) => {
    console.log(syncTime);
    if (!selectedUser.caregiveeID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      time: syncTime,
    };
    const json = await setLastNoSyncAlert(params);
    if (json) {
      console.log("Problem setting last sync time");
      return;
    }
  };

  // Sends no sync alert since we have running counter on front end
  const noSyncAlert = async () => {
    if (!selectedUser.caregiveeID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
    };
    const json = await setNoSyncAlert(params);
    if (json) {
      console.log("Problem sending no sync alert");
      return;
    }
  };
  // Returns all givee Fitbit data
  const fetchData = async () => {
    if (!selectedUser.caregiveeID) {
      return;
    }
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      metric: "all",
      period: "recent",
    };
    const json = await fitbitDataEndpoint(params);
    if (!json) {
      console.log("Aborting data pull (Internal server error)");
      return;
    }

    if (json.device) {
      console.log("Device: ", json.device);
      setBatteryLevel(json.device.battery);
      setBatterySyncTime(calculateTime(json.device.lastSyncTime));
    }
    if (json.heart) {
      console.log("Heart: ", json.heart);
      setHeart(json.heart.restingRate);
      setHeartMin(json.heart.minHR);
      setHeartAvg(json.heart.average);
      setHeartMax(json.heart.maxHR);
      setHeartSyncTime(
        calculateTime(
          json.heart.date +
            (json.heart.timeMeasured.length === 7 ? " 0" : " ") +
            json.heart.timeMeasured
        )
      );
    }
    if (json.steps) {
      console.log("Steps: ", json.steps);
      setHourlySteps(json.steps.hourlyTotal);
      setDailySteps(json.steps.currentDayTotal);

      // Returns the difference in minutes between the last time the
      // Fitbit sunk and right now
      let currTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let pullTime =
        json.steps.date +
        (json.steps.hourlyTime.length === 7 ? " 0" : " ") +
        json.steps.hourlyTime;
      let range = moment.range(pullTime, currTime);
      let StepAlert = range.diff("minutes");

      // GET ignores the parameter. Should return last time noSync alert was sent
      let syncTime = await getLastSyncTime(json.steps.hourlyTime);
      // If it's been over an hour since a sync, send a no sync alert
      // If the last sync time hasn't changed, don't send the alert again
      if (StepAlert >= 60 && syncTime !== json.steps.hourlyTime) {
        setLastSyncTime(json.steps.hourlyTime);
        console.log("Setting new last sync time");
        noSyncAlert();
      }

      setStepUpdate(
        calculateTime(
          json.steps.date +
            (json.steps.timeMeasured.length === 7 ? " 0" : " ") +
            json.steps.timeMeasured
        )
      );
      setStepsSyncTime(
        calculateTime(
          json.steps.date +
            (json.steps.hourlyTime.length === 7 ? " 0" : " ") +
            json.steps.hourlyTime
        )
      );
    }
  };
  // Returns all info when screen is loaded
  useEffect(() => {
    registerForPushNotificationsAsync();
    getCaregiveeInfo();
    getAlertCounter();
  }, []);

  useEffect(() => {
    // Reset to ensure fitbit data is cleared
    reset();
    // Pull fitbit data from the selected user
    if (selectedUser.caregiveeID) {
      getCaregiveeInfo();
      fetchData();
      getAlertCounter();
    }
    // Sets phone number
    number = selectedUser.phone || null;
    args = {
      number,
      prompt: true,
      skipCanOpen: true,
    };
  }, [selectedUser.caregiveeID]);

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const isFocused = useIsFocused();

  // Auto refreshes every x milliseconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused
        ? getCaregiveeInfo() && fetchData() && getAlertCounter()
        : clearInterval(toggle);
    }, 6000);
    return () => clearInterval(toggle);
  });

  return (
    <SafeAreaView style={{ height: windowHeight, width: windowWidth }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            height: windowHeight - verticalScale(50),
            width: windowWidth,
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: moderateScale(47, 0.3),
              width: "100%",
            }}
          >
            {/* White container for alert # and view history */}
            <SafeAreaView style={{ marginLeft: "4%", flexDirection: "row" }}>
              <Image
                style={{
                  height: moderateScale(15),
                  width: moderateScale(15),
                  marginRight: "3%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/icons-caregivee-alert.imageset/icons-caregivee-alert.png")}
              />
              <Text
                style={{
                  color: "gray",
                  fontWeight: "bold",
                  fontSize: moderateScale(15.5) / fontScale,
                  justifyContent: "center",
                }}
              >
                {counter ? counter : "0"} Alerts Today
              </Text>
            </SafeAreaView>
            <TouchableOpacity
              style={{
                marginRight: "4%",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("ReceivedAlertsScreen");
              }}
            >
              <Text
                style={{
                  color: "dodgerblue",
                  fontWeight: "bold",
                  fontSize: moderateScale(15.5) / fontScale,
                }}
              >
                View History
              </Text>
            </TouchableOpacity>
            {/* Checks status to find what header to display */}
          </SafeAreaView>
          {!isEnabledSleep && !isEnabledDisturb && isEnabledMonitor ? (
            <SafeAreaView
              style={{
                height: moderateScale(68),
                width: "96%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SafeAreaView
                style={{
                  height: "100%",
                  width: "64%",
                  justifyContent: "center",
                  marginRight: "2%",
                  marginLeft: "4%",
                }}
              >
                <Text
                  style={{
                    flexShrink: 1,
                    color: "darkgrey",
                    fontSize: moderateScale(14.7) / fontScale,
                  }}
                  numberOfLines={1}
                >
                  Hello {tokenData.firstName || "N/A"}
                </Text>

                {/* All users must have a phone number, otherwise there's no way to add them. Thus, no phone = no user */}
                {/* The only way for us not to have a Caregivee is if we don't have anyone added */}
                {/* Thus, send to add screen if no Caregivee exists */}
                {selectedUser.phone ? (
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(17) / fontScale,
                      fontWeight: "500",
                    }}
                    numberOfLines={1}
                  >
                    Your Caregivee is {selectedUser.firstName}
                  </Text>
                ) : (
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: "dodgerblue",
                        fontSize: moderateScale(17) / fontScale,
                        fontWeight: "500",
                      }}
                      numberOfLines={1}
                      onPress={() => {
                        navigation.navigate("AddScreen");
                      }}
                    >
                      Click To Add A Caregivee
                    </Text>
                  </TouchableOpacity>
                )}
              </SafeAreaView>
              <SafeAreaView
                style={{
                  height: "100%",
                  width: "32%",
                  justifyContent: "center",
                  marginRight: "2%",
                }}
              >
                <SafeAreaView
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    height: "100%",
                    width: "100%",
                    flexShrink: 1,
                  }}
                >
                  {number && (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexShrink: 1,
                      }}
                      onPress={() => {
                        call(args).catch(console.error);
                      }}
                    >
                      <Image
                        style={{ flexShrink: 1 }}
                        source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
                      />
                      <Text
                        style={[
                          styles.callText,
                          {
                            flexShrink: 1,
                            fontSize: moderateScale(15.5) / fontScale,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        Call {selectedUser.firstName || "N/A"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          ) : !isEnabledMonitor ? (
            <SafeAreaView
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255, 197, 0, 0.8)",
                height: "7%",
                width: "100%",
                ...Platform.select({
                  ios: {
                    shadowColor: "black",
                    shadowOffset: {
                      width: moderateScale(4),
                      height: moderateScale(6),
                    },
                    shadowOpacity: moderateScale(0.4),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              }}
            >
              <Image
                style={[
                  styles.imagesBody,
                  {
                    height: moderateScale(20),
                    width: moderateScale(20),
                    marginLeft: "3%",
                    marginRight: "2%",
                    tintColor: "black",
                  },
                ]}
                source={require("../../assets/images/icons-caregivee-monitor-off.imageset/icons-caregivee-monitor-off.png")}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: moderateScale(16.2) / fontScale,
                  fontWeight: "800",
                }}
                numberOfLines={1}
              >
                {selectedUser.firstName} Paused Monitoring
              </Text>
            </SafeAreaView>
          ) : isEnabledSleep ? (
            <SafeAreaView
              style={{
                flexDirection: "row",
                //justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,.9)",
                height: "7%",
                width: "100%",
                ...Platform.select({
                  ios: {
                    shadowColor: "blue",
                    shadowOffset: {
                      width: moderateScale(4),
                      height: moderateScale(6),
                    },
                    shadowOpacity: moderateScale(0.4),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              }}
            >
              <Image
                style={[
                  {
                    height: moderateScale(25),
                    width: moderateScale(25),
                    marginLeft: "3%",
                    marginRight: "2%",
                  },
                ]}
                source={require("../../assets/images/icons-caregivee-sleep-on.imageset/icons-caregivee-sleep-on.png")}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: moderateScale(16.2) / fontScale,
                  fontWeight: "800",
                }}
                numberOfLines={1}
              >
                {selectedUser.firstName} Said Good Night
              </Text>
            </SafeAreaView>
          ) : (
            <SafeAreaView
              style={{
                flexDirection: "row",
                //justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,.8)",
                height: "7%",
                width: "100%",
                ...Platform.select({
                  ios: {
                    shadowColor: "black",
                    shadowOffset: {
                      width: moderateScale(4),
                      height: moderateScale(6),
                    },
                    shadowOpacity: moderateScale(0.4),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              }}
            >
              <Image
                style={[
                  {
                    height: moderateScale(25),
                    width: moderateScale(25),
                    marginLeft: "3%",
                    marginRight: "2%",
                  },
                ]}
                source={require("../../assets/images/icons-caregivee-dnd-on.imageset/icons-caregivee-dnd-on.png")}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: moderateScale(16.2) / fontScale,
                  fontWeight: "800",
                }}
                numberOfLines={1}
              >
                {selectedUser.firstName} Wants No Disturbances
              </Text>
            </SafeAreaView>
          )}
          <SafeAreaView
            style={{
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
            }}
          ></SafeAreaView>
          {/* Container for last recorded activity */}
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              alignSelf: "center",
              height: "5%",
              width: "92%",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(17) / fontScale,
              }}
            >
              Last Recorded Activity
            </Text>
            <Text
              style={{
                color: "darkgrey",
                fontSize: moderateScale(14, 0.6) / fontScale,
              }}
            >
              {/** TODO: Is this the right field?*/}
              {BatterySyncTime && StepsSyncTime
                ? BatterySyncTime <= StepsSyncTime
                  ? BatterySyncTime
                  : StepsSyncTime
                : ""}
            </Text>
          </SafeAreaView>
          {/* Container for heart rate and daily steps */}
          <SafeAreaView style={{ marginTop: "4%", height: "17%" }}>
            <SafeAreaView
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                height: "25%",
                width: "100%",
              }}
            >
              {/* Heart rate title container */}
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  height: "100%",
                  width: "43%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: moderateScale(5),
                  borderTopRightRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <Image
                  style={[styles.images, { marginLeft: "4%" }]}
                  source={require("../../assets/images/heart/heart.png")}
                />
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17.5) / fontScale,
                    marginLeft: "5%",
                  }}
                >
                  Heart Rate
                </Text>
              </SafeAreaView>
              {/* Daily step title container */}
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  width: "43%",
                  height: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: moderateScale(5),
                  borderTopRightRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <Image
                  style={[styles.images, { marginLeft: "4%" }]}
                  source={require("../../assets/images/steps/steps.png")}
                />
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17.5) / fontScale,
                    marginLeft: "5%",
                  }}
                >
                  Steps
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            {/* Heart rate and daily step body container */}
            <SafeAreaView
              style={{
                width: "100%",
                height: "75%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {/* Heart rate body container */}
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "43%",
                  height: "100%",
                  borderBottomEndRadius: moderateScale(5),
                  borderBottomLeftRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.4),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <SafeAreaView
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "70%",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                  >
                    {HeartBPM === null || !isEnabledMonitor ? "--" : HeartBPM}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(15.5) / fontScale,
                      marginLeft: "3%",
                      fontWeight: "600",
                    }}
                  >
                    BPM
                  </Text>
                </SafeAreaView>
                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    {!isEnabledMonitor
                      ? ""
                      : HeartSyncTime
                      ? HeartSyncTime
                      : ""}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
              {/* Daily step body container */}
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  //justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "43%",
                  borderBottomEndRadius: moderateScale(5),
                  borderBottomLeftRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.4),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <SafeAreaView
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    height: "55%",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {isEnabledMonitor
                      ? hourlySteps === null
                        ? "--"
                        : hourlySteps
                      : "--"}
                  </Text>
                </SafeAreaView>
                {/* Tells user to sync if it's been over an hour */}
                <SafeAreaView
                  style={{
                    width: "92%",
                    height: "45%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                    numberOfLines={2}
                  >
                    {stepUpdate
                      ? stepUpdate.includes("hour", 0) ||
                        stepUpdate.includes("day", 0)
                        ? "ask " +
                          selectedUser.firstName.slice(0, 12) +
                          " to sync"
                        : "in past hour"
                      : "in past hour"}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
              marginTop: "7%",
            }}
          ></SafeAreaView>

          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: "6%",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(17) / fontScale,

                marginLeft: "4%",
              }}
            >
              Today
            </Text>

            <Text
              style={{
                color: "darkgrey",
                fontSize: moderateScale(14) / fontScale,
                marginRight: "4%",
              }}
            >
              {date}
            </Text>
          </SafeAreaView>
          {/* Heart rate summary container */}
          <SafeAreaView
            style={{
              alignSelf: "center",
              height: "17%",
              backgroundColor: "whitesmoke",
              alignSelf: "center",
              width: "92%",
              borderRadius: moderateScale(5),
            }}
          >
            {/* Heart rate summary title container */}
            <SafeAreaView
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                width: "100%",
                height: "30%",
                alignItems: "center",
                borderTopStartRadius: moderateScale(5),
                borderTopRightRadius: moderateScale(5),
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: moderateScale(1),
                      height: moderateScale(3),
                    },
                    shadowOpacity: moderateScale(0.4),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
              }}
            >
              <Image
                style={[styles.images, { marginLeft: "4%" }]}
                source={require("../../assets/images/heart/heart.png")}
              />
              <SafeAreaView
                style={{
                  flexDirection: "row",
                  height: "100%",
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17.5) / fontScale,
                    marginLeft: "3%",
                  }}
                >
                  Heart Rate Summary
                </Text>
                <Text
                  style={{
                    color: "darkgrey",
                    fontSize: moderateScale(14) / fontScale,
                    marginRight: "5%",
                  }}
                >
                  BPM
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            {/* Heart rate summary body container */}
            <SafeAreaView
              style={{
                backgroundColor: "whitesmoke",
                flexDirection: "row",
                justifyContent: "space-evenly",
                height: "70%",
                width: "100%",
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: moderateScale(1),
                      height: moderateScale(3),
                    },
                    shadowOpacity: moderateScale(0.4),
                  },
                  android: {
                    elevation: moderateScale(6),
                  },
                }),
                borderBottomEndRadius: moderateScale(5),
                borderBottomLeftRadius: moderateScale(5),
              }}
            >
              <SafeAreaView
                style={{
                  width: "25%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <SafeAreaView
                  style={{
                    height: "70%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                  >
                    {isEnabledMonitor
                      ? HeartMin === null
                        ? "--"
                        : HeartMin
                      : "--"}
                  </Text>
                </SafeAreaView>

                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    // backgroundColor: "yellow",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    min
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  alignSelf: "center",
                  borderLeftColor: "lightgray",
                  borderLeftWidth: moderateScale(1.5),
                  height: "70%",
                }}
              ></SafeAreaView>
              <SafeAreaView
                style={{
                  width: "25%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor: "green",
                  flexDirection: "column",
                }}
              >
                <SafeAreaView
                  style={{
                    height: "70%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                  >
                    {isEnabledMonitor
                      ? HeartAvg === null
                        ? "--"
                        : HeartAvg
                      : "--"}
                  </Text>
                </SafeAreaView>

                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    avg
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  alignSelf: "center",
                  borderLeftColor: "lightgray",
                  borderLeftWidth: moderateScale(1.5),
                  height: "70%",
                }}
              ></SafeAreaView>
              <SafeAreaView
                style={{
                  width: "25%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <SafeAreaView
                  style={{
                    height: "70%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                  >
                    {isEnabledMonitor
                      ? HeartMax === null
                        ? "--"
                        : HeartMax
                      : "--"}
                  </Text>
                </SafeAreaView>

                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    max
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={{ marginTop: "6%", height: "17%" }}>
            <SafeAreaView
              style={{
                flexDirection: "row",
                //backgroundColor: "red",
                justifyContent: "space-evenly",
                height: "25%",
                width: "100%",
              }}
            >
              {/* Total step title container */}
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  height: "100%",
                  width: "43%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: moderateScale(5),
                  borderTopRightRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <Image
                  style={[styles.images, { marginLeft: "4%" }]}
                  source={require("../../assets/images/steps/steps.png")}
                />
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17.5) / fontScale,
                    marginLeft: "5%",
                  }}
                >
                  Total Steps
                </Text>
              </SafeAreaView>
              {/* Fitbit battery title container */}
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  width: "43%",
                  height: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: moderateScale(5),
                  borderTopRightRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.6),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <Image
                  style={[styles.images, { marginLeft: "4%" }]}
                  source={require("../../assets/images/icons-fitbit-color.imageset/icons-fitbit-color.png")}
                />
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(17.5) / fontScale,
                    marginLeft: "5%",
                    //marginVertical: "3%",
                  }}
                >
                  Fitbit Battery
                </Text>
              </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView
              style={{
                width: "100%",
                height: "75%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {/* Total step body container */}
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "43%",
                  height: "100%",
                  borderBottomEndRadius: moderateScale(5),
                  borderBottomLeftRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.4),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <SafeAreaView
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "70%",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: moderateScale(34.8) / fontScale,
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {isEnabledMonitor
                      ? dailySteps === null
                        ? "--"
                        : dailySteps
                      : "--"}
                  </Text>
                </SafeAreaView>
                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    {!isEnabledMonitor
                      ? ""
                      : StepsSyncTime
                      ? StepsSyncTime
                      : ""}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
              {/* Fitbit battery body container */}
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "43%",
                  borderBottomEndRadius: moderateScale(5),
                  borderBottomLeftRadius: moderateScale(5),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: moderateScale(1),
                        height: moderateScale(3),
                      },
                      shadowOpacity: moderateScale(0.4),
                    },
                    android: {
                      elevation: moderateScale(6),
                    },
                  }),
                }}
              >
                <SafeAreaView
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70%",
                    width: "100%",
                  }}
                >
                  {BatteryLevel === "High" ? (
                    <Image
                      style={{
                        height: moderateScale(23),
                        width: moderateScale(40),
                      }}
                      source={require("../../assets/images/battery-full.imageset/battery-full.png")}
                    />
                  ) : BatteryLevel === "Medium" ? (
                    <Image
                      style={{
                        height: moderateScale(23),
                        width: moderateScale(40),
                      }}
                      source={require("../../assets/images/battery-medium.imageset/battery-medium.png")}
                    />
                  ) : (
                    <Image
                      style={{
                        height: moderateScale(23),
                        width: moderateScale(40),
                      }}
                      source={require("../../assets/images/battery-low.imageset/battery-low.png")}
                    />
                  )}
                </SafeAreaView>
                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={[
                      styles.smallText,
                      { fontSize: moderateScale(14) / fontScale },
                    ]}
                  >
                    {isEnabledMonitor
                      ? BatteryLevel === null
                        ? "Unlinked"
                        : BatteryLevel
                      : "Paused"}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  caregiveeText: {
    color: "black",
    fontSize: responsiveFontSize(2.7),
    marginLeft: "5%",
    fontWeight: "500",
  },
  lastActivityText: {
    color: "black",
    fontSize: moderateScale(17),
  },
  smallText: {
    color: "darkgrey",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  dateText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
    marginLeft: "45%",
  },
  callBody: {
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  callText: {
    color: "dodgerblue",
    fontSize: moderateScale(15.5),
    fontWeight: "bold",
    // marginLeft: "2%",
  },
  images: {
    height: moderateScale(25),
    width: moderateScale(25),
  },
});
