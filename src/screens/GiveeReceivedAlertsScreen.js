import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-native-modal";
import moment from "moment";
import { setSelectedUser, setTokenData } from "../redux/actions";
import { getAlertsEndpoint, setAlertOkEndpoint } from "../network/CarebitAPI";

export default function GiveeReceivedAlertsScreen({ navigation }) {
  const windowHeight = useWindowDimensions().height;
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const [data, setData] = useState([]);
  const [backgroundData, setBackgroundData] = useState([]);

  // Note that 6 is a full page of alerts. Starting with 6 as the default shown will immediately load more at start
  const increment = 6; // Number to load each time the bottom of the list is reached
  const defaultShown = 8; // This is the default number of alerts to show

  const [maxShown, setMaxShown] = useState(0);

  const sendOk = async (alertID) => {
    const params = { targetID: alertID, auth: tokenData.access_token };
    const json = await setAlertOkEndpoint(params);

    if (!json) {
      console.log("Ok has been set");
    } else console.log("Error setting Ok");
  };

  const getFirst = (arr, n) => {
    if (n === 0) return [];
    if (arr.length === 0) return [];
    let retArr = [];
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      retArr.push(arr[i]);
    }
    return retArr;
  };

  // Receive json of all notifications
  const getAlerts = async () => {
    if (!selectedUser.email) return;
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
      selfID: selectedUser.caregiverID,
    };
    const json = await getAlertsEndpoint(params);
    if (json.alerts) {
      setMaxShown(defaultShown);
      setBackgroundData(json.alerts.reverse());
      setData(getFirst(json.alerts, defaultShown));
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  useEffect(() => {
    setData(getFirst(backgroundData, maxShown));
  }, [maxShown, backgroundData]);

  const { fontScale } = useWindowDimensions();
  const [isModal1Visible, setModal1Visible] = useState(false);
  const toggleModal1 = () => {
    console.log(isModal1Visible);
    setModal1Visible(!isModal1Visible);
  };
  // Sends alertID to modal
  const [okID, setOkID] = useState(null);

  const Item = ({ alertType, time, date, body, title, alertID, ok }) => (
    <SafeAreaView
      style={{
        justifyContent: "center",
      }}
    >
      <SafeAreaView
        style={{
          marginVertical: "1%",
          flexDirection: "row",
          alignItems: "center",
          borderTopColor: "lightgrey",
          borderTopWidth: moderateScale(1),
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
            width: "55%",
            marginRight: "2%",
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
            marginRight: "2%",
            justifyContent: "space-evenly",
            flex: 1,
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
                setOkID(alertID);
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
                  fontSize: moderateScale(17.8) / fontScale,
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
                fontSize: moderateScale(17.8) / fontScale,
              }}
            >
              {""} Okay {""}
            </Text>
          )}
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
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
    </SafeAreaView>
  );

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
      alertID={item.alertID}
      ok={item.ok}
    />
  );

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

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAlerts();
    setMaxShown(defaultShown);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView
      style={{
        alignSelf: "flex-end",
        height: "100%",
        width: "97%",
      }}
    >
      <Modal
        isVisible={isModal1Visible}
        backdropOpacity={0.2}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: moderateScale(windowHeight / 4, 0.7),
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
                fontSize: moderateScale(17, 0.6) / fontScale,
              }}
            >
              Mark You're Okay
            </Text>
            <Text
              style={{
                fontSize: moderateScale(13.75, 0.6) / fontScale,
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
                  toggleModal1();
                  console.log("Okay button");
                  console.log(okID);
                  sendOk(okID);

                  wait(500).then(() => getAlerts());
                  //Set that they're okay and send it to the Giver's screen
                }}
              >
                <Text
                  style={{
                    color: "rgba(0,225,200,.8)",
                    fontSize: moderateScale(15.2, 0.6) / fontScale,
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
                  console.log("Inside modal ");
                  console.log(okID);
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(15.2, 0.6) / fontScale,
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
        ListEmptyComponent={Empty}
        keyExtractor={(item) => item.alertID}
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
