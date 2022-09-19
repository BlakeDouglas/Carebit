import {
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  TextInput,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";
import { responsiveFontSize } from "react-native-responsive-dimensions";
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

  const lowHeartLimits = [
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
  const highHeartLimits = [
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "100",
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "111",
    "112",
    "113",
    "114",
    "115",
    "116",
    "117",
    "118",
    "119",
    "120",
    "121",
    "122",
    "123",
    "124",
    "125",
    "126",
    "127",
    "128",
    "129",
    "130",
    "131",
    "132",
    "133",
    "134",
    "135",
    "136",
    "137",
    "138",
    "139",
    "140",
    "141",
    "142",
    "143",
    "144",
    "145",
    "146",
    "147",
    "148",
    "149",
    "150",
  ];
  const noActivityLimit = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ];

  const maxSteps = [
    "500",
    "750",
    "1000",
    "1250",
    "1000",
    "1250",
    "1500",
    "1750",
    "2000",
    "2250",
    "2500",
    "2750",
    "3000",
    "3250",
    "3500",
    "4000",
    "4500",
    "5000",
    "5500",
    "6000",
    "6500",
    "7000",
    "7500",
    "8000",
    "8500",
    "9000",
    "9500",
    "10000",
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />
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
              defaultValue={"50"}
              disableAutoScroll={true}
              //search={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={lowHeartLimits}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
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
              defaultValue={"110"}
              disableAutoScroll={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={highHeartLimits}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
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
              defaultValue={"1"}
              disableAutoScroll={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={noActivityLimit}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
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
              defaultValue={"1"}
              disableAutoScroll={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={noActivityLimit}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
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
              defaultValue={"2000"}
              disableAutoScroll={true}
              //search={true}
              selectedRowStyle={{ backgroundColor: "lightgray" }}
              buttonStyle={styles.downButtonStyle2}
              buttonTextStyle={{
                color: "rgba(128,128,128,.9)",
                fontSize: responsiveFontSize(2.2),
              }}
              data={maxSteps}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
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
                We'll send you an alert after Testing Care's Fitbit hasn't
                synced for an hour
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
                We'll send you an alert when Testing Care's Fitbit has no charge
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        )}
      </ScrollView>
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
