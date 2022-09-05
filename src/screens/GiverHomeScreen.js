import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import moment from "moment";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import call from "react-native-phone-call";

const args = {
  number: "4077777777",
  prompt: true,
};

const fetchFitbitData = (tokenData) => {
  refreshToken(tokenData);
  fetch("https://api.fitbit.com/1/user/-/profile.json", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + tokenData.access_token,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("FETCH GOT: " + JSON.stringify(json));
    })
    .catch((error) => {
      console.log(error);
    });
};

const refreshToken = (tokenData) => {
  fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic MjM4UVMzOjYzZTJlNWNjY2M2OWY2ZThmMTk4Yjg2ZDYyYjUyYzE5",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(JSON.stringify(json));
    })
    .catch((error) => {
      console.log("Got error: " + error);
    });
};

let date = moment().format("dddd, MMM D");

export default function GiverHomeScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{ height: "100%", width: "100%", backgroundColor: "whitesmoke" }}
    >
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
          <Text style={styles.helloText}>Hello Name</Text>
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
                74
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
                523
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
              74
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
              74
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
              74
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
                80
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
