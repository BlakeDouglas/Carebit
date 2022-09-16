import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
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

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const args = {
    number: "4077777777",
    prompt: true,
  };
  return (
    <View style={styles.mainBody}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />

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
              Pausing Monitoring will prevent Pam from receiving any of your
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

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "whitesmoke",
          }}
        >
          <SafeAreaView style={{}}>
            <Text
              style={{
                marginTop: Platform.OS === "ios" ? "12%" : "5%",
                marginLeft: "4%",
                color: "darkgrey",
                fontSize: responsiveFontSize(1.9),
              }}
            >
              Hello Testing Care
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(2.4),
                fontWeight: "500",
                marginLeft: "4%",
                marginTop: Platform.OS === "ios" ? "4%" : 0,
              }}
            >
              Your Caregiver is Paola
            </Text>
          </SafeAreaView>
          <SafeAreaView>
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
        </SafeAreaView>

        <SafeAreaView
          style={{
            flexDirection: "row",
            //backgroundColor: "red",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: Platform.OS === "ios" ? "8%" : "5%",
          }}
        >
          <SafeAreaView
            style={[
              styles.alertBody,
              {
                ...Platform.select({
                  ios: {
                    shadowColor: "gray",
                    shadowOffset: { width: 4, height: 10 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
              },
            ]}
          >
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
          <SafeAreaView
            style={[
              styles.chatBody,
              {
                ...Platform.select({
                  ios: {
                    shadowColor: "gray",
                    shadowOffset: { width: 4, height: 10 },
                    shadowOpacity: 0.4,
                  },
                  android: {
                    elevation: 6,
                  },
                }),
              },
            ]}
          >
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
            marginTop: Platform.OS === "ios" ? "7%" : "5%",
          }}
        ></SafeAreaView>

        <SafeAreaView>
          <Text style={styles.preferencesText}>Preferences</Text>
        </SafeAreaView>

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
              : {
                  ...Platform.select({
                    ios: {
                      shadowColor: "gray",
                      shadowOffset: { width: 4, height: 10 },
                      shadowOpacity: 0.4,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                },
            isEnabledSleep
              ? { backgroundColor: "black" }
              : { backgroundColor: "white" },
          ]}
        >
          <SafeAreaView
            style={{
              //backgroundColor: "green",
              flexDirection: "row",
              alignItems: "space-between",
            }}
          >
            {isEnabledSleep ? (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-sleep-on.imageset/icons-caregivee-sleep-on.png")}
              />
            ) : (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-sleep-off.imageset/icons-caregivee-sleep-off.png")}
              />
            )}
            <SafeAreaView
              style={{
                marginLeft: "4%",
                alignSelf: "center",
                //backgroundColor: "red",
              }}
            >
              <Text
                style={[
                  styles.buttonBigText2,
                  isEnabledSleep ? { color: "white" } : { color: "black" },
                ]}
              >
                Sleep Mode
              </Text>
              <Text style={styles.buttonSmallText2}>
                {isEnabledSleep ? "On" : "Off"}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={{ marginRight: "6%" }}>
            <Switch
              trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
              thumbColor={isEnabledSleep ? "white" : "white"}
              style={styles.switchBody}
              onValueChange={!isEnabledSleep ? toggleSwitchSleep : toggleSleep}
              value={isEnabledSleep}
            />
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView
          style={[
            styles.bottomRowBody,
            {
              ...Platform.select({
                ios: {
                  shadowColor: "gray",
                  shadowOffset: { width: 4, height: 10 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 6,
                },
              }),
            },
          ]}
        >
          <SafeAreaView
            style={{
              //backgroundColor: "green",
              flexDirection: "row",
              alignItems: "space-between",
            }}
          >
            {isEnabledDisturb ? (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-dnd-on.imageset/icons-caregivee-dnd-on.png")}
              />
            ) : (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-dnd-off.imageset/icons-caregivee-dnd-off.png")}
              />
            )}
            <SafeAreaView
              style={{
                marginLeft: "4%",
                alignSelf: "center",
                //backgroundColor: "red",
              }}
            >
              <Text style={styles.buttonBigText2}>Do Not Disturb</Text>
              <Text style={styles.buttonSmallText2}>
                {isEnabledDisturb ? "On" : "Off"}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={{ marginRight: "6%" }}>
            <Switch
              trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
              thumbColor={isEnabledDisturb ? "white" : "white"}
              style={styles.switchBody}
              onValueChange={
                !isEnabledDisturb ? toggleSwitchDisturb : toggleDisturb
              }
              value={isEnabledDisturb}
            />
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView
          style={[
            styles.bottomRowBody,
            {
              ...Platform.select({
                ios: {
                  shadowColor: "gray",
                  shadowOffset: { width: 4, height: 10 },
                  shadowOpacity: 0.4,
                },
                android: {
                  elevation: 6,
                },
              }),
            },
          ]}
        >
          <SafeAreaView
            style={{
              //backgroundColor: "green",
              flexDirection: "row",
              alignItems: "space-between",
            }}
          >
            {isEnabledMonitor ? (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-monitor-on.imageset/icons-caregivee-monitor-on.png")}
              />
            ) : (
              <Image
                style={[
                  styles.imagesBody2,
                  { marginLeft: "5%", marginRight: "5%" },
                ]}
                source={require("../../assets/images/icons-caregivee-monitor-off.imageset/icons-caregivee-monitor-off.png")}
              />
            )}
            <SafeAreaView
              style={{
                marginLeft: "4%",
                alignSelf: "center",
                //backgroundColor: "red",
              }}
            >
              <Text style={styles.buttonBigText2}>Monitoring</Text>
              <Text style={styles.buttonSmallText2}>
                {isEnabledMonitor ? "Active" : "Paused"}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={{ marginRight: "6%" }}>
            <Switch
              trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
              thumbColor={isEnabledMonitor ? "white" : "white"}
              style={styles.switchBody}
              onValueChange={
                isEnabledMonitor ? toggleSwitchMonitor : toggleMonitor
              }
              value={isEnabledMonitor}
            />
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView>
          <Text></Text>
        </SafeAreaView>
      </ScrollView>
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
    flexDirection: "row",
    marginRight: "4%",
    marginTop: Platform.OS == "ios" ? "10%" : "5%",
    justifyContent: "center",
  },
  mediumBody: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "33%",
  },
  alertBody: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  chatBody: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  imagesBody: {
    width: 45,
    height: 45,
    marginTop: Platform.OS === "ios" ? "10%" : "8%",
    marginHorizontal: "16%",
  },
  imagesBody2: {
    width: 45,
    height: 45,
    marginVertical: Platform.OS === "ios" ? "10%" : "8%",
  },
  switchBody: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  bottomBody: {
    height: "90%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomRowBody: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "5%",
    flexDirection: "row",
    borderRadius: 5,
  },

  helloText: {
    color: "darkgrey",
    fontSize: responsiveFontSize(2.15),
    //fontWeight: "bold",
  },

  callText: {
    color: "dodgerblue",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginLeft: "2%",
  },
  caregiverText: {
    color: "black",
    fontSize: responsiveFontSize(2.63),
    fontWeight: "500",
    marginTop: "4%",
  },
  buttonBigText: {
    fontSize: responsiveFontSize(2.25),
    fontWeight: "500",
    marginTop: "5%",
  },
  buttonBigText2: {
    fontSize: responsiveFontSize(2.25),
    fontWeight: "500",
  },
  buttonSmallText: {
    fontSize: responsiveFontSize(2.08),
    color: "darkgrey",
    fontWeight: "500",
    marginTop: "3%",
    marginBottom: "10%",
  },
  buttonSmallText2: {
    fontSize: responsiveFontSize(2.08),
    color: "darkgrey",
    fontWeight: "500",
    marginTop: "3%",
  },
  preferencesText: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: "500",
    marginLeft: "4%",
    marginTop: Platform.OS === "ios" ? "5%" : "3%",
  },
});
