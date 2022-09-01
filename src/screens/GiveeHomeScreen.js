import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import GlobalStyle from "../utils/GlobalStyle";

export default function GiveeHomeScreen({ navigation }) {
  const [isEnabledSleep, setIsEnabledSleep] = useState(false);
  const [isEnabledDisturb, setIsEnabledDisturb] = useState(false);
  const [isEnabledMonitor, setIsEnabledMonitor] = useState(true);
  const toggleSwitchSleep = () => {
    setIsEnabledSleep((previousState) => !previousState);
  };
  const toggleSwitchDisturb = () => {
    setIsEnabledDisturb((previousState) => !previousState);
  };
  const toggleSwitchMonitor = () => {
    setIsEnabledMonitor((previousState) => !previousState);
  };
  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  return (
    // Main Screen Wrapper. Sets background white
    <View style={styles.mainBody}>
      <SafeAreaView style={styles.mediumTopBody}>
        <SafeAreaView>
          <Text style={styles.helloText}>Hello Testing care</Text>
          <Text style={styles.caregiverText}>Your Caregiver is Paola</Text>
        </SafeAreaView>

        <TouchableOpacity style={styles.callBody}>
          <Image
            source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
          />
          <Text style={styles.callText}>Call Paola</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={styles.mediumBody}>
        <SafeAreaView style={styles.alertBody}>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              style={styles.imagesBody}
              source={require("../../assets/images/icons-alert-big-color.imageset/icons-alert-big-color.png")}
            />
            <Text style={styles.buttonBigText}>Alerts</Text>
            <Text style={styles.buttonSmallText}>0 Today</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <SafeAreaView style={styles.chatBody}>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              style={styles.imagesBody}
              source={require("../../assets/images/icons-caregivee-message.imageset/icons-caregivee-message.png")}
            />
            <Text style={styles.buttonBigText}>Quick Chat</Text>
            <Text style={styles.buttonSmallText}>0 New</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView
        style={{
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          marginTop: "8%",
        }}
      ></SafeAreaView>
      <Text style={styles.preferencesText}>Preferences</Text>

      <SafeAreaView style={[styles.bottomBody]}>
        <SafeAreaView
          style={[
            styles.bottomRowBody,
            isEnabledSleep
              ? {
                  ...Platform.select({
                    ios: {
                      shadowColor: "blue",
                      shadowOffset: { width: 4, height: 10 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }
              : {},
            isEnabledSleep
              ? { backgroundColor: "black" }
              : { backgroundColor: "white" },
          ]}
        >
          {isEnabledSleep ? (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-sleep-on.imageset/icons-caregivee-sleep-on.png")}
            />
          ) : (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-sleep-off.imageset/icons-caregivee-sleep-off.png")}
            />
          )}
          <SafeAreaView>
            <Text
              style={[
                styles.buttonBigText,
                isEnabledSleep ? { color: "white" } : { color: "black" },
              ]}
            >
              Sleep Mode
            </Text>
            <Text style={styles.buttonSmallText}>
              {isEnabledSleep ? "On" : "Off"}
            </Text>
          </SafeAreaView>
          <Switch
            trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
            thumbColor={isEnabledSleep ? "white" : "white"}
            style={styles.switchBody}
            onValueChange={toggleSwitchSleep}
            value={isEnabledSleep}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.bottomRowBody}>
          {isEnabledDisturb ? (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-dnd-on.imageset/icons-caregivee-dnd-on.png")}
            />
          ) : (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-dnd-off.imageset/icons-caregivee-dnd-off.png")}
            />
          )}

          <SafeAreaView>
            <Text style={styles.buttonBigText}>Do Not Disturb</Text>
            <Text style={styles.buttonSmallText}>
              {isEnabledDisturb ? "On" : "Off"}
            </Text>
          </SafeAreaView>
          <Switch
            trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
            thumbColor={isEnabledDisturb ? "white" : "white"}
            style={styles.switchBodyDisturb}
            onValueChange={toggleSwitchDisturb}
            value={isEnabledDisturb}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.bottomRowBody}>
          {isEnabledMonitor ? (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-monitor-on.imageset/icons-caregivee-monitor-on.png")}
            />
          ) : (
            <Image
              style={[
                styles.imagesBody,
                { marginLeft: "5%", marginRight: "5%" },
              ]}
              source={require("../../assets/images/icons-caregivee-monitor-off.imageset/icons-caregivee-monitor-off.png")}
            />
          )}

          <SafeAreaView>
            <Text style={styles.buttonBigText}>Monitoring</Text>
            <Text style={styles.buttonSmallText}>
              {isEnabledMonitor ? "Active" : "Paused"}
            </Text>
          </SafeAreaView>
          <Switch
            trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
            thumbColor={isEnabledMonitor ? "white" : "white"}
            style={styles.switchBodyMonitoring}
            onValueChange={toggleSwitchMonitor}
            value={isEnabledMonitor}
          />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBody: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "dodgerblue",
    alignItems: "center",
    padding: 10,
  },
  settingImageBody: {
    marginLeft: 20,
  },
  mainBody: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
  carebitSyncBody: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    marginLeft: 85,
    marginBottom: 10,
    marginTop: 15,
  },
  mediumTopBody: {
    flexDirection: "row",
    marginBottom: 30,
  },
  callBody: {
    alignItems: "center",
    marginLeft: 30,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  mediumBody: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
  },
  alertBody: {
    width: "43%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    marginRight: "2%",
  },
  chatBody: {
    width: "43%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    marginLeft: "2%",
  },
  imagesBody: {
    width: 45,
    height: 45,
  },
  switchBody: {
    marginLeft: "32%",
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  switchBodyMonitoring: {
    marginLeft: "34%",
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  switchBodyDisturb: {
    marginLeft: "25%",
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  bottomBody: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomRowBody: {
    width: "95%",
    height: "22%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    borderRadius: 7,
  },

  carebitText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
  },
  syncText: {
    color: "white",
    fontSize: 15,
    marginBottom: 10,
  },
  helloText: {
    color: "darkgrey",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },

  callText: {
    color: "dodgerblue",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  caregiverText: {
    color: "black",
    fontSize: 21,
    marginLeft: "5%",
    fontWeight: "500",
  },
  buttonBigText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: "10%",
  },
  buttonSmallText: {
    fontSize: 16,
    color: "darkgrey",
    fontWeight: "500",
  },
  preferencesText: {
    marginTop: "3%",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: "5%",
  },
});
