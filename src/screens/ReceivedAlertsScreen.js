import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";

import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { getAlertsEndpoint } from "../network/CarebitAPI";
import moment from "moment";

export default function ReceivedAlertsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAlerts();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const getAlerts = async () => {
    if (!selectedUser.caregiveeID) return;
    const params = {
      auth: tokenData.access_token,
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
    };
    const json = await getAlertsEndpoint(params);
    if (json) {
      setData(json.alerts.reverse().splice(0, 50));
      console.log(data);
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  const Item = ({ alertType, dateTime, body, title, ok }) => (
    <SafeAreaView
      style={{
        marginVertical: "1%",
        flexDirection: "row",
        alignItems: "center",
        borderTopColor: "lightgrey",
        borderTopWidth: 1,
      }}
    >
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
      <SafeAreaView
        style={{
          marginLeft: "3%",
          width: "58%",
          marginRight: "4%",
          marginVertical: "5%",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.2), fontWeight: "600" }}>
          {title}
        </Text>
        <Text
          style={{
            marginTop: "1%",
            fontSize: responsiveFontSize(1.8),
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
        {ok === 1 ? (
          <Text
            style={{
              color: "rgba(0,225,200,.6)",
              fontWeight: "bold",
              textAlign: "right",
              fontSize: responsiveFontSize(2.3),
              marginTop: "10%",
            }}
          >
            OKAY
          </Text>
        ) : (
          <Text
            style={{
              textAlign: "right",
              fontSize: responsiveFontSize(2.3),
              marginTop: "10%",
            }}
          >
            {" "}
          </Text>
        )}
        <Text style={{ color: "grey", marginTop: "14%" }}>
          {moment(dateTime, ["HH:mm"]).format("hh:mm a")}
        </Text>
      </SafeAreaView>
    </SafeAreaView>
  );

  const renderItem = ({ item }) => (
    <Item
      alertType={item.alertType}
      dateTime={item.dateTime.substring(
        item.dateTime.indexOf(" ") + 1,
        item.dateTime.indexOf(":") + 3
      )}
      body={item.body}
      title={item.title}
      ok={item.ok}
    />
  );

  const Empty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No alerts</Text>
        <Text style={styles.emptyText}>...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        alignSelf: "flex-end",
        height: "100%",
        width: "97%",
        //backgroundColor: "green",
      }}
    >
      <SafeAreaView
        style={{
          width: "100%",
          alignSelf: "center",
          height: "7%",
          //backgroundColor: "yellow",
          justifyContent: "flex-end",
          marginBottom: "6%",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: "600" }}>
          Today
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
        //backgroundColor="blue"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  images: {
    height: 50,
    width: 50,
  },
  emptyText: {
    color: "black",
    fontSize: responsiveFontSize(3.5),
    alignSelf: "center",
  },
  emptyContainer: {
    paddingTop: "5%",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },
});
