import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  RefreshControl,
  useWindowDimensions,
} from "react-native";

import { responsiveFontSize } from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { getAlertsEndpoint } from "../network/CarebitAPI";
import moment from "moment";

export default function ReceivedAlertsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const [data, setData] = useState([]);
  const [backgroundData, setBackgroundData] = useState([]);

  // Note that 6 is a full page of alerts. Starting with 6 as the default shown will immediately load more at start
  const increment = 10; // Number to load each time the bottom of the list is reached
  const defaultShown = 8; // This is the default number of alerts to show

  const [maxShown, setMaxShown] = useState(0);

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  // Used to fix accessibility zoom issue
  const { fontScale } = useWindowDimensions();

  // Refresh prop to check for alerts on manual refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAlerts();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // Calculates first list to dynamically load
  const getFirst = (arr, n) => {
    if (n === 0) return [];
    if (arr.length === 0) return [];
    let retArr = [];
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      retArr.push(arr[i]);
    }
    return retArr;
  };

  // Returns json of all alerts
  const getAlerts = async () => {
    if (!selectedUser.caregiveeID) return;
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
    };
    const json = await getAlertsEndpoint(params);
    if (json) {
      setMaxShown(defaultShown);
      setBackgroundData(json.alerts.reverse());
      setData(getFirst(json.alerts, defaultShown));
    }
  };

  // Get all alerts when screen is loaded
  useEffect(() => {
    getAlerts();
  }, []);

  // Load first amount of alerts
  useEffect(() => {
    setData(getFirst(backgroundData, maxShown));
  }, [maxShown, backgroundData]);

  // Main rendered content
  const Item = ({ alertType, time, date, body, title, ok }) => (
    <SafeAreaView
      style={{
        marginVertical: "1%",
        flexDirection: "row",
        alignItems: "center",
        borderTopColor: "lightgrey",
        borderTopWidth: moderateScale(1),
      }}
    >
      {/* Renders appropriate image based on type returned from database */}
      {alertType === "tooManyStepsAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-steps-high.imageset/icons-alert-steps-high.png")}
        />
      )}
      {alertType === "noStepsAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-steps-none.imageset/icons-alert-steps-none.png")}
        />
      )}
      {alertType === "highHeartRateAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-high.imageset/icons-alert-heart-high.png")}
        />
      )}
      {alertType === "lowHeartRateAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-low.imageset/icons-alert-heart-low.png")}
        />
      )}
      {alertType === "noHeartRateAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-none.imageset/icons-alert-heart-none.png")}
        />
      )}
      {alertType === "noSyncAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-sync.imageset/icons-alert-sync.png")}
        />
      )}
      {alertType === "batteryAlert" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-battery.imageset/icons-alert-battery.png")}
        />
      )}
      {/* Title and description container */}
      <SafeAreaView
        style={{
          marginLeft: "3%",
          width: "58%",
          marginRight: "4%",
          marginVertical: moderateScale(18.5),
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(17) / fontScale,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: "1%",
            fontSize: moderateScale(14) / fontScale,
            color: "gray",
          }}
          numberOfLines={3}
        >
          {body}
        </Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          marginLeft: "1%",
          marginRight: "3%",
          justifyContent: "space-evenly",
        }}
      >
        {/* Checks if ok has been set or not to display OKAY mark */}
        {ok === 1 ? (
          <Text
            style={{
              color: "rgba(0,225,200,.6)",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: moderateScale(17.8) / fontScale,
              marginTop: "10%",
            }}
          >
            OKAY
          </Text>
        ) : (
          <Text
            style={{
              textAlign: "right",
              fontSize: moderateScale(17.8) / fontScale,
              marginTop: "10%",
            }}
          >
            {" "}
          </Text>
        )}
        <Text
          style={{
            color: "grey",
            marginTop: "5%",
            fontSize: moderateScale(14.5) / fontScale,
          }}
        >
          {moment(time, ["HH:mm"]).format("h:mm a")}
        </Text>
        <Text
          style={{
            color: "grey",
            alignSelf: "center",
            fontSize: moderateScale(14.5) / fontScale,
          }}
        >
          {moment(date, ["MM:DD"]).format("MMM DD")}
        </Text>
      </SafeAreaView>
    </SafeAreaView>
  );
  // Feeds item prop the correct data
  const renderItem = ({ item }) => (
    <Item
      alertType={item.alertType}
      time={item.dateTime.substring(
        item.dateTime.indexOf(" ") + 1,
        item.dateTime.indexOf(":") + 3
      )}
      date={item.dateTime.substring(5, item.dateTime.indexOf(" "))}
      body={item.body}
      title={item.title}
      ok={item.ok}
    />
  );
  // Content rendered for empty flatlist
  const Empty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            { fontSize: moderateScale(27) / fontScale },
          ]}
        >
          No alerts
        </Text>
        <Text
          style={[
            styles.emptyText,
            { fontSize: moderateScale(27) / fontScale },
          ]}
        >
          ...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        alignSelf: "flex-end",
        height: "100%",
        width: "97%",
      }}
    >
      <SafeAreaView
        style={{
          width: "100%",
          alignSelf: "center",
          height: "7%",
          justifyContent: "flex-end",
          marginBottom: moderateScale(22),
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(19.4) / fontScale,
            fontWeight: "600",
          }}
        >
          All Alerts
        </Text>
      </SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.alertID}
        ListEmptyComponent={Empty}
        onEndReachedThreshold={0.01}
        onEndReached={(info) => {
          console.log("End reached. Loading more.");
          setMaxShown(Math.min(maxShown + increment, backgroundData.length));
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  images: {
    height: moderateScale(50),
    width: moderateScale(50),
  },
  emptyText: {
    color: "black",
    fontSize: responsiveFontSize(3.5),
    alignSelf: "center",
  },
  emptyContainer: {
    paddingTop: "5%",
    borderTopColor: "lightgrey",
    borderTopWidth: moderateScale(1),
  },
});
