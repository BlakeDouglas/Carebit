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
} from "../network/CarebitAPI";

export default function GiverHomeScreen({ navigation }) {
  const [dailySteps, setDailySteps] = useState(null);
  const [hourlySteps, setHourlySteps] = useState(null);
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

  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();

  const moment = extendMoment(Moment);
  let date = moment().format("dddd, MMM D");

  var number = selectedUser.phone || null;
  var args = {
    number,
    prompt: true,
    skipCanOpen: true,
  };

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

  const getCaregiveeInfo = async () => {
    if (!selectedUser.email) return;
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

  const getDefault = async () => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiverID: tokenData.caregiverID,
        caregiveeID: null,
      },
    };
    const json = await getDefaultEndpoint(params);

    if (json.default) {
      dispatch(setSelectedUser(json.default));
    } else dispatch(resetSelectedData());
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

  const calculateTime = (pullTime) => {
    let currTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let range = moment.range(pullTime, currTime);

    let diffDays = range.diff("days");
    if (diffDays > 0) {
      return diffDays + " Day" + (diffDays === 1 ? "" : "s") + " Ago";
    }
    let diffHours = range.diff("hours");

    if (diffHours > 0) {
      return diffHours + " Hour" + (diffHours === 1 ? "" : "s") + " Ago";
    }

    let diffMinutes = range.diff("minutes");

    if (diffMinutes > 0) {
      return diffMinutes + " Minute" + (diffMinutes === 1 ? "" : "s") + " Ago";
    }

    let diffSeconds = range.diff("seconds");

    if (diffSeconds > 0) {
      return diffSeconds + " Second" + (diffSeconds === 1 ? "" : "s") + " Ago";
    }

    if (diffSeconds === 0) {
      return "Now";
    }

    return "Invalid Time";
  };

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
      //console.log("Device: ", json.device);
      setBatteryLevel(json.device.battery);
      setBatterySyncTime(calculateTime(json.device.lastSyncTime));
    }
    if (json.heart) {
      // console.log("Heart: ", json.heart);
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
      // console.log("Steps: ", json.steps);
      setHourlySteps(json.steps.hourlyTotal);
      setDailySteps(json.steps.currentDayTotal);
      setStepsSyncTime(
        calculateTime(
          json.steps.date +
            (json.steps.timeMeasured.length === 7 ? " 0" : " ") +
            json.steps.timeMeasured
        )
      );
    }
  };
  useEffect(() => {
    registerForPushNotificationsAsync();
    getCaregiveeInfo();
    // TODO: Do this on login / account creation
  }, []);

  useEffect(() => {
    getCaregiveeInfo();
    fetchData();
    number = selectedUser.phone || null;
    args = {
      number,
      prompt: true,
      skipCanOpen: true,
    };
  }, [selectedUser]);

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const isFocused = useIsFocused();
  // Auto refreshes every 10 seconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused ? getCaregiveeInfo() : clearInterval(toggle);
    }, 10000);
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
            height: windowHeight - 50,
            width: windowWidth,
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: "6%",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{ marginLeft: "4%", flexDirection: "row" }}
            >
              <Image
                style={{
                  height: 15,
                  width: 15,
                  marginRight: "3%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/icons-caregivee-alert.imageset/icons-caregivee-alert.png")}
              />
              <Text
                style={{
                  color: "gray",
                  fontWeight: "bold",
                  //marginVertical: Platform.OS === "ios" ? "10%" : "8%",
                  justifyContent: "center",
                }}
              >
                0 Alerts Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginRight: "4%",
                //backgroundColor: "red",
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
                  //marginVertical: Platform.OS === "ios" ? "1%" : "8%",
                }}
              >
                View History
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
          {!isEnabledSleep && !isEnabledDisturb && isEnabledMonitor ? (
            <SafeAreaView
              style={{
                height: "9%",
                width: "96%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                //backgroundColor: "blue",
              }}
            >
              <SafeAreaView
                style={{
                  //backgroundColor: "yellow",
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
                    fontSize: responsiveFontSize(1.9),
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
                      fontSize: responsiveFontSize(2.2),
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
                        fontSize: responsiveFontSize(2.2),
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
                  //flexShrink: 1,
                  //backgroundColor: "red",
                }}
              >
                <SafeAreaView
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    //backgroundColor: "blue",
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
                        style={[styles.callText, { flexShrink: 1 }]}
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
                //justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 197, 0, 0.8)",
                height: "7%",
                width: "100%",
                ...Platform.select({
                  ios: {
                    shadowColor: "black",
                    shadowOffset: { width: 4, height: 6 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
              }}
            >
              <Image
                style={[
                  styles.imagesBody,
                  {
                    height: 20,
                    width: 20,
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
                  fontSize: responsiveFontSize(2.1),
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
                    shadowOffset: { width: 4, height: 6 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
              }}
            >
              <Image
                style={[
                  {
                    height: 25,
                    width: 25,
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
                  fontSize: responsiveFontSize(2.1),
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
                    shadowOffset: { width: 4, height: 6 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
              }}
            >
              <Image
                style={[
                  {
                    height: 25,
                    width: 25,
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
                  fontSize: responsiveFontSize(2.1),
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

          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              alignSelf: "center",
              height: "5%",
              width: "92%",
              //backgroundColor: "red",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Last Recorded Activity
            </Text>
            <Text
              style={{
                color: "darkgrey",
                fontSize: responsiveFontSize(1.8),
              }}
            >
              {/** TODO: Is this the right field?*/}
              {BatterySyncTime || ""}
            </Text>
          </SafeAreaView>

          <SafeAreaView style={{ marginTop: "4%", height: "17%" }}>
            <SafeAreaView
              style={{
                flexDirection: "row",
                //backgroundColor: "red",
                justifyContent: "space-evenly",
                height: "25%",
                width: "100%",
              }}
            >
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  height: "100%",
                  width: "43%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.6,
                    },
                    android: {
                      elevation: 6,
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
                    fontSize: responsiveFontSize(2.25),
                    marginLeft: "5%",
                  }}
                >
                  Heart Rate
                </Text>
              </SafeAreaView>

              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  width: "43%",
                  height: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.6,
                    },
                    android: {
                      elevation: 6,
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
                    fontSize: responsiveFontSize(2.25),
                    marginLeft: "5%",
                    //marginVertical: "3%",
                  }}
                >
                  Steps
                </Text>
              </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView
              style={{
                width: "100%",
                height: "75%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                //backgroundColor: "green",
              }}
            >
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "43%",
                  height: "100%",
                  borderBottomEndRadius: 5,
                  borderBottomLeftRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 6,
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
                    //backgroundColor: "blue",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                  >
                    {HeartBPM === null ? "--" : HeartBPM}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: responsiveFontSize(2),
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
                    //backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.smallText}>{HeartSyncTime || ""}</Text>
                </SafeAreaView>
              </SafeAreaView>

              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "43%",
                  borderBottomEndRadius: 5,
                  borderBottomLeftRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 6,
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
                  <Text
                    style={{
                      color: "black",
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {hourlySteps === null ? "--" : hourlySteps}
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
                  <Text style={styles.smallText}>{StepsSyncTime || ""}</Text>
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
              //backgroundColor: "red",
              height: "6%",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.2),

                marginLeft: "4%",
              }}
            >
              Today
            </Text>

            <Text
              style={{
                color: "darkgrey",
                fontSize: responsiveFontSize(1.8),
                marginRight: "4%",
              }}
            >
              {date}
            </Text>
          </SafeAreaView>

          <SafeAreaView
            style={{
              alignSelf: "center",
              height: "17%",
              backgroundColor: "whitesmoke",
              alignSelf: "center",
              width: "92%",
              borderRadius: 5,
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                width: "100%",
                height: "30%",
                alignItems: "center",
                borderTopStartRadius: 5,
                borderTopRightRadius: 5,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 1, height: 3 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
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
                  //backgroundColor: "red",
                  height: "100%",
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: responsiveFontSize(2.25),
                    marginLeft: "3%",
                    //marginVertical: "3%",
                  }}
                >
                  Heart Rate Summary
                </Text>
                <Text
                  style={{
                    color: "darkgrey",
                    fontSize: responsiveFontSize(1.8),
                    marginRight: "5%",
                  }}
                >
                  BPM
                </Text>
              </SafeAreaView>
            </SafeAreaView>

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
                    shadowOffset: { width: 1, height: 3 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
                borderBottomEndRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            >
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
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                  >
                    {HeartMin === null ? "--" : HeartMin}
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
                  <Text style={[styles.smallText]}>min</Text>
                </SafeAreaView>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  alignSelf: "center",
                  borderLeftColor: "lightgray",
                  borderLeftWidth: 1.5,
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
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                  >
                    {HeartAvg === null ? "--" : HeartAvg}
                  </Text>
                </SafeAreaView>

                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    //backgroundColor: "yellow",
                  }}
                >
                  <Text style={[styles.smallText]}>avg</Text>
                </SafeAreaView>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  alignSelf: "center",
                  borderLeftColor: "lightgray",
                  borderLeftWidth: 1.5,
                  height: "70%",
                }}
              ></SafeAreaView>
              <SafeAreaView
                style={{
                  width: "25%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  //backgroundColor: "green",
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
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                  >
                    {HeartMax === null ? "--" : HeartMax}
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
                  <Text style={[styles.smallText]}>max</Text>
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
              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  height: "100%",
                  width: "43%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.6,
                    },
                    android: {
                      elevation: 6,
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
                    fontSize: responsiveFontSize(2.25),
                    marginLeft: "5%",
                  }}
                >
                  Total Steps
                </Text>
              </SafeAreaView>

              <SafeAreaView
                style={{
                  backgroundColor: "white",
                  width: "43%",
                  height: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.6,
                    },
                    android: {
                      elevation: 6,
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
                    fontSize: responsiveFontSize(2.25),
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
                //backgroundColor: "green",
              }}
            >
              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "43%",
                  height: "100%",
                  borderBottomEndRadius: 5,
                  borderBottomLeftRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 6,
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
                    //backgroundColor: "blue",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: responsiveFontSize(4.5),
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {dailySteps === null ? "--" : dailySteps}
                  </Text>
                </SafeAreaView>
                <SafeAreaView
                  style={{
                    width: "100%",
                    height: "30%",
                    //backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.smallText}>{StepsSyncTime || ""}</Text>
                </SafeAreaView>
              </SafeAreaView>

              <SafeAreaView
                style={{
                  backgroundColor: "whitesmoke",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "43%",
                  borderBottomEndRadius: 5,
                  borderBottomLeftRadius: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 6,
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
                      style={{ height: 29, width: 51 }}
                      source={require("../../assets/images/battery-full.imageset/battery-full.png")}
                    />
                  ) : BatteryLevel === "Medium" ? (
                    <Image
                      style={{ height: 29, width: 51 }}
                      source={require("../../assets/images/battery-medium.imageset/battery-medium.png")}
                    />
                  ) : (
                    <Image
                      style={{ height: 29, width: 51 }}
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
                  <Text style={styles.smallText}>
                    {BatteryLevel === null ? "Unlinked" : BatteryLevel}
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
    fontSize: responsiveFontSize(2.2),
  },
  smallText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(1.8),
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
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    // marginLeft: "2%",
  },
  images: {
    height: 25,
    width: 25,
  },
});
