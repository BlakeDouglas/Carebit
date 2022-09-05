import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
import call from "react-native-phone-call";

export default function GiveeHomeScreen({ navigation }) {
  const [isModal1Visible, setModal1Visible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [isModal3Visible, setModal3Visible] = useState(false);
  const toggleModal1 = () => {
    setModal1Visible(!isModal1Visible);
  };
  const toggleModal2 = () => {
    setModal2Visible(!isModal2Visible);
  };
  const toggleModal3 = () => {
    setModal3Visible(!isModal3Visible);
  };

  const [isEnabledSleep, setIsEnabledSleep] = useState(false);
  const [isEnabledDisturb, setIsEnabledDisturb] = useState(false);
  const [isEnabledMonitor, setIsEnabledMonitor] = useState(true);
  const toggleSwitchSleep = () => {
    toggleSleep();
    toggleModal1();
  };
  const toggleSwitchDisturb = () => {
    toggleDisturb();
    toggleModal2();
  };
  const toggleSwitchMonitor = () => {
    toggleMonitor();
    toggleModal3();
  };

  const toggleSleep = () => {
    setIsEnabledSleep(!isEnabledSleep);
  };
  const toggleDisturb = () => {
    setIsEnabledDisturb(!isEnabledDisturb);
  };
  const toggleMonitor = () => {
    setIsEnabledMonitor(!isEnabledMonitor);
  };

  const args = {
    number: "4077777777",
    prompt: true,
  };
  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  return (
    // Main Screen Wrapper. Sets background white
    <View style={styles.mainBody}>
      <Modal
        isVisible={isModal1Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: "30%",
            width: "70%",
            backgroundColor: "white",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Sleep Mode
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Turning on Sleep Mode will inform Pam that you are going to sleep.
              They will not receive alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  setIsEnabledSleep((isEnabledSleep) => true);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Turn Sleep Mode On
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  setIsEnabledSleep((isEnabledSleep) => false);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Keep Sleep Mode Off
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        isVisible={isModal2Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: "30%",
            width: "70%",
            backgroundColor: "white",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Do Not Disturb
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",

                textAlign: "center",
              }}
            >
              Turning on Do Not Disturb will inform Pam that you do not want to
              be called. They will not receive alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal2();
                  setIsEnabledDisturb((isEnabledDisturb) => true);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Turn Do Not Disturb On
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal2();
                  setIsEnabledDisturb((isEnabledDisturb) => false);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Keep Do Not Disturb Off
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        isVisible={isModal3Visible}
        backdropOpacity={0.5}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: "30%",
            width: "70%",
            backgroundColor: "white",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Monitoring
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",

                textAlign: "center",
              }}
            >
              Pauing Monitoring will prevent Pam from receiving any of your
              health data, including alerts.
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal3();
                  setIsEnabledMonitor((isEnabledMonitor) => false);
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Pause Monitoring
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal3();
                  setIsEnabledMonitor((isEnabledMonitor) => true);
                }}
              >
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Keep Monitoring
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>

      <SafeAreaView
        style={[
          styles.mediumTopBody,
          {
            alignItems: "center",
            height: "10%",
            width: "100%",
            flexDirection: "row",
          },
        ]}
      >
        <SafeAreaView style={{ marginLeft: "3%" }}>
          <Text style={styles.helloText}>Hello Testing care</Text>
          <Text style={styles.caregiverText}>Your Caregiver is Paola</Text>
        </SafeAreaView>

        <TouchableOpacity
          style={styles.callBody}
          onPress={() => {
            call(args).catch(console.error);
          }}
        >
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
          marginTop: "7%",
          marginBottom: "3%",
        }}
      ></SafeAreaView>
      <Text style={styles.preferencesText}>Preferences</Text>

      <SafeAreaView style={styles.bottomBody}>
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
            onValueChange={!isEnabledSleep ? toggleSwitchSleep : toggleSleep}
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
            onValueChange={
              !isEnabledDisturb ? toggleSwitchDisturb : toggleDisturb
            }
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
            onValueChange={
              isEnabledMonitor ? toggleSwitchMonitor : toggleMonitor
            }
            value={isEnabledMonitor}
          />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    height: "100%",
    width: "100%",
    backgroundColor: "whitesmoke",
  },

  mediumTopBody: {
    flexDirection: "row",
    marginBottom: "7.8%",
  },
  callBody: {
    alignItems: "center",
    marginLeft: "10%",
    flexDirection: "row",
    justifyContent: "center",
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
    borderRadius: 8,
    marginRight: "2%",
  },
  chatBody: {
    width: "43%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
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
    borderRadius: 8,
  },

  helloText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(2.15),
    fontWeight: "bold",
  },

  callText: {
    color: "dodgerblue",
    fontSize: responsiveFontSize(2.25),
    fontWeight: "bold",
    marginLeft: "2%",
  },
  caregiverText: {
    color: "black",
    fontSize: responsiveFontSize(2.63),
    fontWeight: "500",
  },
  buttonBigText: {
    fontSize: responsiveFontSize(2.25),
    fontWeight: "500",
    marginTop: "10%",
  },
  buttonSmallText: {
    fontSize: responsiveFontSize(2.08),
    color: "darkgrey",
    fontWeight: "500",
  },
  preferencesText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "500",
    marginLeft: "5%",
  },
});
