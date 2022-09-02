import * as React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Entypo";

import {
  SettingsScreen,
  SettingsData,
  Chevron,
} from "react-native-settings-screen/dist/lib";
import GlobalStyle from "../utils/GlobalStyle";
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";

const renderHero = () => (
  <View style={styles.heroContainer}>
    <Image
      source={require("../../assets/images/default-avatar2.jpg")}
      style={styles.heroImage}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.heroTitle}>Celia Cruz</Text>
      <Text style={styles.heroSubtitle}>CeliaCruz@yahoo.com</Text>
    </View>
    <Chevron />
  </View>
);

export default class App extends React.Component {
  state = {
    refreshing: false,
  };

  settingsData: SettingsData = [
    { type: "CUSTOM_VIEW", key: "hero", render: renderHero },
    {
      type: "SECTION",
      header: "Caregiver".toUpperCase(),
      rows: [
        {
          title: "Paola",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              pjosecare@gmail.com
            </Text>
          ),
        },
        {
          title: "Phone",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              +1 485-482-5837
            </Text>
          ),
        },
      ],
    },
    {
      type: "SECTION",
      header: "Alerts".toUpperCase(),
      footer:
        "Turn on to use custom thresholds instead of Activity Levels to Trigger alerts",
      rows: [
        {
          title: "Use Custom Alerts",
          renderAccessory: () => <Switch value={0} onValueChange={() => {}} />,
        },
      ],
    },

    {
      type: "SECTION",
      header: "Custom Alerts".toUpperCase(),
      rows: [
        {
          title: "Heart Rate Alerts",
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
        },
        {
          title: "Low Heart Rate",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              50 BPM
            </Text>
          ),
        },
        {
          title: "High Heart Rate",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              130 BPM
            </Text>
          ),
          showDisclosureIndicator: true,
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: "No Activity Alerts",
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
        },
        {
          title: "Time Without Heart Rate",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              1 hours
            </Text>
          ),
          showDisclosureIndicator: true,
        },
        {
          title: "Time Without Steps",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              1 hours
            </Text>
          ),
          showDisclosureIndicator: true,
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: "Wandering Alerts",
          renderAccessory: () => <Switch value={0} onValueChange={() => {}} />,
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: "No Sync Alerts",
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
        },
      ],
    },

    {
      type: "SECTION",
      rows: [
        {
          title: "Logout",
          titleStyle: {
            color: "red",
          },
        },
      ],
    },
    {
      type: "CUSTOM_VIEW",
      render: () => (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 18,
            color: "#999",
            marginBottom: 40,
            marginTop: -30,
            fontFamily,
          }}
        >
          v1.2.3
        </Text>
      ),
    },
  ];

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <View style={styles.navBar}>
          <Text style={styles.navBarTitle}>Settings</Text>
        </View>
        <SettingsScreen
          data={this.settingsData}
          globalTextStyle={{ fontFamily }}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true });
                  setTimeout(() => this.setState({ refreshing: false }), 3000);
                }}
              />
            ),
          }}
        />
      </View>
    );
  }
}

const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBar: {
    backgroundColor: "#007AFF",
    height: 44 + statusBarHeight,
    alignSelf: "stretch",
    paddingTop: statusBarHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  navBarTitle: {
    color: "white",
    fontFamily,
    fontSize: 17,
  },
  heroContainer: {
    marginTop: 40,
    marginBottom: 50,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    flexDirection: "row",
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "black",
    marginHorizontal: 20,
  },
  heroTitle: {
    fontFamily,
    color: "black",
    fontSize: 24,
  },
  heroSubtitle: {
    fontFamily,
    color: "#999",
    fontSize: 14,
  },
});
