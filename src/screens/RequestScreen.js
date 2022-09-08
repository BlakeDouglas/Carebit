import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const data_temp = [
  {
    id: "123",
    firstName: "First",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "204",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "22",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "23",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "24",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "25",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
  {
    id: "26",
    firstName: "Broseph",
    lastName: "Galopenmere",
    phone: "954696942",
    email: "Galopener@gmail.com",
  },
];

const RequestScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const tokenData = useSelector((state) => state.Reducers.tokenData);

  const [DATA, setDATA] = useState(data_temp);

  const onPressDelete = (item) => {
    Alert.alert(
      "Delete the request from\n" + item.firstName + " " + item.lastName,
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            const filteredData = DATA.filter((iter) => iter.id !== item.id);
            setDATA(filteredData);
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
          onPress: () => {
            // TODO: Implement adding using connectCaregivee (or whatever austin makes)
          },
        },
      ]
    );
  };

  // Might not be necessary, depending on the changes austin makes
  const connectCaregivee = async (tokenData) => {
    try {
      let response = await fetch(
        "https://www.carebit.xyz/acceptCaregiverRequest",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          // TODO: The body needs an overhaul with conditions. Also, fix DATA so it has caregiveeId
          body: JSON.stringify({
            caregiver: tokenData.caregiverId,
            caregivee: DATA.caregiveeId,
          }),
        }
      );
      fetchUserData(tokenData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor: "dodgerblue" }}
        onPressDelete={onPressDelete}
        onPressAdd={onPressAdd}
      />
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background01.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={styles.mainBody}>
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
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          ListEmptyComponent={Empty}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const Item = ({ item, onPressDelete, onPressAdd }) => (
  <View style={styles.item}>
    <View style={{ marginBottom: "3%" }}>
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onPressAdd(item);
        }}
        style={{
          marginRight: "10%",
          alignItems: "center",
          borderRadius: 8,
          borderColor: "gray",
          backgroundColor: "dodgerblue",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.5) }}>Accept</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          onPressDelete(item);
        }}
        style={{
          alignItems: "center",
          marginLeft: "10%",
          borderRadius: 8,
          backgroundColor: "red",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.5) }}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
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
    width: "75%",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: "5%",
    borderColor: "lightgray",
    borderWidth: 2,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
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
});

export default RequestScreen;
