import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  FlatList,
  Alert,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { resetSelectedData, setSelectedUser } from "../redux/actions";
import { useIsFocused } from "@react-navigation/native";
import phone from "phone";
import {
  acceptRequestEndpoint,
  deleteRequestEndpoint,
  getDefaultEndpoint,
  getRequestsEndpoint,
} from "../network/CarebitAPI";
const RequestScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();

  // Stores only incoming requests
  const [data, setData] = useState([]);
  // Stores all requests
  const [backgroundData, setBackgroundData] = useState([]);

  const onPressDelete = (item) => {
    Alert.alert(
      "Delete the request from\n" + item.firstName + " " + item.lastName,
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            rejectRequest(item.requestID);
            getRequests();
          },
        },
      ]
    );
  };

  const onPressAdd = (item) => {
    const typeOfRequester =
      tokenData.type === "caregivee" ? "caregiver" : "caregivee";
    const fullName = item.firstName + " " + item.lastName;
    Alert.alert(
      "Allow " + fullName + " to be your " + typeOfRequester + "?",
      typeOfRequester === "caregivee"
        ? "As a caregiver, you intend to provide care to " +
            fullName +
            " by accessing their Fitbit data."
        : "As a caregivee, you will allow " +
            fullName +
            " to access your Fitbit data.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Allow",
          onPress: async () => {
            await acceptRequest(item);
            await getRequests();

            if (!selectedUser.email) {
              await getDefault();
            }
          },
        },
      ]
    );
  };

  const rejectRequest = async (rejectID) => {
    const params = { auth: tokenData.access_token, targetID: rejectID };
    const json = await deleteRequestEndpoint(params);

    if (json.error) console.log("Error on delete: ", json.error);
  };

  const getDefault = async () => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiverID: tokenData.caregiverID,
        caregiveeID: null,
      },
    };
    const json = await getDefaultEndpoint(params);

    // Accounts for array return value and missing default scenarios
    if (json.default) {
      if (json.default[0]) dispatch(setSelectedUser(json.default[0]));
      dispatch(setSelectedUser(json.default));
    } else {
      dispatch(resetSelectedData());
    }
  };

  const acceptRequest = async (item) => {
    const params = {
      auth: tokenData.access_token,
      body:
        tokenData.type === "caregivee"
          ? {
              caregiveeID: tokenData.caregiveeID,
              caregiverID: item.caregiverID,
            }
          : {
              caregiverID: tokenData.caregiverID,
              caregiveeID: item.caregiveeID,
            },
    };

    const json = await acceptRequestEndpoint(params);
  };

  const getRequests = async () => {
    if (!tokenData.type) return;
    const params = {
      auth: tokenData.access_token,
      body:
        tokenData.type === "caregivee"
          ? { caregiveeID: tokenData.caregiveeID, caregiverID: null }
          : { caregiverID: tokenData.caregiverID, caregiveeID: null },
    };

    const json = await getRequestsEndpoint(params);

    // Only set the background data if there's new new data
    if (JSON.stringify(backgroundData) !== JSON.stringify(json.connections))
      setBackgroundData(json.connections);
  };

  useEffect(() => {
    setData(
      backgroundData.filter(
        (iter) => iter.status === "pending" && iter.sender !== tokenData.type
      )
    );
  }, [backgroundData]);

  useEffect(() => {
    getRequests();
  }, []);

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.requestID === selectedId ? "#bfb6a5" : "#f3f2f1";
    let countryCode = phone(item.phone).countryCode;
    let phoneNumber;
    if (!countryCode) {
      countryCode = "+1";
      phoneNumber = item.phone;
    } else {
      phoneNumber = item.phone.substring(countryCode.length);
    }
    return (
      <Item
        item={item}
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onPress={() => setSelectedId(item.requestID)}
        backgroundColor={{ backgroundColor }}
      />
    );
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRequests();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const isFocused = useIsFocused();
  // Auto refreshes every 10 seconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused ? getRequests() : clearInterval(toggle);
      console.log("Request screen focused? " + isFocused);
    }, 10000);
    return () => clearInterval(toggle);
  });

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={styles.mainBody}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="dodgerblue"
        />
        <SafeAreaView
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            height: "10%",
            width: "90%",
            marginTop: "10%",
          }}
        >
          <Text style={{ fontSize: responsiveFontSize(4.3), color: "white" }}>
            All Incoming Requests
          </Text>
        </SafeAreaView>
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.requestID}
          ListEmptyComponent={Empty}
          extraData={selectedId}
        />

        <View style={styles.optionsPane}>
          <View
            style={{
              //backgroundColor: "green",
              height: "100%",
              width: "40%",
              borderRadius: 8,
              marginTop: "5%",
            }}
          >
            {selectedId !== null && (
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                  onPressDelete(
                    data.filter((iter) => iter.requestID === selectedId)[0]
                  );
                }}
              >
                <Text
                  style={{
                    color: "darkred",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.8),
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              //backgroundColor: "purple",
              height: "100%",
              width: "40%",
              borderRadius: 8,
              marginTop: "5%",
            }}
          >
            {selectedId !== null && (
              <TouchableOpacity
                style={[styles.buttons, {}]}
                onPress={() => {
                  onPressAdd(
                    data.filter((iter) => iter.requestID === selectedId)[0]
                  );
                }}
              >
                <Text
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.8),
                  }}
                >
                  Accept
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const Item = ({ item, phoneNumber, countryCode, onPress, backgroundColor }) => (
  <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
    <Text style={styles.name} numberOfLines={1}>
      {item.firstName} {item.lastName}
    </Text>
    <Text style={styles.phone}>
      {countryCode === "+1"
        ? countryCode +
          " (" +
          phoneNumber.substring(0, 3) +
          ") " +
          phoneNumber.substring(3, 6) +
          "-" +
          phoneNumber.substring(6)
        : countryCode + " " + phoneNumber}
    </Text>
  </TouchableOpacity>
);

const Empty = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your inbox is empty</Text>
      <Text style={styles.emptyText}>...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
  },
  item: {
    padding: "3%",
    width: "65%",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: "5%",
    borderColor: "lightgray",
    borderWidth: 3,
    alignItems: "center",
  },
  name: {
    color: "black",
    fontSize: responsiveFontSize(2.2),
    fontFamily: "RobotoBold",
    alignSelf: "center",
  },
  title: {
    color: "black",
    fontSize: responsiveFontSize(4),
    fontFamily: "RobotoBold",
  },
  phone: {
    color: "black",
    fontSize: responsiveFontSize(1.8),
    alignSelf: "center",
  },
  emptyText: {
    color: "white",
    fontSize: responsiveFontSize(3.5),
    alignSelf: "center",
  },
  emptyContainer: {
    paddingTop: "5%",
  },
  optionsPane: {
    height: "8%",
    marginBottom: "2%",
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    borderTopColor: "lightgray",
    borderTopWidth: 2,
  },
  buttons: {
    height: "100%",
    width: "100%",
    marginTop: "2%",
    borderColor: "transparent",
    backgroundColor: "transparent",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 8,
  },
});

export default RequestScreen;
