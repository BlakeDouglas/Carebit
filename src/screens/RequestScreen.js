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
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
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

  const [DATA, setDATA] = useState(data_temp);

  const onPressDelete = (item) => {
    Alert.alert(
      "Delete the request from\n" + item.fname + " " + item.lname,
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

  const onPressAdd = (id) => {};

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
    <SafeAreaView style={styles.mainBody}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const Item = ({ item, onPressDelete, onPressAdd }) => (
  <View style={styles.item}>
    <Icon
      onPress={() => {
        onPressDelete(item);
      }}
      style={{ fontSize: 32, color: "red" }}
      name={"minus-circle"}
    />
    <View>
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>

    <Icon
      onPress={() => {
        onPressAdd(item);
      }}
      style={{ fontSize: 32, color: "green" }}
      name={"plus-circle"}
    />
  </View>
);

const Empty = () => {
  return <View style={styles.empty}></View>;
};

const styles = StyleSheet.create({
  mainBody: {
    height: "100%",
    width: "100%",
    backgroundColor: "whitesmoke",
  },
  item: {
    padding: "3%",
    width: "85%",
    alignSelf: "center",
    borderRadius: 20,
    marginTop: "5%",
    borderColor: "gray",
    borderWidth: 4,
    justifyContent: "space-between",
    flexDirection: "row",
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
});

export default RequestScreen;
