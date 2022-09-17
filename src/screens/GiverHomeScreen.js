import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import moment from "moment";
import { Provider, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import call from "react-native-phone-call";
import { useDrawerStatus } from "@react-navigation/drawer";
import * as WebBrowser from "expo-web-browser";

let date = moment().format("dddd, MMM D");

export default function GiverHomeScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [HeartBPM, setHeart] = useState(0);
  const [HeartMax, setHeartMax] = useState(0);
  const [HeartMin, setHeartMin] = useState(0);
  const [HeartAvg, setHeartAvg] = useState(0);
  const [fitbitAccessToken, setFitbitAccessToken] = useState(null);
  const userData = useSelector((state) => state.Reducers.userData);
  const tokenData = useSelector((state) => state.Reducers.tokenData);

  const args = {
    number: tokenData.caregiveeID[tokenData.selected].phone,
    prompt: true,
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

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
      console.log("Caught error: " + error);
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
      console.log("Caught error: " + error);
    }
  };

  const fetchData = async () => {
    const caregiveeID = tokenData.caregiveeID[tokenData.selected].caregiveeID;
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
    fetchData();
  }, [fitbitAccessToken]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity style={{ marginLeft: "8%" }}>
            <Text
              style={{
                color: "gray",
                fontWeight: "bold",
                marginVertical: Platform.OS === "ios" ? "10%" : "8%",
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
                marginVertical: Platform.OS === "ios" ? "10%" : "8%",
              }}
            >
              View History
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        <SafeAreaView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "whitesmoke",
          }}
        >
          <SafeAreaView>
            <Text
              style={{
                marginTop: Platform.OS == "ios" ? "10%" : "4%",
                marginLeft: "4%",
                color: "darkgrey",
                fontSize: responsiveFontSize(1.8),
              }}
            >
              Hello Testing Care
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.4),
                fontWeight: "500",
                marginLeft: "4%",
              }}
            >
              Your Caregivee is Paola
            </Text>
          </SafeAreaView>
          <SafeAreaView>
            <TouchableOpacity
              style={styles.callBody}
              onPress={() => {
                call(args).catch(console.error);
              }}
            >
              <Image
                source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
              />
              <Text style={styles.callText}>Call Paola</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView
          style={{
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
            marginTop: Platform.OS == "ios" ? "4%" : "3%",
          }}
        ></SafeAreaView>

        <SafeAreaView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: responsiveFontSize(2.2),
              marginTop: Platform.OS == "ios" ? "4%" : "2%",
              marginLeft: "4%",
            }}
          >
            Last Recorded Activity
          </Text>

          <Text
            style={{
              color: "darkgrey",
              fontSize: responsiveFontSize(1.8),
              marginTop: Platform.OS == "ios" ? "4%" : "2%",
              marginRight: "4%",
            }}
          >
            14 mins ago
          </Text>
        </SafeAreaView>

        <SafeAreaView style={{ marginTop: Platform.OS == "ios" ? "4%" : "2%" }}>
          <SafeAreaView
            style={{
              flexDirection: "row",
              //backgroundColor: "red",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "white",

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
                  marginVertical: "3%",
                }}
              >
                Heart Rate
              </Text>
            </SafeAreaView>

            <SafeAreaView
              style={{
                backgroundColor: "white",
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
                  marginVertical: "3%",
                }}
              >
                Steps
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "whitesmoke",
                justifyContent: "center",
                alignItems: "center",
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
                  width: "100%",
                  marginVertical: Platform.OS === "ios" ? "8%" : "0%",
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
                  marginBottom: Platform.OS === "ios" ? "5%" : "3%",
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
                  width: "100%",
                  marginVertical: Platform.OS === "ios" ? "8%" : "0%",
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
                  marginBottom: Platform.OS === "ios" ? "5%" : "3%",
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
            marginTop: Platform.OS == "ios" ? "5%" : "3%",
          }}
        ></SafeAreaView>
        <SafeAreaView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: responsiveFontSize(2.2),
              marginTop: Platform.OS == "ios" ? "5%" : "2%",
              marginLeft: "4%",
            }}
          >
            Today
          </Text>

          <Text
            style={{
              color: "darkgrey",
              fontSize: responsiveFontSize(1.8),
              marginTop: Platform.OS == "ios" ? "5%" : "2%",
              marginRight: "4%",
            }}
          >
            {date}
          </Text>
        </SafeAreaView>

        <SafeAreaView
          style={{
            marginTop: Platform.OS == "ios" ? "5%" : "2%",
            alignSelf: "center",
            backgroundColor: "white",
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
                  marginVertical: "3%",
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: responsiveFontSize(4.8),
                  fontWeight: "700",
                  marginTop: Platform.OS == "ios" ? "8%" : "0%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text
                style={[
                  styles.smallText,
                  { marginBottom: Platform.OS == "ios" ? "8%" : "0%" },
                ]}
              >
                min
              </Text>
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: responsiveFontSize(4.8),
                  fontWeight: "700",
                  marginTop: Platform.OS == "ios" ? "8%" : "0%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text
                style={[
                  styles.smallText,
                  { marginBottom: Platform.OS == "ios" ? "8%" : "0%" },
                ]}
              >
                average
              </Text>
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: responsiveFontSize(4.8),
                  fontWeight: "700",
                  marginTop: Platform.OS == "ios" ? "8%" : "0%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text
                style={[
                  styles.smallText,
                  { marginBottom: Platform.OS == "ios" ? "8%" : "0%" },
                ]}
              >
                max
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView
          style={{ marginTop: Platform.OS === "ios" ? "6%" : "4%" }}
        >
          <SafeAreaView
            style={{
              flexDirection: "row",
              //backgroundColor: "red",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "white",

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
                  marginVertical: "3%",
                }}
              >
                Total Steps
              </Text>
            </SafeAreaView>

            <SafeAreaView
              style={{
                backgroundColor: "white",
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
                source={require("../../assets/images/fitbit/fitbit.png")}
              />
              <Text
                style={{
                  color: "black",
                  fontSize: responsiveFontSize(2.25),
                  marginLeft: "5%",
                  marginVertical: "3%",
                }}
              >
                Fitbit Battery
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "whitesmoke",
                justifyContent: "center",
                alignItems: "center",
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
                  width: "100%",
                  marginVertical: Platform.OS === "ios" ? "8%" : "0%",
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
                  marginBottom: Platform.OS == "ios" ? "8%" : "0%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.smallText}>today</Text>
              </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView
              style={{
                backgroundColor: "whitesmoke",
                justifyContent: "center",
                alignItems: "center",
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
                  width: "100%",
                  marginVertical: Platform.OS === "ios" ? "14%" : "12%",
                }}
              >
                <Image
                  style={{ alignSelf: "center" }}
                  source={require("../../assets/images/batterymedium/batterymedium.png")}
                />
              </SafeAreaView>
              <SafeAreaView
                style={{
                  width: "100%",
                  marginBottom: Platform.OS == "ios" ? "8%" : "0%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.smallText}>medium</Text>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
        <Text></Text>
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
    marginRight: "4%",
    marginTop: Platform.OS == "ios" ? "10%" : "5%",
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
