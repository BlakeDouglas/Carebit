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

export default function SettingsOverviewScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
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
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.log("Caught error in /deleteRequest: " + error);
    }
  };

  const oppositeUser =
    tokenData.type === "caregiver" ? "caregivee" : "caregiver";
  const onPressDelete = (item) => {
    console.log(item);
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
          {"SELECTED "}
          {tokenData.type === "caregivee" ? "CAREGIVER" : "CAREGIVEE"}
        </Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Name</Text>
        <Text style={styles.BoxSub}>
          {selectedUser.firstName || "N/A"} {selectedUser.lastName || "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Email</Text>
        <Text style={styles.BoxSub}>{selectedUser.email || "N/A"}</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>
          {"(" +
            selectedUser.phone.substring(0, 3) +
            ") " +
            selectedUser.phone.substring(3, 6) +
            "-" +
            selectedUser.phone.substring(6) || "N/A"}
        </Text>
      </SafeAreaView>

      {tokenData.type === "caregiver" && (
        <>
          <SafeAreaView style={styles.TitleContainer}>
            <Text style={styles.Title}>PHYSICIAN INFO</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Name</Text>
            <Text style={styles.BoxSub}>
              {tokenData[oppositeUser + "ID"].length !== 0
                ? tokenData[oppositeUser + "ID"][tokenData.selected].physName
                : "N/A"}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Phone</Text>
            <Text style={styles.BoxSub}>
              {tokenData[oppositeUser + "ID"].length !== 0
                ? tokenData[oppositeUser + "ID"][tokenData.selected].physPhone
                : "N/A"}
            </Text>
          </SafeAreaView>

          <SafeAreaView style={styles.TitleContainer}>
            <Text style={styles.Title}>ALERTS</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Activity Level</Text>
            <TouchableOpacity
              onPress={() => {
                activityButtonHandler();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {/* TODO: For healthProfile != 4 */}
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
              onPress={() => {
                customAlertButtonHandler();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={styles.BoxSub}>
                {tokenData[oppositeUser + "ID"].length !== 0 &&
                tokenData[oppositeUser + "ID"][tokenData.selected]
                  .healthProfile === 4
                  ? "On"
                  : "Off"}
              </Text>
              <Image
                style={{ height: 15, width: 15, marginLeft: "1%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
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
            Delete {tokenData.type === "caregiver" ? "Caregivee" : "Caregiver"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Box: {
    height: "7%",
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
  Title: {
    fontSize: responsiveFontSize(1.9),
    color: "gray",
    fontWeight: "500",
  },
  TitleContainer: {
    marginTop: "5%",
    width: "100%",
    justifyContent: "center",
    height: "5%",
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
