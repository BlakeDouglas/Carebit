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

const ListOfFriendsScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRequests(tokenData);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregivee" : "caregiver";
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
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getDefaultRequest",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: JSON.stringify(body),
        }
      );
      const responseText = await response.text();
      const json = JSON.parse(responseText);

      // Accounts for array return value
      if (json.default) {
        if (json.default[0]) dispatch(setSelectedUser(json.default[0]));
        else dispatch(setSelectedUser(json.default));
      } else dispatch(resetSelectedData());
    } catch (error) {
      console.log(
        "Caught error in /getDefaultRequest on ListOfFriendsScreen: " + error
      );
    }
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
    console.log("Passing body to /setDefaultRequest: ", body);
    try {
      const response = await fetch(
        "https://www.carebit.xyz/setDefaultRequest",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: JSON.stringify(body),
        }
      );
      const responseText = await response.text();
      const json = JSON.parse(responseText);
      console.log("Response from /setDefaultRequest: ", json.request);
    } catch (error) {
      console.log("Caught error in /setDefaultRequest: " + error);
    }
  };

  const getRequests = async (tokenData) => {
    const body =
      tokenData.type === "caregivee"
        ? { caregiveeID: tokenData.caregiveeID, caregiverID: null }
        : { caregiverID: tokenData.caregiverID, caregiveeID: null };
    try {
      const response = await fetch("https://www.carebit.xyz/getRequests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (JSON.stringify(backgroundData) !== JSON.stringify(json.connections))
        setBackgroundData(json.connections);
    } catch (error) {
      console.log("Caught error in /getRequests: " + error);
    }
  };

  useEffect(() => {
    getRequests(tokenData);
  }, []);

  const oppositeUser =
    tokenData.type === "caregiver" ? "caregivee" : "caregiver";

  const onPressDelete = (item) => {
    Alert.alert(
      "Remove " +
        item.firstName +
        " " +
        item.lastName +
        " as a " +
        oppositeUser +
        "?",
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            deleteConnection(tokenData, item.requestID);
          },
        },
      ]
    );
  };
  const deleteConnection = async (tokenData, rejectID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/deleteRequest/" + rejectID,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      await getDefault();
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.log("Caught error in /deleteRequest: " + error);
    }
  };

  useEffect(() => {
    setData(backgroundData.filter((iter) => iter.status === "accepted"));
  }, [backgroundData]);

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.requestID === selectedId ? "#bfb6a5" : "#f3f2f1";
    const countryCode = phone(item.phone).countryCode;
    const phoneNumber = item.phone.substring(countryCode.length);
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

  const isFocused = useIsFocused();
  // Auto refreshes every 10 seconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused ? getRequests(tokenData) : clearInterval(toggle);
      console.log("ListFriends focused? " + isFocused);
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
            {typeOfRequester === "caregivee"
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

const Item = ({ item, phoneNumber, countryCode, onPress, backgroundColor }) => (
  <SafeAreaView style={{ flex: 1 }}>
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
  </SafeAreaView>
);

const Empty = () => {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const typeOfRequester2 =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No added {typeOfRequester2}s</Text>
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
