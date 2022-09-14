import { StyleSheet, Text, SafeAreaView, Image, StatusBar } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import moment from "moment";
import { Provider, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import call from "react-native-phone-call";
import { useDrawerStatus } from "@react-navigation/drawer";
import * as WebBrowser from "expo-web-browser";

const args = {
  number: "4077777777",
  prompt: true,
};

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
  const selectedID = 0;

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
      if (!json.error)
        setFitbitAccessToken(json.fitbitToken);
      else
        console.log("Error: " + json.error);
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  const fetchData = async () => {
    const caregiveeID = tokenData.caregiveeID[selectedID].caregiveeID;
    if (!fitbitAccessToken) {
      // Seems that refresh has a cooldown. Switch this on if u get invalid token
      // await refreshFitbitAccessToken();
      await fetchFitbitAccessToken(caregiveeID);
    } else {
      let date_today = moment().format("YYYY[-]MM[-]DD");
      //Get HeartRate
      let heartResponse = await fetch(
        "https://api.fitbit.com/1/user/" + caregiveeID + "/activities/heart/date/" + date_today + "/1d.json",
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
        "https://api.fitbit.com/1/user/" + caregiveeID + "/activities/tracker/steps/date/" + date_today + "/1d.json",
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
    <SafeAreaView
      style={{ height: "100%", width: "100%", backgroundColor: "whitesmoke" }}
    >
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      <SafeAreaView
        style={{
          height: "6%",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text
          style={{
            color: "gray",
            fontWeight: "bold",
            marginRight: "44%",
            marginLeft: "5%",
          }}
        >
          0 Alerts Today
        </Text>
        <Text
          style={{ color: "dodgerblue", fontWeight: "bold", marginRight: "5%" }}
        >
          View History
        </Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          width: "100%",
          height: "8%",
          marginTop: "3%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SafeAreaView>
          <Text style={styles.helloText}>Hello {userData.firstName}</Text>
          <Text style={styles.caregiveeText}>Your caregivee is Pam</Text>
        </SafeAreaView>

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
      <SafeAreaView
        style={{
          marginTop: "3%",
          marginBottom: "3%",
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
      ></SafeAreaView>
      <SafeAreaView style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.lastActivityText}>Last Recorded Activity</Text>
        <Text style={styles.smallText}>14 mins ago</Text>
      </SafeAreaView>
      <SafeAreaView style={{ height: "18%", width: "100%", marginTop: "3%" }}>
        <SafeAreaView
          style={{
            height: "25%",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "white",
              marginLeft: "5%",
              height: "100%",
              width: "43%",
              alignItems: "center",
              flexDirection: "row",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.6,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <Image
              style={{ marginLeft: "4%" }}
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
              marginLeft: "4%",
              height: "100%",
              width: "43%",
              alignItems: "center",
              flexDirection: "row",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <Image
              style={{ marginLeft: "4%" }}
              source={require("../../assets/images/steps/steps.png")}
            />
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.25),
                marginLeft: "5%",
              }}
            >
              Steps
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView
          style={{
            height: "75%",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "whitesmoke",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "43%",
              marginLeft: "5%",
              borderBottomEndRadius: 8,
              borderBottomLeftRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
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
                {HeartBPM}
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
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.smallText, { marginLeft: "0%" }]}>
                14 mins ago
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              backgroundColor: "whitesmoke",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "43%",
              marginLeft: "4%",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
                },
              }),
              borderBottomEndRadius: 8,
              borderBottomLeftRadius: 8,
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
                N/A
              </Text>
            </SafeAreaView>
            <SafeAreaView
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                height: "30%",
                width: "100%",
              }}
            >
              <Text style={[styles.smallText, { marginLeft: "0%" }]}>
                in past hour
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView
        style={{
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          marginTop: "4%",
          marginBottom: "3%",
        }}
      ></SafeAreaView>
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "5%",
        }}
      >
        <Text style={styles.lastActivityText}>Today</Text>
        <Text style={styles.dateText}>{date}</Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          marginTop: "2%",
          alignSelf: "center",
          backgroundColor: "white",
          marginLeft: "4%",
          marginRight: "4%",
          width: "90%",
          height: "18%",
          borderRadius: 8,
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            height: "30%",
            width: "100%",
            alignItems: "center",
            borderTopStartRadius: 8,
            borderTopRightRadius: 8,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.4,
              },
              android: {
                elevation: 4,
              },
            }),
          }}
        >
          <Image
            style={{ marginLeft: "3%" }}
            source={require("../../assets/images/heart/heart.png")}
          />
          <Text
            style={{
              color: "black",
              fontSize: responsiveFontSize(2.25),
              marginLeft: "1%",
            }}
          >
            Heart Rate Summary
          </Text>
          <Text
            style={{
              color: "darkgrey",
              fontSize: responsiveFontSize(1.8),
              marginLeft: "28%",
            }}
          >
            BPM
          </Text>
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
                elevation: 4,
              },
            }),
            borderBottomEndRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <SafeAreaView
            style={{
              height: "100%",
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
              }}
            >
              {HeartMin}
            </Text>
            <Text style={[styles.smallText, { marginLeft: 0, marginTop: 0 }]}>
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
              height: "100%",
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
              }}
            >
              {HeartAvg}
            </Text>
            <Text style={[styles.smallText, { marginLeft: 0, marginTop: 0 }]}>
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
              height: "100%",
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
              }}
            >
              {HeartMax}
            </Text>
            <Text style={[styles.smallText, { marginLeft: 0, marginTop: 0 }]}>
              max
            </Text>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView
        style={{
          height: "18%",
          width: "100%",
          marginTop: "5%",
        }}
      >
        <SafeAreaView
          style={{
            height: "25%",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "white",
              marginLeft: "5%",
              height: "100%",
              width: "43%",
              alignItems: "center",
              flexDirection: "row",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.6,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <Image
              style={{ marginLeft: "4%" }}
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
              marginLeft: "4%",
              height: "100%",
              width: "43%",
              alignItems: "center",
              flexDirection: "row",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <Image
              style={{ marginLeft: "4%" }}
              source={require("../../assets/images/fitbit/fitbit.png")}
            />
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.25),
                marginLeft: "5%",
              }}
            >
              Fitbit Battery
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView
          style={{
            height: "75%",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "whitesmoke",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "43%",
              marginLeft: "5%",
              borderBottomEndRadius: 8,
              borderBottomLeftRadius: 8,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
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
                {steps}
              </Text>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "30%",
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={[styles.smallText, { marginLeft: "0%" }]}>
                today
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              backgroundColor: "whitesmoke",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "43%",
              marginLeft: "4%",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 4,
                },
              }),
              borderBottomEndRadius: 8,
              borderBottomLeftRadius: 8,
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
              <Image
                style={{ marginLeft: "4%" }}
                source={require("../../assets/images/batterymedium/batterymedium.png")}
              />
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "30%",
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={[styles.smallText, { marginLeft: "0%" }]}>
                medium
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  smallCard: {
    backgroundColor: "white",
    marginLeft: "4%",
    marginTop: "3%",
    height: "100%",
    width: "43%",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  helloText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginLeft: "5%",
  },
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
    marginLeft: "20%",
  },
  pullingDataStyle: {
    color: "black",
    fontSize: responsiveFontSize(4.8),
    fontWeight: "700",
  },
  dateText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
    marginLeft: "45%",
  },
  callBody: {
    alignItems: "center",
    marginLeft: "10%",
    flexDirection: "row",
    justifyContent: "center",
  },
  callText: {
    color: "dodgerblue",
    fontSize: responsiveFontSize(2.25),
    fontWeight: "bold",
    marginLeft: "2%",
  },
});
