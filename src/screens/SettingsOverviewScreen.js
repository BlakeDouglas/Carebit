import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useState } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Provider, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function SettingsOverviewScreen({ route, navigation }) {
  const selectedUser = route.params.user;
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const customAlertButtonHandler = () => {
    navigation.navigate("CustomNotification");
  };

  const activityButtonHandler = () => {
    navigation.navigate("ActivityLevel");
  };

  const deleteRequest = async (tokenData, rejectID) => {
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
      console.log("Caught error in /deleteRequest: " + error);
    }
  };

  const onPressDelete = (item) => {
    Alert.alert(
      "Remove " +
        item.firstName +
        " " +
        item.lastName +
        " as a " +
        item.type +
        "?",
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            deleteRequest(tokenData, item.requestID);
          },
        },
      ]
    );
  };

  console.log("------ Selected User -------");
  console.log(selectedUser);
  return (
    // Header Container
    <SafeAreaView style={{ flex: 1, marginTop: "2%" }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />

      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>
          {tokenData.type === "caregivee" ? "CAREGIVER" : "CAREGIVEE"}
        </Text>
      </SafeAreaView>

      <SafeAreaView style={styles.Box2}>
        <SafeAreaView style={[styles.Box]}>
          <Text style={styles.BoxTitle}>Pam</Text>
          <Text style={styles.BoxSub}>PamWisniewski@gmail.com</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.Box}>
          <Text style={styles.BoxTitle}>Phone</Text>
          <Text style={styles.BoxSub}>(407) 777-7777</Text>
        </SafeAreaView>
      </SafeAreaView>

      <SafeAreaView style={[styles.TitleContainer]}>
        {tokenData.type === "caregiver" ? (
          <SafeAreaView>
            <Text style={styles.Title}>PHYSICIAN INFO</Text>
          </SafeAreaView>
        ) : null}
      </SafeAreaView>
      {tokenData.type === "caregiver" ? (
        <SafeAreaView style={styles.Box3}>
          <SafeAreaView style={styles.Box4}>
            <Text style={styles.BoxTitle}>Phone</Text>
            <Text style={styles.BoxSub}>(407) 777-7777</Text>
          </SafeAreaView>
        </SafeAreaView>
      ) : null}

      {tokenData.type === "caregiver" ? (
        <SafeAreaView style={styles.TitleContainer}>
          <Text style={styles.Title}>ALERTS</Text>
        </SafeAreaView>
      ) : null}
      {tokenData.type === "caregiver" ? (
        <SafeAreaView style={styles.Box2}>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Activity Level</Text>
            <TouchableOpacity
              onPress={activityButtonHandler}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={styles.BoxSub}>Active</Text>
              <Image
                style={{ height: 15, width: 15, marginLeft: "1%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Custom Alert Settings</Text>
            <TouchableOpacity
              onPress={customAlertButtonHandler}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={styles.BoxSub}>Off</Text>
              <Image
                style={{ height: 15, width: 15, marginLeft: "1%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      ) : null}
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            onPressDelete(selectedUser);
          }}
        >
          <Text
            style={{
              color: "red",
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
            }}
          >
            Delete {tokenData.type === "caregivee" ? "Caregiver" : "Caregivee"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Box: {
    height: "50%",
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "rgba(128,128,128,.1)",
    borderTopWidth: 1,
    borderBottomColor: "rgba(128,128,128,.1)",
    borderBottomWidth: 1,
  },
  Box2: {
    height: "14%",
    width: "100%",
    backgroundColor: "white",
  },
  Box3: {
    height: "7%",
    width: "100%",
    backgroundColor: "white",
  },
  Box4: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  Title: {
    fontSize: responsiveFontSize(1.9),
    color: "gray",
    fontWeight: "500",
  },
  TitleContainer: {
    width: "100%",
    justifyContent: "center",
    height: "5%",
    marginVertical: "1%",
    marginLeft: "4%",
  },
  BoxTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    marginLeft: "4%",
  },
  BoxSub: {
    fontSize: responsiveFontSize(2.2),
    marginRight: "4%",
    color: "rgba(128,128,128,.8)",
  },
});
