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
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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

  // Delete button warning
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
            setSelectedId(null);
          },
        },
      ]
    );
  };

  // Add button warning/confirmation
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
            await getDefault();
            setSelectedId(null);
            Alert.alert(
              "Accepted!",
              fullName +
                " is now added! You will be able to find them in the " +
                (typeOfRequester === "caregivee"
                  ? "'My Caregivee'"
                  : "'My Caregiver'") +
                " tab",
              [
                {
                  text: "Continue",
                  onPress: () => console.log("Continue"),
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Deletes request from your list and doesn't grant access to data
  const rejectRequest = async (rejectID) => {
    const params = { auth: tokenData.access_token, targetID: rejectID };
    const json = await deleteRequestEndpoint(params);
    if (json === "") return;
    if (json.error) console.log("Error on delete: ", json.error);
  };

  // Finds your default user
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
    const params = {
      auth: tokenData.access_token,
      body: body,
    };
    const json = await getDefaultEndpoint(params);

    if (json.error) {
      if (json.error.startsWith("request not")) {
        dispatch(resetSelectedData());
      } else {
        console.log("Error getting default: ", json.error);
      }
      return;
    }

    if (json.default) {
      dispatch(setSelectedUser(json.default));
    }
  };

  // Changes pending request to accepted and places them in My Caregivee/ers list
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

    if (json === "") return;
    if (json.error) {
      console.log("Error on accept: ", json.error);
      return;
    }
    if (tokenData.type === "caregiver" && json.newCaregivee)
      dispatch(setSelectedUser(json.newCaregivee));
    if (tokenData.type === "caregivee" && json.newCaregiver)
      dispatch(setSelectedUser(json.newCaregiver));
  };

  // Returns json of all your requests
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

  // Loads all pending request when screen is loaded
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

  // Sets data to feed item prop for flatlist
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
        fontScale={fontScale}
      />
    );
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  // Refresh prop to find requests on manual refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRequests();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const isFocused = useIsFocused();
  // Auto refreshes every x milliseconds as long as the screen is focused
  useEffect(() => {
    const toggle = setInterval(() => {
      isFocused ? getRequests() : clearInterval(toggle);
    }, 8000);
    return () => clearInterval(toggle);
  });
  // Used to fix accessibility zoom issue
  const { fontScale } = useWindowDimensions();
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
        {/* Title container */}
        <SafeAreaView
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            height: "10%",
            width: "90%",
            marginTop: scale(35),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(33.2) / fontScale,
              color: "white",
            }}
          >
            All Incoming Requests
          </Text>
        </SafeAreaView>
        {/* Flatlist for all content */}
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
              height: "100%",
              width: "40%",
              borderRadius: moderateScale(8),
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
                    fontSize: moderateScale(22) / fontScale,
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
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
                    fontSize: moderateScale(22) / fontScale,
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
// Content rendered in flatlist
const Item = ({
  item,
  phoneNumber,
  countryCode,
  onPress,
  backgroundColor,
  fontScale,
}) => (
  <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
    <Text
      style={[styles.name, { fontSize: moderateScale(17) / fontScale }]}
      numberOfLines={1}
    >
      {item.firstName} {item.lastName}
    </Text>
    <Text style={[styles.phone, { fontSize: moderateScale(13.8) / fontScale }]}>
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

// Content rendered for empty flatlist
const Empty = () => {
  const { fontScale } = useWindowDimensions();
  return (
    <View style={styles.emptyContainer}>
      <Text
        style={[styles.emptyText, { fontSize: moderateScale(27) / fontScale }]}
      >
        Your inbox is empty
      </Text>
      <Text
        style={[styles.emptyText, { fontSize: moderateScale(27) / fontScale }]}
      >
        ...
      </Text>
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
    padding: moderateScale(11.8),
    width: "65%",
    alignSelf: "center",
    borderRadius: moderateScale(8),
    marginTop: scale(17.5),
    borderColor: "lightgray",
    borderWidth: moderateScale(3),
    alignItems: "center",
  },
  name: {
    color: "black",
    fontFamily: "RobotoBold",
    alignSelf: "center",
  },
  title: {
    color: "black",
    fontFamily: "RobotoBold",
  },
  phone: {
    color: "black",
    alignSelf: "center",
  },
  emptyText: {
    color: "white",
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
    borderTopWidth: moderateScale(2),
  },
  buttons: {
    height: "100%",
    width: "100%",
    marginTop: scale(3),
    borderColor: "transparent",
    backgroundColor: "transparent",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(8),
  },
});

export default RequestScreen;
