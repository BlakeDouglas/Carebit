import { StyleSheet, Text, SafeAreaView, Image, StatusBar } from "react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
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

export default function TesterScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity style={{ marginLeft: "6%" }}>
            <Text
              style={{
                color: "gray",
                fontWeight: "bold",
                marginVertical: "14%",
                justifyContent: "center",
              }}
            >
              0 Alerts Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: "6%",
              //backgroundColor: "red",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "dodgerblue",
                fontWeight: "bold",
                marginVertical: "14%",
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
                marginTop: "8%",
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
                marginTop: "2%",
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
            marginTop: "5%",
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
              marginTop: "4%",
              marginLeft: "4%",
            }}
          >
            Last Recorded Activity
          </Text>

          <Text
            style={{
              color: "darkgrey",
              fontSize: responsiveFontSize(1.8),
              marginTop: "4%",
              marginRight: "4%",
            }}
          >
            14 mins ago
          </Text>
        </SafeAreaView>

        <SafeAreaView style={{ marginTop: "3%" }}>
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
                  marginVertical: "8%",
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
                  marginBottom: "8%",
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
                  marginVertical: "8%",
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
                  marginBottom: "8%",
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
            marginTop: "5%",
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
              marginTop: "2%",
              marginLeft: "4%",
            }}
          >
            Today
          </Text>

          <Text
            style={{
              color: "darkgrey",
              fontSize: responsiveFontSize(1.8),
              marginTop: "2%",
              marginRight: "4%",
            }}
          >
            {date}
          </Text>
        </SafeAreaView>

        <SafeAreaView
          style={{
            marginTop: "3%",
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
                  marginTop: "8%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text style={[styles.smallText, { marginBottom: "10%" }]}>
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
                  marginTop: "8%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text style={[styles.smallText, { marginBottom: "10%" }]}>
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
                  marginTop: "8%",
                  // marginBottom: "2%",
                }}
              >
                0
              </Text>
              <Text style={[styles.smallText, { marginBottom: "10%" }]}>
                max
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView style={{ marginTop: "6%" }}>
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
                  marginVertical: "8%",
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
                  marginBottom: "8%",
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
                  marginVertical: "8%",
                }}
              >
                <Image
                  style={{ marginLeft: "4%" }}
                  source={require("../../assets/images/batterymedium/batterymedium.png")}
                />
              </SafeAreaView>
              <SafeAreaView
                style={{
                  width: "100%",
                  marginBottom: "8%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.smallText}>medium</Text>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </ScrollView>
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
    borderRadius: 5,
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
    flexDirection: "row",
    marginRight: "4%",
    marginTop: "6%",
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
