import {
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  TextInput,
  StatusBar,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSelectedUser, setTokenData } from "../redux/actions";
import GlobalStyle from "../utils/GlobalStyle";
import { thresholdsEndpoint } from "../network/CarebitAPI";
export default function CustomNotificationScreen({ navigation }) {
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const [isCustom, setIsCustom] = useState(selectedUser.healthProfile === 4);
  const [isHrAlerts, setIsHrAlerts] = useState(true);
  const [isActivityAlerts, setIsActivityAlerts] = useState(true);
  const [isWandering, setIsWandering] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [isBattery, setIsBattery] = useState(true);
  const [thresholds, setThresholds] = useState(null);

  const toggleCustom = () => {
    dispatch(setSelectedUser({ ...selectedUser, healthProfile: 4 }));
    setIsCustom(!isCustom);
  };
  const toggleHrAlerts = () => {
    setIsHrAlerts(!isHrAlerts);
  };
  const toggleActivityAlerts = () => {
    setIsActivityAlerts(!isActivityAlerts);
  };
  const toggleWandering = () => {
    setIsWandering(!isWandering);
  };
  const toggleSync = () => {
    setIsSync(!isSync);
  };
  const toggleBattery = () => {
    setIsBattery(!isBattery);
  };

  const range = (start, end, mult = 1) => {
    var arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i * mult);
    }
    return arr.map((num) => {
      return num.toString();
    });
  };

  useEffect(() => {
    thresholdsAPI("GET");
  }, []);

  const thresholdsAPI = async (type, newJson) => {
    if (type === "PUT" && !thresholds) type = "GET";
    if (!newJson) newJson = thresholds;
    if (!selectedUser.email) return; // Check if selected user is valid

    const params = {
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
      auth: tokenData.access_token,
      type: type,
      body: type === "PUT" ? newJson : undefined,
    };
    const json = await thresholdsEndpoint(params);
    if (json && json.thresholds) {
      setThresholds(json.thresholds);
      dispatch(setSelectedUser({ ...selectedUser, healthProfile: 4 }));
    }
  };

  const lowHeartLimits = range(25, 90);
  const highHeartLimits = range(90, 150);
  const noActivityLimit = range(1, 24);
  const maxSteps = range(1, 40, 250);

  let doesSelectedUserExist = selectedUser.email !== "";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      {!doesSelectedUserExist && (
        <SafeAreaView style={{ height: "120%", width: "100%" }}>
          <ImageBackground
            source={require("../../assets/images/background-hearts.imageset/background02.png")}
            resizeMode={"cover"}
            style={GlobalStyle.Background}
          >
            <SafeAreaView
              style={[
                GlobalStyle.Container,
                { marginLeft: "10%", marginRight: "10%", marginTop: "20%" },
              ]}
            >
              <Text style={{ fontSize: responsiveFontSize(6), color: "white" }}>
                Custom Alerts
              </Text>

              <SafeAreaView
                style={{
                  flex: 1,
                  //backgroundColor: "blue",
                  alignItems: "center",
                  marginTop: "40%",
                }}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(3), color: "white" }}
                >
                  Please Choose a Caregivee First
                </Text>

                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "20%" }]}
                  onPress={() => {
                    navigation.navigate("ListOfFriendsScreen");
                  }}
                >
                  <Text style={GlobalStyle.ButtonText}>Select Caregivee</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </ImageBackground>
        </SafeAreaView>
      )}
      {doesSelectedUserExist && (
        <ScrollView>
          <SafeAreaView style={[styles.Box, { marginTop: "3%" }]}>
            <Text style={[styles.Title, { margin: "4%" }]}>
              Use Custom Alerts
            </Text>
            <Switch
              trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
              thumbColor={isCustom ? "white" : "white"}
              style={styles.switchBody}
              onValueChange={toggleCustom}
              value={isCustom}
            />
          </SafeAreaView>
          <SafeAreaView>
            <Text style={styles.Descriptive}>
              {isCustom
                ? "Turn off to use Activity Levels instead of Custom Thresholds for notifications"
                : "Turn on to use Custom Thresholds instead of Activity Levels for notifications"}
            </Text>
          </SafeAreaView>
          {isCustom ? (
            <SafeAreaView style={[styles.Box, { marginTop: "5%" }]}>
              <Text style={styles.Title}>Heart Rate Alerts</Text>
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isCustom ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleHrAlerts}
                value={isHrAlerts}
              />
            </SafeAreaView>
          ) : null}
          {isHrAlerts && isCustom ? (
            <SafeAreaView style={styles.Box}>
              <Text style={styles.Title}>Low Heart Rate</Text>

              <SelectDropdown
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"rgba(128,128,128,.7)"}
                      size={15}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                defaultValue={thresholds ? thresholds.lowHRThreshold : "N/A"}
                disableAutoScroll={true}
                //search={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: responsiveFontSize(2.2),
                }}
                data={lowHeartLimits}
                onSelect={(selectedItem) => {
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    lowHRThreshold: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem + " bpm";
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          ) : null}
          {isHrAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <Text style={styles.Title}>High Heart Rate</Text>
              <SelectDropdown
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"rgba(128,128,128,.7)"}
                      size={15}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                defaultValue={thresholds ? thresholds.highHRThreshold : "N/A"}
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: responsiveFontSize(2.2),
                }}
                data={highHeartLimits}
                onSelect={(selectedItem) => {
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    highHRThreshold: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem + " bpm";
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {isCustom && (
            <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
              <Text style={styles.Title}>No Activity Alerts</Text>
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isCustom ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleActivityAlerts}
                value={isActivityAlerts}
              />
            </SafeAreaView>
          )}
          {isActivityAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <Text style={styles.Title}>Time Without Heart Rate</Text>
              <SelectDropdown
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"rgba(128,128,128,.7)"}
                      size={15}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                defaultValue={
                  thresholds ? thresholds.timeWithoutHRThreshold : "N/A"
                }
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: responsiveFontSize(2.2),
                }}
                data={noActivityLimit}
                onSelect={(selectedItem) => {
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    timeWithoutHRThreshold: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem > 1
                    ? selectedItem + " hours"
                    : selectedItem + " hour";
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {isActivityAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <Text style={styles.Title}>Time Without Steps</Text>
              <SelectDropdown
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"rgba(128,128,128,.7)"}
                      size={15}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                defaultValue={
                  thresholds ? thresholds.timeWithoutStepsThreshold : "N/A"
                }
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: responsiveFontSize(2.2),
                }}
                data={noActivityLimit}
                onSelect={(selectedItem) => {
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    timeWithoutStepsThreshold: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem > 1
                    ? selectedItem + " hours"
                    : selectedItem + " hour";
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}

          {isCustom && (
            <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
              <Text style={styles.Title}>Wandering Alerts</Text>
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isWandering ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleWandering}
                value={isWandering}
              />
            </SafeAreaView>
          )}
          {isWandering && isCustom && (
            <SafeAreaView style={styles.Box}>
              <Text style={styles.Title}>Max Steps in an Hour</Text>
              <SelectDropdown
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"rgba(128,128,128,.7)"}
                      size={15}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                defaultValue={thresholds ? thresholds.stepThreshold : "N/A"}
                disableAutoScroll={true}
                //search={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle2}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: responsiveFontSize(2.2),
                }}
                data={maxSteps}
                onSelect={(selectedItem) => {
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    stepThreshold: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem + " steps";
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {isCustom && (
            <SafeAreaView>
              <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
                <Text style={styles.Title}>No Sync Alerts</Text>
                <Switch
                  trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                  thumbColor={isSync ? "white" : "white"}
                  style={styles.switchBody}
                  onValueChange={toggleSync}
                  value={isSync}
                />
              </SafeAreaView>
              <SafeAreaView>
                <Text style={styles.Descriptive}>
                  We'll send you an alert after {selectedUser.firstName}'s
                  Fitbit hasn't synced for an hour
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          )}

          {isCustom && (
            <SafeAreaView>
              <SafeAreaView style={[styles.Box, { marginTop: "5%" }]}>
                <Text style={styles.Title}>Empty Battery Alerts</Text>
                <Switch
                  trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                  thumbColor={isBattery ? "white" : "white"}
                  style={styles.switchBody}
                  onValueChange={toggleBattery}
                  value={isBattery}
                />
              </SafeAreaView>
              <SafeAreaView>
                <Text style={styles.Descriptive}>
                  We'll send you an alert when {selectedUser.firstName}'s Fitbit
                  has no charge
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  switchBody: {
    marginRight: "3%",
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  Box: {
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
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    margin: "4%",
  },
  Descriptive: {
    fontSize: responsiveFontSize(1.9),
    margin: "3%",
    color: "gray",
    fontWeight: "500",
  },
  Inputs: {
    marginRight: "3%",
    color: "black",
    fontSize: responsiveFontSize(2.2),
  },
  downButtonStyle: {
    height: "100%",
    width: "30.7%",
    backgroundColor: "white",
  },
  downButtonStyle2: {
    height: "100%",
    width: "38%",
    backgroundColor: "white",
  },
});
