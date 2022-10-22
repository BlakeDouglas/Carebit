import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  FlatList,
  Image,
  Alert,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";

import {
  resetSelectedData,
  setSelectedUser,
  setTokenData,
} from "../redux/actions";
import phone from "phone";
import {
  deleteRequestEndpoint,
  getDefaultEndpoint,
  getRequestsEndpoint,
  setDefaultEndpoint,
} from "../network/CarebitAPI";

const ListOfFriendsScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRequests();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    setData(backgroundData.filter((iter) => iter.status === "accepted"));
  }, [backgroundData]);

  // Auto refreshes every 10 seconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused ? getRequests() : clearInterval(toggle);
      console.log("ListFriends focused? " + isFocused);
    }, 10000);
    return () => clearInterval(toggle);
  });

  // Stores only incoming requests
  const [data, setData] = useState([]);
  // Stores all requests
  const [backgroundData, setBackgroundData] = useState([]);

  const setSelected = () => {
    const selected = data.filter((iter) => iter.requestID === selectedId)[0];
    dispatch(setSelectedUser(selected));
    setDefault(selected);
    navigation.goBack();
  };

  const getDefault = async () => {
    const body =
      tokenData.type === "caregiver"
        ? {
            caregiverID: tokenData.caregiverID,
            caregiveeID: null,
          }
        : {
            caregiverID: null,
            caregiveeID: tokenData.caregiveeID,
          };
    const params = { auth: tokenData.access_token, body: body };
    const json = getDefaultEndpoint(params);

    if (json.default) dispatch(setSelectedUser(json.default));
    else dispatch(resetSelectedData());
  };

  const setDefault = async (selected) => {
    const body =
      tokenData.type === "caregiver"
        ? {
            caregiverID: tokenData.caregiverID,
            caregiveeID: selected.caregiveeID,
            user: tokenData.type,
          }
        : {
            caregiverID: selected.caregiverID,
            caregiveeID: tokenData.caregiveeID,
            user: tokenData.type,
          };
    const params = { auth: tokenData.access_token, body: body };
    const json = await setDefaultEndpoint(params);
  };

  const getRequests = async () => {
    const body =
      tokenData.type === "caregivee"
        ? { caregiveeID: tokenData.caregiveeID, caregiverID: null }
        : { caregiverID: tokenData.caregiverID, caregiveeID: null };

    const params = { auth: tokenData.access_token, body: body };
    const json = await getRequestsEndpoint(params);

    // Check if the newly pulled data is different from the currently stored data
    if (JSON.stringify(backgroundData) !== JSON.stringify(json.connections))
      setBackgroundData(json.connections);
  };

  const deleteConnection = async (rejectID) => {
    const params = { auth: tokenData.access_token, targetID: rejectID };
    const json = await deleteRequestEndpoint(params);
    await getDefault();
  };

  const onPressDelete = (item) => {
    const oppositeUser =
      tokenData.type === "caregiver" ? "caregivee" : "caregiver";
    Alert.alert(
      `Remove ${item.firstName} ${item.lastName} as a ${oppositeUser}?`,
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            deleteConnection(item.requestID);
          },
        },
      ]
    );
  };

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

  const Item = ({
    item,
    phoneNumber,
    countryCode,
    onPress,
    backgroundColor,
  }) => (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={[styles.item, backgroundColor]}
        onPress={onPress}
      >
        <Text style={styles.name} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.phone}>
          {countryCode === "+1"
            ? `${countryCode} (${phoneNumber.substring(
                0,
                3
              )}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
            : `${countryCode} ${phoneNumber}`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const Empty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No added {tokenData.type === "caregivee" ? "caregiver" : "caregivee"}s
        </Text>
        <Text style={styles.emptyText}>...</Text>
      </View>
    );
  };

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
            {tokenData.type === "caregivee"
              ? "Added Caregivers"
              : "Added Caregivees"}
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
          {selectedId !== null && (
            <View
              style={{
                //backgroundColor: "green",
                height: "100%",
                width: "40%",
                borderRadius: 8,
                marginTop: "5%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",

                  height: "100%",
                  width: "100%",
                  //backgroundColor: "blue",
                  borderRadius: 8,
                }}
                onPress={() => {
                  setSelected();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(3),
                  }}
                >
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {selectedId !== null && (
            <View
              style={{
                // backgroundColor: "purple",
                height: "100%",
                width: "40%",
                borderRadius: 8,
                marginTop: "5%",
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                  //backgroundColor: "blue",
                  borderRadius: 8,
                }}
                onPress={() => {
                  onPressDelete(
                    data.filter((iter) => iter.requestID === selectedId)[0]
                  );
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(3),
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
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
    backgroundColor: "blue",
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
    // backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopColor: "lightgray",
    borderTopWidth: 1,
  },
  buttons: {
    height: "100%",
    width: "100%",
    marginTop: "2%",
    borderColor: "dodgerblue",
    backgroundColor: "lightgray",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 8,
  },
});

export default ListOfFriendsScreen;
