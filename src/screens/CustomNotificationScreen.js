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
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSelectedUser, setTokenData } from "../redux/actions";
import GlobalStyle from "../utils/GlobalStyle";
import {
  thresholdsEndpoint,
  caregiveeGetEndpoint,
  setActivityEndpoint,
} from "../network/CarebitAPI";
export default function CustomNotificationScreen({ navigation }) {
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const [isCustom, setIsCustom] = useState(selectedUser.healthProfile === 4);
  const [isHrAlerts, setIsHrAlerts] = useState(true);
  const [isActivityAlerts, setIsActivityAlerts] = useState(true);
  const [isWandering, setIsWandering] = useState(true);
  const [isSync, setIsSync] = useState(true);
  const [isBattery, setIsBattery] = useState(true);
  const [thresholds, setThresholds] = useState(null);

  // Sends activity level of 1, 2, or 3 to database which handles thresholds
  const setActivity = async (level) => {
    const params = {
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
      level: level,
      auth: tokenData.access_token,
    };
    const responseText = await setActivityEndpoint(params);
    if (!responseText) {
      dispatch(setSelectedUser({ ...selectedUser, healthProfile: level }));
      navigation.goBack();
    } else console.log("Error setting activity level");
  };

  // All the option toggle handlers
  const toggleCustom = async () => {
    if (isCustom) {
      // If it's disabling custom alerts, get their default healthProfile and set it
      let params = {
        auth: tokenData.access_token,
        targetID: selectedUser.caregiveeID,
      };
      let resp = await caregiveeGetEndpoint(params);
      if (resp.healthProfile && resp.healthProfile)
        setActivity(resp.caregivee.healthProfile);
      else console.log("Unknown error. Consult Evan");
    } else {
      // If it's enabling custom alerts, set healthProfile to 4 by calling /thresholds
      thresholdsAPI("PUT", thresholds);
    }
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
  // Provides a range for each opening module
  const range = (start, end, mult = 1, unit) => {
    var arr = [];
    let addUnit = unit;
    for (let i = start; i <= end; i++) {
      let addUnit = unit;
      i <= 1 ? (addUnit === " hours" ? (addUnit = " hour") : addUnit) : addUnit;
      let number = i * mult;
      number === 624 ? (number += 1) : number;
      arr.push(number + addUnit);
    }
    return arr.map((num) => {
      return num;
    });
  };

  useEffect(() => {
    thresholdsAPI("GET");
  }, []);

  // Grabs default values for thresholds or sets it to custom
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
      if (json.thresholds.healthProfile === 4) {
        dispatch(setSelectedUser({ ...selectedUser, healthProfile: 4 }));
      }
    }
  };
  // Holds range values for the opening modules by using range function
  const lowHeartLimits = range(25, 90, 1, " bpm");
  const highHeartLimits = range(90, 150, 1, " bpm");
  const noActivityLimit = range(1, 24, 1, " hours");
  const maxSteps = range(1, 40, 156, " steps");
  // Checks if a selected user exists
  let doesSelectedUserExist = selectedUser.email !== "";
  // Used for fixing accessibility zoom
  const { fontScale } = useWindowDimensions();
  console.log(thresholds);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      {/* If there isn't a selected user, show them this. Should never see this screen */}
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
              <Text
                style={{
                  fontSize: responsiveFontSize(6) / fontScale,
                  color: "white",
                }}
              >
                Custom Alerts
              </Text>

              <SafeAreaView
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginTop: "40%",
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(3) / fontScale,
                    color: "white",
                  }}
                >
                  Please Choose a Caregivee First
                </Text>

                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "20%" }]}
                  onPress={() => {
                    navigation.navigate("ListOfFriendsScreen");
                  }}
                >
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: responsiveFontSize(2.51) / fontScale },
                    ]}
                  >
                    Select Caregivee
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </ImageBackground>
        </SafeAreaView>
      )}
      {/* Main screen container */}
      {doesSelectedUserExist && (
        <ScrollView>
          {/* Custom toggle container */}
          <SafeAreaView style={[styles.Box, { marginTop: "3%" }]}>
            <Text
              style={[
                styles.TitleNoSub,
                { fontSize: moderateScale(17) / fontScale },
              ]}
            >
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
          {/* Description container */}
          <SafeAreaView>
            <Text
              style={[
                styles.Descriptive,
                { fontSize: moderateScale(14.7) / fontScale },
              ]}
            >
              {isCustom
                ? "Turn off to use Activity Levels instead of Custom Thresholds for notifications"
                : "Turn on to use Custom Thresholds instead of Activity Levels for notifications"}
            </Text>
          </SafeAreaView>
          {/* Heart Rate alerts container */}
          {isCustom ? (
            <SafeAreaView style={[styles.Box, { marginTop: "5%" }]}>
              <Text
                style={[
                  styles.TitleNoSub,
                  { fontSize: moderateScale(17) / fontScale },
                ]}
              >
                Heart Rate Alerts
              </Text>

              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isCustom ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleHrAlerts}
                value={isHrAlerts}
              />
            </SafeAreaView>
          ) : null}
          {/* Checks if the custom slider is on and if the hr slider is on */}
          {isHrAlerts && isCustom ? (
            <SafeAreaView style={styles.Box}>
              <SafeAreaView style={{ marginLeft: "4%", marginTop: "3.5%" }}>
                <Text
                  style={[
                    styles.Title,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  Low Heart Rate
                </Text>
                <Text
                  style={[
                    styles.Example,
                    { fontSize: moderateScale(11.7) / fontScale },
                  ]}
                >
                  e.g. 60 bpm
                </Text>
              </SafeAreaView>
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
                  thresholds ? thresholds.lowHRThreshold + " bpm" : "N/A"
                }
                disableAutoScroll={true}
                //search={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: moderateScale(17),
                }}
                data={lowHeartLimits}
                onSelect={(selectedItem) => {
                  // Removes everything that isn't a number
                  let thresholdVal = selectedItem.replace(/\D/g, "");

                  thresholdsAPI("PUT", {
                    ...thresholds,
                    lowHRThreshold: thresholdVal,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          ) : null}
          {/* Checks if custom toggle and hr toggle are on */}
          {isHrAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <SafeAreaView style={{ marginLeft: "4%", marginTop: "3.5%" }}>
                <Text
                  style={[
                    styles.Title,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  High Heart Rate
                </Text>
                <Text
                  style={[
                    styles.Example,
                    { fontSize: moderateScale(11.7) / fontScale },
                  ]}
                >
                  e.g. 100 bpm
                </Text>
              </SafeAreaView>
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
                  thresholds ? thresholds.highHRThreshold + " bpm" : "N/A"
                }
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: moderateScale(17),
                }}
                data={highHeartLimits}
                onSelect={(selectedItem) => {
                  // Removes everything that isn't a number
                  let thresholdVal = selectedItem.replace(/\D/g, "");
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    highHRThreshold: thresholdVal,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {/* Checks if custom toggle is turned on. Otherwise, don't show */}
          {isCustom && (
            <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
              <Text
                style={[
                  styles.TitleNoSub,
                  { fontSize: moderateScale(17) / fontScale },
                ]}
              >
                No Activity Alerts
              </Text>
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isCustom ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleActivityAlerts}
                value={isActivityAlerts}
              />
            </SafeAreaView>
          )}
          {/* Checks if activity alerts and custom toggle are on */}
          {isActivityAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <SafeAreaView style={{ marginLeft: "4%", marginTop: "3.5%" }}>
                <Text
                  style={[
                    styles.Title,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  Time Without Heart Rate
                </Text>
                <Text
                  style={[
                    styles.Example,
                    { fontSize: moderateScale(11.7) / fontScale },
                  ]}
                >
                  e.g. 1 hour
                </Text>
              </SafeAreaView>
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
                  thresholds
                    ? thresholds.timeWithoutHRThreshold > 1
                      ? thresholds.timeWithoutHRThreshold + " hours"
                      : thresholds.timeWithoutHRThreshold + " hour"
                    : "N/A"
                }
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: moderateScale(17),
                }}
                data={noActivityLimit}
                onSelect={(selectedItem) => {
                  // Removes everything that isn't a number
                  let thresholdVal = selectedItem.replace(/\D/g, "");
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    timeWithoutHRThreshold: thresholdVal,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {/* Checks if activity alerts and custom toggle are on */}
          {isActivityAlerts && isCustom && (
            <SafeAreaView style={styles.Box}>
              <SafeAreaView style={{ marginLeft: "4%", marginTop: "3.5%" }}>
                <Text
                  style={[
                    styles.Title,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  Time Without Steps
                </Text>
                <Text
                  style={[
                    styles.Example,
                    { fontSize: moderateScale(11.7) / fontScale },
                  ]}
                >
                  e.g. 2 hours
                </Text>
              </SafeAreaView>
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
                  thresholds
                    ? thresholds.timeWithoutStepsThreshold > 1
                      ? thresholds.timeWithoutStepsThreshold + " hours"
                      : thresholds.timeWithoutStepsThreshold + " hour"
                    : "N/A"
                }
                disableAutoScroll={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: moderateScale(17),
                }}
                data={noActivityLimit}
                onSelect={(selectedItem) => {
                  // Removes everything that isn't a number
                  let thresholdVal = selectedItem.replace(/\D/g, "");
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    timeWithoutStepsThreshold: thresholdVal,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {/* Checks if custom toggle is on. Otherwise doesn't show this container */}
          {isCustom && (
            <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
              <Text
                style={[
                  styles.TitleNoSub,
                  { fontSize: moderateScale(17) / fontScale },
                ]}
              >
                Wandering Alerts
              </Text>
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isWandering ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={toggleWandering}
                value={isWandering}
              />
            </SafeAreaView>
          )}
          {/* Checks if wandering alerts and custom toggle are on */}
          {isWandering && isCustom && (
            <SafeAreaView style={styles.Box}>
              <SafeAreaView style={{ marginLeft: "4%", marginTop: "3.5%" }}>
                <Text
                  style={[
                    styles.Title,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  Max Steps in an Hour
                </Text>
                <Text
                  style={[
                    styles.Example,
                    { fontSize: moderateScale(11.7) / fontScale },
                  ]}
                >
                  e.g. 2000 Steps
                </Text>
              </SafeAreaView>
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
                  thresholds ? thresholds.stepThreshold + " steps" : "N/A"
                }
                disableAutoScroll={true}
                //search={true}
                selectedRowStyle={{ backgroundColor: "lightgray" }}
                buttonStyle={styles.downButtonStyle2}
                buttonTextStyle={{
                  color: "rgba(128,128,128,.9)",
                  fontSize: moderateScale(17),
                }}
                data={maxSteps}
                onSelect={(selectedItem) => {
                  // Removes everything that isn't a number
                  let thresholdVal = selectedItem.replace(/\D/g, "");
                  thresholdsAPI("PUT", {
                    ...thresholds,
                    stepThreshold: thresholdVal,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </SafeAreaView>
          )}
          {/* Checks if custom toggle is on */}
          {isCustom && (
            <SafeAreaView>
              <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
                <Text
                  style={[
                    styles.TitleNoSub,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  No Sync Alerts
                </Text>
                <Switch
                  trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                  thumbColor={isSync ? "white" : "white"}
                  style={styles.switchBody}
                  onValueChange={toggleSync}
                  value={isSync}
                />
              </SafeAreaView>
              <SafeAreaView>
                <Text
                  style={[
                    styles.Descriptive,
                    { fontSize: moderateScale(14.7) / fontScale },
                  ]}
                >
                  We'll send you an alert after {selectedUser.firstName}'s
                  Fitbit hasn't synced for an hour
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          )}
          {/* Checks if custom toggle is on */}
          {isCustom && (
            <SafeAreaView>
              <SafeAreaView style={[styles.Box, { marginTop: "5%" }]}>
                <Text
                  style={[
                    styles.TitleNoSub,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
                  Empty Battery Alerts
                </Text>
                <Switch
                  trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                  thumbColor={isBattery ? "white" : "white"}
                  style={styles.switchBody}
                  onValueChange={toggleBattery}
                  value={isBattery}
                />
              </SafeAreaView>
              <SafeAreaView>
                <Text
                  style={[
                    styles.Descriptive,
                    { fontSize: moderateScale(14.7) / fontScale },
                  ]}
                >
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
    transform: [
      { scaleX: moderateScale(0.92) },
      { scaleY: moderateScale(0.92) },
    ],
    marginRight: moderateScale(11, 0.9),
  },
  Box: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "rgba(128,128,128,.1)",
    borderTopWidth: moderateScale(1),
    borderBottomColor: "rgba(128,128,128,.1)",
    borderBottomWidth: moderateScale(1),
  },
  Title: {
    fontSize: moderateScale(17),
    fontWeight: "600",
  },
  TitleNoSub: {
    fontSize: moderateScale(17),
    fontWeight: "600",
    margin: "4%",
    alignSelf: "center",
  },
  Example: {
    fontSize: moderateScale(11.7),
    color: "lightgrey",
    fontWeight: "500",
    marginLeft: "4%",
    marginBottom: "2%",
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
    fontSize: moderateScale(17),
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
