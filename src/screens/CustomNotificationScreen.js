import {
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  TextInput,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function CustomNotificationScreen({ navigation }) {
  const [isCustom, setIsCustom] = useState(false);
  const [isHrAlerts, setIsHrAlerts] = useState(true);
  const [isActivityAlerts, setIsActivityAlerts] = useState(true);
  const [isWandering, setIsWandering] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [isBattery, setIsBattery] = useState(true);
  const toggleCustom = () => {
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

  const heartLimits = [
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "90",
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
      <KeyboardAwareScrollView style={{ height: "100%", width: "100%" }}>
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
              ? "Turn off to use custom thresholds instead of Activity Levels to trigger alerts"
              : "Turn on to use Activity Levels instead of custom thresholds to trigger alerts"}
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
              defaultButtonText={"0 BPM"}
              disableAutoScroll={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={heartLimits}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem + " BPM";
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </SafeAreaView>
        ) : null}
        {isHrAlerts && isCustom ? (
          <SafeAreaView style={styles.Box}>
            <Text style={styles.Title}>High Heart Rate</Text>
            <TextInput
              style={[styles.Inputs]}
              placeholderTextColor={"rgba(128,128,128,.9)"}
              placeholder="150 BPM"
              keyboardType="number-pad"
            ></TextInput>
          </SafeAreaView>
        ) : null}
        {isCustom ? (
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
        ) : null}
        {isActivityAlerts && isCustom ? (
          <SafeAreaView style={styles.Box}>
            <Text style={styles.Title}>Time Without Heart Rate</Text>
            <TextInput
              style={[styles.Inputs]}
              placeholderTextColor={"rgba(128,128,128,.9)"}
              placeholder="1 hour"
              keyboardType="number-pad"
            ></TextInput>
          </SafeAreaView>
        ) : null}
        {isActivityAlerts && isCustom ? (
          <SafeAreaView style={styles.Box}>
            <Text style={styles.Title}>Time Without Steps</Text>
            <TextInput
              style={[styles.Inputs]}
              placeholderTextColor={"rgba(128,128,128,.9)"}
              placeholder="1 hour"
              keyboardType="number-pad"
            ></TextInput>
          </SafeAreaView>
        ) : null}

        {isCustom ? (
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
        ) : null}
        {isWandering && isCustom ? (
          <SafeAreaView style={styles.Box}>
            <Text style={styles.Title}>Max Steps in an Hour</Text>
            <TextInput
              style={[styles.Inputs]}
              placeholderTextColor={"rgba(128,128,128,.9)"}
              placeholder="1,000 steps"
              keyboardType="number-pad"
            ></TextInput>
          </SafeAreaView>
        ) : null}
        {isCustom ? (
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
                We'll send you an alert after Testing Care's Fitbit hasn't
                synced for an hour
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        ) : null}

        {isCustom ? (
          <SafeAreaView>
            <SafeAreaView style={[styles.Box, { marginTop: "10%" }]}>
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
                We'll send you an alert when Testing Care's Fitbit has no charge
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        ) : null}
      </KeyboardAwareScrollView>
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
    width: "29.9%",
    backgroundColor: "white",
  },
});
