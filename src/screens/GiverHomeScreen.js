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
import EStyleSheet from "react-native-extended-stylesheet";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
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

export default function GiverHomeScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.sBar}>
        <MyStatusBar backgroundColor="dodgerblue" barStyle="light-content" />
      </View>
      <View style={styles.mainWrapper}>
        {/*=====================Top Container=================================*/}
        <SafeAreaView style={styles.topContainer}>
          <View style={styles.topContainerContent}>
            <View>
              <Image
                source={require("../../assets/images/settings/settings.png")}
              />
            </View>
            <View style={styles.lastSyncContainer}>
              <Text style={[styles.h3, styles.syncText]}> Carebit</Text>
              <Text style={[styles.h4, styles.syncText]}>
                Last Sync 15 mins ago
              </Text>
            </View>
            <View>
              <Image
                source={require("../../assets/images/readMessage/readMessage.png")}
              />
            </View>
          </View>

          {/*Alerts Container*/}

          <View style={styles.alertsContainer}>
            <Text style={styles.h4}> 0 Alerts Today</Text>
            <Text style={[styles.h4, styles.viewhistory]}> View History</Text>
          </View>
          {/*Greetings Container*/}
          <View style={styles.greetingsContainer}>
            <View style={styles.greetingsContainerContent}>
              <Text style={styles.h4}> Hello Name</Text>
              <Text style={styles.h2}> Some other text goes in here</Text>
            </View>
          </View>
        </SafeAreaView>
        {/*=====================Bottom Container=================================*/}

        <View style={styles.contentContainer}>
          {/*HeartRate & Steps Container*/}
          <View style={styles.dataContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.h3}>Last Recorded activity</Text>
              <Text style={styles.h4}>Time</Text>
            </View>
            <View style={styles.dataCardsContainer}>
              <View style={styles.smallCard}>
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    <Image
                      source={require("../../assets/images/heart/heart.png")}
                    />
                    <Text style={styles.h2}>Heart Rate</Text>
                  </View>
                </View>
                <View style={styles.inCard}>
                  <View style={styles.heartData}>
                    <Text style={styles.h1}>74</Text>
                    <Text style={styles.h4}>BPM</Text>
                  </View>
                  <View>
                    <Text style={styles.h4}>15 mins ago</Text>
                  </View>
                </View>
              </View>
              <View style={styles.smallCard}>
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    <Image
                      source={require("../../assets/images/steps/steps.png")}
                    />
                    <Text style={styles.h2}>Steps</Text>
                  </View>
                </View>
                <View style={styles.inCard}>
                  <Text style={styles.h1}>174</Text>

                  <Text style={styles.h4}>15 mins ago</Text>
                </View>
              </View>
            </View>
          </View>

          {/*Summary Container*/}
          <View style={styles.summaryContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.h3}>Today</Text>
              <Text style={styles.h4}>Date</Text>
            </View>
            <View style={styles.largeCardContainer}>
              <View style={styles.largeCard}>
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    <Image
                      source={require("../../assets/images/heart/heart.png")}
                    />
                    <Text style={styles.h2}>Heart Rate Summary</Text>
                  </View>

                  <Text style={styles.h4}>BPM</Text>
                </View>
                <View style={styles.summaryDataContainer}>
                  <View style={styles.leftBoarder}>
                    <View style={styles.inCard}>
                      <Text style={styles.h1}>74</Text>
                      <Text style={styles.h4}>min</Text>
                    </View>
                  </View>
                  <View style={styles.leftBoarder}>
                    <View style={styles.inCard}>
                      <Text style={styles.h1}>74</Text>
                      <Text style={styles.h4}>average</Text>
                    </View>
                  </View>
                  <View style={styles.leftBoarder}>
                    <View style={[styles.inCard]}>
                      <Text style={styles.h1}>74</Text>
                      <Text style={styles.h4}>max</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/*Total steps and Battery Container*/}
          <View style={styles.batteryContainer}>
            <View style={styles.smallCard}>
              <View style={styles.cardTitle}>
                <View style={styles.title}>
                  <Image source={require("../../assets/images/steps/steps.png")} />
                  <Text style={styles.h2}>Total Steps</Text>
                </View>
              </View>
              <View style={styles.inCard}>
                <Text style={styles.h1}>174</Text>

                <Text style={styles.h4}>15 mins ago</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.cardTitle}>
                <View style={styles.title}>
                  <Image
                    source={require("../../assets/images/fitbit/fitbit.png")}
                  />
                  <Text style={styles.h2}>Fitbit Battery</Text>
                </View>
              </View>
              <View style={styles.inCard}>
                <View style={styles.batteryImage}>
                  <Image
                    source={require("../../assets/images/batterymedium/batterymedium.png")}
                  />
                </View>
                <Text style={styles.h4}>15 mins ago</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "whitesmoke",
    justifyContent: "space-evenly",

    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  mainWrapper: {
    flex: 1,
  },
  sBar: {
    backgroundColor: "dodgerblue",
  },

  topContainer: {
    justifyContent: "space-evenly",
    backgroundColor: "dodgerblue",
  },

  topContainerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  lastSyncContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    marginBottom: "1.5rem",
    marginTop: "0.9375rem",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },

  alertsContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0.625rem",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  titleContainer: {
    padding: "0.625rem",
    marginBottom: "0.625rem",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  syncText: {
    fontWeight: "bold",
    color: "white",
  },
  viewhistory: {
    color: "dodgerblue",
    fontSize: "0.9375rem",
    fontWeight: "bold",
  },
  h1: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  h2: {
    fontSize: "1.25rem",
  },
  h3: {
    fontSize: "1.063rem",
  },
  h4: {
    fontSize: "0.9375rem",
    color: "grey",
    fontWeight: "500",
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  largeCardContainer: {
    margin: "0.9375rem",
    marginTop: 0,
  },
  largeCard: {
    marginTop: 0,
    backgroundColor: "white",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  greetingsContainerContent: {
    marginTop: '0.625rem',
  },
  greetingsContainer: {
    backgroundColor: "whitesmoke",
    padding: '0.625rem',
  },
  dataCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: '0.9375rem',
  },
  dataContainer: {
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },
  leftBoarder: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
  },
  smallCard: {
    backgroundColor: "white",
    width: "11.25rem",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    padding: '0.625rem',
    flexDirection: "row",
    borderBottomColor: "lightgrey",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    width: "100%",
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderBottomColor: "whitesmoke",
      },
      default: {
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.25,
      },
    }),
  },
  heartData: {
    flexDirection: "row",
  },

  summaryContainer: {
    marginBottom: "0.625rem",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },
  inCard: {
    padding: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryDataContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  batteryContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: "1.5rem",
  },
  batteryImage: {
    padding: "0.625rem",
  },
});
EStyleSheet.build({});