import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
export default function GiverHomeScreen(tokenData) {
  // BAD FUNCTION, DO NOT USE OUTSIDE OF DEMO
  const fetchData = async (inputs, tokenData) => {
    try {
      let response = await fetch(
        "https://api.fitbit.com/1/user/B4QY3P/profile.json",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: JSON.stringify({
            ...inputs,
            caregiveeID: tokenData.caregiveeId,
          }),
        }
      );
      const json = await response.json();
      dispatch(setPhysicianData(json.cgvee));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sBar}>
        <MyStatusBar backgroundColor="dodgerblue" barStyle="light-content" />
      </View>
      <View style={styles.mainWrapper}>
        {/*=====================Top Container=================================*/}
        <SafeAreaView style={styles.topContainer}>
          {/* last Sync Container*/}
          <View style={styles.topContainerContent}>
            {/* Settings Button*/}
            <TouchableOpacity>
              <Image
                source={require("../../assets/images/settings/settings.png")}
              />
            </TouchableOpacity>

            {/* last Sync Information*/}
            <View style={styles.lastSyncContainer}>
              <Text style={[styles.h3, styles.syncText]}> Carebit</Text>
              <Text style={[styles.h4, styles.syncText]}>
                Last Sync 15 mins ago
              </Text>
            </View>

            {/* Messages / Chat Button*/}
            <TouchableOpacity>
              <Image
                source={require("../../assets/images/readMessage/readMessage.png")}
              />
            </TouchableOpacity>
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

        {/*=================================Bottom Container=================================*/}

        <View style={styles.contentContainer}>
          {/*======================HeartRate & Steps Container======================*/}
          <View style={styles.dataContainer}>
            {/* Title for the View containing Heart rate and steps data */}
            <View style={styles.titleContainer}>
              <Text style={styles.h3}>Last Recorded activity</Text>
              <Text style={styles.h4}>Time</Text>
            </View>

            {/* Container holding the cards with heart rate and steps*/}
            <View style={styles.dataCardsContainer}>
              {/* Small Card >> Heart Rate*/}
              <View style={styles.smallCard}>
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    {/* Loading the icon Image for Heart Rate from the Assets Folder*/}
                    <Image
                      source={require("../../assets/images/heart/heart.png")}
                    />

                    {/* Text for the Title*/}
                    <Text style={styles.h2}>Heart Rate</Text>
                  </View>
                </View>

                {/* HeartRate Data from FitBit will be loaded here "74" here is just for illustration */}
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

              {/* Small Card >> Steps*/}
              <View style={styles.smallCard}>
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    {/* Loading the Image for Steps*/}
                    <Image
                      source={require("../../assets/images/steps/steps.png")}
                    />
                    <Text style={styles.h2}>Steps</Text>
                  </View>
                </View>

                {/* Steps Data from FitBit will be loaded here "174" here is just for illustration */}
                <View style={styles.inCard}>
                  <Text style={styles.h1}>174</Text>
                  <Text style={styles.h4}>15 mins ago</Text>
                </View>
              </View>
            </View>
          </View>
          {/*======================HeartRate & Steps Container ends here======================*/}

          {/*======================Summary Container======================*/}
          <View style={styles.summaryContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.h3}>Today</Text>
              <Text style={styles.h4}>Date</Text>
            </View>

            {/* Large Card for summary data */}
            <View style={styles.largeCardContainer}>
              <View style={styles.largeCard}>
                {/* Title for the large card */}
                <View style={styles.cardTitle}>
                  <View style={styles.title}>
                    {/* Loading the icon image from assets folder */}
                    <Image
                      source={require("../../assets/images/heart/heart.png")}
                    />
                    <Text style={styles.h2}>Heart Rate Summary</Text>
                  </View>

                  <Text style={styles.h4}>BPM</Text>
                </View>

                {/* Summary container that holds the data inside the large card */}
                <View style={styles.summaryDataContainer}>
                  {/* Container for Min Heart rate */}
                  <View style={styles.leftBoarder}>
                    <View style={styles.inCard}>
                      <Text style={styles.h1}>74</Text>
                      <Text style={styles.h4}>min</Text>
                    </View>
                  </View>
                  {/* Container for Avg Heart rate */}
                  <View style={styles.leftBoarder}>
                    <View style={styles.inCard}>
                      <Text style={styles.h1}>74</Text>
                      <Text style={styles.h4}>average</Text>
                    </View>
                  </View>
                  {/* Container for Max Heart rate */}
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
          {/*======================Summary Container ends here======================*/}

          {/*======================Total steps and Battery Container======================*/}
          <View style={styles.batteryContainer}>
            {/* Small Container for total Steps at the bottom */}
            <View style={styles.smallCard}>
              <View style={styles.cardTitle}>
                <View style={styles.title}>
                  <Image
                    source={require("../../assets/images/steps/steps.png")}
                  />
                  <Text style={styles.h2}>Total Steps</Text>
                </View>
              </View>
              <View style={styles.inCard}>
                <Text style={styles.h1}>174</Text>

                <Text style={styles.h4}>15 mins ago</Text>
              </View>
            </View>

            {/* Small Container for Battery LEvel at the bottom */}
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
                  {/* Battery level Image, NOTE: we will compute the image to display depending on battery levels Empty, mid, full... */}
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
  //Fonts / Sizes
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

  //================================================================================================================//
  //                                             MAIN VIEW Starts here                                              //
  //================================================================================================================//

  container: {
    backgroundColor: "whitesmoke", // sets the background color of the main View
    flex: 1, // This fills up the whole space .. setting flex: 0.5 would occupy 50% of the space
    ...Platform.select({
      // We want to set the distance for save view below the status bar.
      android: {
        //...platform.select choses the platform we want to apply the style to
        paddingTop: StatusBar.currentHeight, // e.g "StatusBar.currentHeight" this method is not available for iOS devices
      },
    }),
  },
  mainWrapper: {
    flex: 1,
  },

  //======================================Top Container======================================//
  topContainer: {
    justifyContent: "space-evenly",
  },

  //==========The dodger blue top container with Last sync info==========//
  topContainerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "dodgerblue",
  },
  lastSyncContainer: {
    alignItems: "center",
    justifyContent: "center", // ce
    marginBottom: "1.5rem",
    marginTop: "0.9375rem",
  },

  //==========The dodger blue top container with Last sync info ends here==========//

  //==========Alerts Container==========//
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
  syncText: {
    fontWeight: "bold",
    color: "white",
  },
  viewhistory: {
    color: "dodgerblue",
    fontSize: "0.9375rem",
    fontWeight: "bold",
  },
  greetingsContainerContent: {
    marginTop: "0.625rem",
  },
  greetingsContainer: {
    backgroundColor: "whitesmoke",
    padding: "0.625rem",
  },

  //======================================Content Container======================================//

  contentContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },

  titleContainer: {
    padding: "0.625rem",
    marginBottom: "0.625rem",
    flexDirection: "row",
    justifyContent: "space-between",
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
  dataCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: "0.9375rem",
  },
  dataContainer: {
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },

  heartData: {
    flexDirection: "row",
  },

  summaryContainer: {
    marginBottom: "0.625rem",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
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

  //===============================Large Card and Small Card Styles===============================//
  cardTitle: {
    padding: "0.625rem",
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

  inCard: {
    padding: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
  },

  smallCard: {
    backgroundColor: "white",
    width: "11.25rem",
    borderRadius: "0.625rem",
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

  largeCard: {
    marginTop: 0,
    backgroundColor: "white",
    borderRadius: "0.625rem",
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

  // This container is used on the large card container to give the division line effect
  leftBoarder: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
  },
  //===============================Large Card and Small Card Styles end here===============================//
});

//Here we specify our rem for resizing on smaller screens

const getScreenWidth = Dimensions.get("window").width;
EStyleSheet.build({ $rem: getScreenWidth / 25 });
