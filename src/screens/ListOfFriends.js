import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  FlatList,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const ListOfFriends = ({ navigation }) => {
  const data_temp = [
    {
      requestID: "123",
      firstName: "First",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "204",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "22",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "23",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "24",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "25",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
    {
      requestID: "26",
      firstName: "Broseph",
      lastName: "Galopenmere",
      phone: "954696942",
      email: "Galopener@gmail.com",
    },
  ];
  const [selectedId, setSelectedId] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregivee" : "caregiver";
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
            rejectRequest(tokenData, item.requestID);
            getRequests(tokenData);
          },
        },
      ]
    );
  };

  const onPressAdd = (item) => {
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
          onPress: () => {
            acceptRequest(tokenData, item.caregiverID);
            getRequests(tokenData);
          },
        },
      ]
    );
  };

  const rejectRequest = async (tokenData, rejectID) => {
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
      console.log("Result from delete: " + JSON.stringify(json));
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  const acceptRequest = async (tokenData, acceptID) => {
    const body =
      tokenData.type === "caregivee"
        ? { caregiveeID: tokenData.caregiveeID, caregiverID: acceptID }
        : { caregiverID: tokenData.caregiverID, caregiveeID: acceptID };
    try {
      const response = await fetch("https://www.carebit.xyz/acceptRequest", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (json.request) {
        // TODO: Good case
      } else {
        // TODO: Bad error case
      }
    } catch (error) {
      console.log("Caught error: " + error);
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
      console.log("Caught error: " + error);
    }
  };

  getRequests(tokenData);

  useEffect(() => {
    setData(backgroundData.filter((iter) => iter.status === "Pending"));
  }, [backgroundData]);

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.requestID === selectedId ? "#bfb6a5" : "#f3f2f1";
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.requestID)}
        backgroundColor={{ backgroundColor }}
      />
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
            {typeOfRequester === "caregivee"
              ? "Caregiver's List"
              : "Caregivee's List"}
          </Text>
        </SafeAreaView>
        <FlatList
          data={data_temp}
          renderItem={renderItem}
          keyExtractor={(item) => item.requestID}
          ListEmptyComponent={Empty}
          extraData={selectedId}
        />
        <View style={styles.optionsPane}></View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const Item = ({ item, onPress, backgroundColor }) => (
  <SafeAreaView
    style={{
      //margin: "3%",
      flexDirection: "row",
      width: "65%",
      alignSelf: "center",
      borderRadius: 8,
      marginTop: "5%",
      backgroundColor: "white",
      borderColor: "lightgray",
      borderWidth: 3,
    }}
  >
    <TouchableOpacity
      style={{ padding: "3%", width: "80%", backgroundColor: "black" }}
      onPress={onPress}
    >
      <SafeAreaView
        style={{
          flexDirection: "row",
          backgroundColor: "green",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </TouchableOpacity>
    <SafeAreaView
      style={{
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "gray",
        alignItems: "center",
        flex: 1,
        marginLeft: "3%",
      }}
    >
      <TouchableOpacity
        style={{ backgroundColor: "blue" }}
        onPress={console.log("what is happening")}
      >
        <Image source={require("../../assets/images/settings/settings.png")} />
      </TouchableOpacity>
    </SafeAreaView>
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

export default ListOfFriends;
