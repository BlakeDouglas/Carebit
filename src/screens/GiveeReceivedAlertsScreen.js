import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-native-modal";
import { setTokenData } from "../redux/actions";

const data_temp = [
  {
    alertType: "lowHeartRateAlert",
    dateTime: "12:50pm",
    title: "Low Heart Rate",
    body: "Name has low heart rate",
    caregiveeID: "BH32L",
    alertID: "1",
    ok: 1,
  },
  {
    alertType: "noStepsAlert",
    dateTime: "1:15am",
    title: "No Steps",
    body: "Name has gone more than x hour(s) without steps",
    total: "0",
    alertID: "2",
    ok: 0,
  },
  {
    alertType: "noHeartRateAlert",
    dateTime: "1:18am",
    title: "Heart Rate Not Recorded",
    body: "Name's heart rate hasn't been recorded for over 8 hour(s)",
    total: "0",
    alertID: "3",
    ok: 0,
  },
  {
    alertType: "highHeartRateAlert",
    dateTime: "10:16am",
    title: "High Heart Rate",
    body: "Name's heart rate was 162",
    total: "162",
    alertID: "4",
    ok: 0,
  },
  {
    alertType: "tooManyStepsAlert",
    dateTime: "12:50pm",
    title: "Too Many Steps",
    body: "Name has taken more than 865 steps in the past hour",
    total: "865",
    alertID: "5",
    ok: 0,
  },
  {
    alertType: "noSyncAlert",
    dateTime: "1:15am",
    title: "No Sync",
    body: "Name has gone more than x hour(s) without syncing",
    total: "0",
    alertID: "6",
    ok: 1,
  },
  {
    alertType: "batteryAlert",
    dateTime: "8:16am",
    title: "Battery Warning",
    body: "Their Fitbit is dead",
    total: "8",
    alertID: "7",
    ok: 0,
  },
  {
    alertType: "lowHeartRateAlert",
    dateTime: "10:16am",
    title: "Low Heart Rate",
    body: "Name's heart rate was 62",
    total: "62",
    alertID: "8",
    ok: 0,
  },
];

export default function GiveeReceivedAlertsScreen({ navigation }) {
  const {fontScale} = useWindowDimensions();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const [data, setData] = useState([]);

  const sendOk = async (alertID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/alerts/ok/" + alertID,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      if (json) {
        console.log("Ok has been set");
      }
    } catch (error) {
      console.log(
        "Caught error from /alerts/ok/<int:alertID> in GiveeReceived: " + error
      );
    }
  };

  // Receive json of all notifications
  const getAlerts = async () => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/alerts/" + tokenData.caregiveeID,
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
      if (json) {
        setData(json.alerts);
        console.log(data);
      }
    } catch (error) {
      console.log(
        "Caught error from /alerts/<caregiveeID> in GiveeAlerts: " + error
      );
    }
  };

  const [isModal1Visible, setModal1Visible] = useState(false);
  const toggleModal1 = () => {
    console.log(isModal1Visible);
    setModal1Visible(!isModal1Visible);
  };

  const Item = ({ alertType, dateTime, body, title, alertID, ok }) => (
    <SafeAreaView
      style={{
        justifyContent: "center",
      }}
    >
      <Modal
        isVisible={isModal1Visible}
        backdropOpacity={0.2}
        useNativeDriverForBackdrop={true}
        halertIDeModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: "31%",
            width: "75%",
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2.2) / fontScale,
              }}
            >
              Mark You're Okay
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8) / fontScale,
                fontWeight: "400",
                textAlign: "left",
              }}
            >
              Would you like to mark that you're okay? Note that your Caregiver
              will see this as well
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopwidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  console.log("Okay Pressed");
                  toggleModal1();
                  sendOk(alertID);
                  //Set that they're okay and send it to the Giver's screen
                }}
              >
                <Text
                  style={{
                    color: "rgba(0,225,200,.8)",
                    fontSize: responsiveFontSize(2) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Yes, I'm Okay
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopwidth: moderateScale(1),
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  console.log("Cancel Pressed");
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: responsiveFontSize(2) / fontScale,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>
      <SafeAreaView
        style={{
          marginVertical: "1%",
          flexDirection: "row",
          alignItems: "center",
          borderTopColor: "lightgrey",
          borderTopWidth: moderateScale(1),
          //backgroundColor: "red",
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
            //height: "100%",
            width: "58%",
            //backgroundColor: "blue",
            marginVertical: "5%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: responsiveFontSize(2.4) / fontScale, fontWeight: "600" }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginTop: "1%",
              fontSize: responsiveFontSize(1.8) / fontScale,
              color: "gray",
            }}
            numberOfLines={2}
          >
            {body}
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            marginLeft: "1%",
            marginRight: "3%",
            // backgroundColor: "red",
            justifyContent: "space-evenly",
          }}
        >
          {ok === 0 ? (
            <TouchableOpacity
              style={{
                marginTop: "10%",
                borderColor: "lightblue",
                borderWidth: moderateScale(1),
                borderRadius: moderateScale(5),
              }}
              onPress={() => {
                toggleModal1();
                console.log("Okay Pressed");
              }}
            >
              <Text
                style={{
                  color: "rgba(0,225,200,.6)",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "2%",
                  fontSize: responsiveFontSize(2.3) / fontScale,
                }}
              >
                Check-in
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: "rgba(0,225,200,.6)",
                fontWeight: "bold",
                textAlign: "center",
                margin: "2%",
                fontSize: responsiveFontSize(2.3) / fontScale,
              }}
            >
              {""} Okay {""}
            </Text>
          )}
          <Text style={{ color: "grey", marginTop: "14%" }}>{dateTime}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
  const renderItem = ({ item }) => (
    <Item
      alertType={item.alertType}
      dateTime={item.dateTime}
      body={item.body}
      title={item.title}
      alertID={item.alertID}
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

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAlerts();
    wait(1000).then(() => setRefreshing(false));
  }, []);

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
        <Text style={{ fontSize: responsiveFontSize(2.5) /fontScale, fontWeight: "600" }}>
          Today
        </Text>
      </SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={Empty}
        keyExtractor={(item) => item.alertID}
        //backgroundColor="blue"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  images: {
    height: verticalScale(50),
    width: scale(50),
  },
  emptyText: {
    color: "black",
    fontSize: responsiveFontSize(3.5) / fontScale,
    alignSelf: "center",
  },
  emptyContainer: {
    paddingTop: "5%",
    borderTopColor: "lightgrey",
    borderTopWidth: moderateScale(1),
  },
});
