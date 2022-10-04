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
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import call from "react-native-phone-call";
import { useDrawerStatus } from "@react-navigation/drawer";
import * as WebBrowser from "expo-web-browser";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { resetSelectedData, setSelectedUser } from "../redux/actions";

let date = moment().format("dddd, MMM D");

export default function GiverHomeScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [HeartBPM, setHeart] = useState(0);
  const [HeartMax, setHeartMax] = useState(0);
  const [HeartMin, setHeartMin] = useState(0);
  const [HeartAvg, setHeartAvg] = useState(0);
  const [fitbitAccessToken, setFitbitAccessToken] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();

  const number = selectedUser.phone || "0";
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    updateConnections();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const updateConnections = async () => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getDefaultRequest",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: JSON.stringify({
            caregiverID: tokenData.caregiverID,
            caregiveeID: null,
          }),
        }
      );
      const responseText = await response.text();
      const json = JSON.parse(responseText);

      if (json.default) dispatch(setSelectedUser(json.default));
      else dispatch(resetSelectedData());
    } catch (error) {
      console.log("Caught error in /getDefaultRequest on giverHome: " + error);
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
    try {
      let url =
        "https://www.carebit.xyz/notificationToken/" +
        tokenData.userID +
        "/" +
        token;

      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
      });
      const json = await response.json();
    } catch (error) {
      console.log("Caught error in /notificationToken: " + error);
    }
  };

  const refreshFitbitAccessToken = async (caregiveeID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/refreshFitbitToken/" + caregiveeID,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      if (json.access_token) setFitbitAccessToken(json.access_token);
      else console.log("Refreshing error: " + json.error);
    } catch (error) {
      console.log("Caught error in /refreshFitbitToken: " + error);
    }
  };
  const fetchFitbitAccessToken = async (caregiveeID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getFitbitToken/" + caregiveeID,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      if (!json.error) setFitbitAccessToken(json.fitbitToken);
      else console.log("Error: " + json.error);
    } catch (error) {
      console.log("Caught error in /getFitbitToken: " + error);
    }
  };
  const fetchData = async () => {
    const caregiveeID = selectedUser.caregiveeID;
    if (!fitbitAccessToken) {
      // Seems that refresh has a cooldown. Switch this on if u get invalid token
      // await refreshFitbitAccessToken();
      await fetchFitbitAccessToken(caregiveeID);
    } else {
      let date_today = moment().format("YYYY[-]MM[-]DD");
      //Get HeartRate
      let heartResponse = await fetch(
        "https://api.fitbit.com/1/user/" +
          caregiveeID +
          "/activities/heart/date/" +
          date_today +
          "/1d.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let heart = await heartResponse.json();

      // Checks for expired token
      if (heart.errors) {
        console.log("Refreshing ");
        await refreshFitbitAccessToken(caregiveeID);
        return;
      }

      setHeartAvg(heart["activities-heart"][0].value.restingHeartRate);
      setHeartMax(heart["activities-heart"][0].value.heartRateZones[3].max);
      setHeartMin(heart["activities-heart"][0].value.heartRateZones[0].min);

      //Get Steps
      let stepsResponse = await fetch(
        "https://api.fitbit.com/1/user/" +
          caregiveeID +
          "/activities/tracker/steps/date/" +
          date_today +
          "/1d.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let json = await stepsResponse.json();
      setSteps(json["activities-tracker-steps"][0].value);
      console.log("Steps: " + steps);
      //Get Battery
      //TODO: implement levels for different battery icons. getBatteryIcon(level)
      let deviceResponse = await fetch(
        "https://api.fitbit.com/1/user/-/devices.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let battery = await deviceResponse.json();
      console.log("Response from devices:");
      console.log(battery);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fitbitAccessToken]);

  const args = {
    number,
    prompt: true,
  };

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  console.log(tokenData);
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
            <TouchableOpacity style={{ marginLeft: "8%" }}>
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
                marginRight: "8%",
                //backgroundColor: "red",
                alignItems: "flex-end",
                justifyContent: "center",
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
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              //backgroundColor: "green",
              height: "9%",
              width: "100%",
            }}
          >
            <SafeAreaView
              style={{
                justifyContent: "center",

                //backgroundColor: "blue",
                height: "80%",
                width: "60%",
              }}
            >
              <Text
                style={{
                  //marginTop: "10%",
                  //marginLeft: "4%",
                  color: "darkgrey",
                  fontSize: responsiveFontSize(1.8),
                }}
              >
                Hello {tokenData.firstName || "N/A"}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: responsiveFontSize(2.2),
                  fontWeight: "500",
                  //flex: 1,
                  marginRight: "5%",
                  //marginLeft: "4%",
                }}
                numberOfLines={1}
              >
                Your Caregivee is {selectedUser.firstName || "N/A"}
              </Text>
            </SafeAreaView>
            <SafeAreaView
              style={{
                //marginTop: "4%",
                //backgroundColor: "red",
                width: "32%",
                height: "80%",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={styles.callBody}
                onPress={() => {
                  call(args).catch(console.error);
                }}
              >
                <Image
                  source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
                />
                <Text style={styles.callText}>
                  Call {selectedUser.firstName || "N/A"}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
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
              14 mins ago
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                  <Text style={styles.smallText}>14 mins ago</Text>
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                  <Text style={styles.smallText}>in past hour</Text>
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                  <Text style={styles.smallText}>14 mins ago</Text>
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
                      fontSize: responsiveFontSize(4.8),
                      fontWeight: "700",
                    }}
                  >
                    0
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
                  <Text style={styles.smallText}>in past hour</Text>
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
    //marginRight: "4%",
    //marginTop: Platform.OS == "ios" ? "10%" : "5%",
    justifyContent: "center",
  },
  callText: {
    color: "dodgerblue",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginLeft: "2%",
  },
  images: {
    height: 25,
    width: 25,
  },
});
