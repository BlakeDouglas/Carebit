import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
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
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

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

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#bfb6a5" : "#f3f2f1";
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
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
            All Incoming Requests
          </Text>
        </SafeAreaView>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={Empty}
          extraData={selectedId}
        />
        {selectedId !== null && (
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
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => {
                  onPressDelete(
                    DATA.filter((iter) => iter.id === selectedId)[0]
                  );
                }}
              >
                <Text
                  style={{
                    color: "darkred",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.5),
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={[styles.buttons, {}]}
                onPress={() => {
                  onPressAdd(DATA.filter((iter) => iter.id === selectedId)[0]);
                }}
              >
                <Text
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.5),
                  }}
                >
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const Item = ({ item, onPress, backgroundColor }) => (
  <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
    <Text style={styles.name}>
      {item.firstName} {item.lastName}
    </Text>
    <Text style={styles.phone}>{item.phone}</Text>
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

export default RequestScreen;
