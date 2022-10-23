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
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import moment from "moment";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
import call from "react-native-phone-call";
import { resetSelectedData, setSelectedUser } from "../redux/actions";
import {
  caregiveeGetEndpoint,
  caregiveeSetEndpoint,
  getDefaultEndpoint,
  fitbitDataEndpoint,
} from "../network/CarebitAPI";

export default function GiveeHomeScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const dispatch = useDispatch();
  const number = selectedUser.phone || null;
  const args = {
    number,
    prompt: true,
    skipCanOpen: true,
  };
  const [BatteryLevel, setBatteryLevel] = useState(null);
  const [caregivee, setCaregivee] = useState(null);
  const [isModal1Visible, setModal1Visible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  let date = moment().format("dddd, MMM D");
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
    // toggleSleep();
    toggleModal1();
  };
  const toggleSwitchDisturb = () => {
    // toggleDisturb();
    toggleModal2();
  };
  const toggleSwitchMonitor = () => {
    // toggleMonitor();
    toggleModal3();
  };

  const toggleSleep = () => {
    setIsEnabledSleep(!isEnabledSleep);
    setCaregiveeInfo({ sleep: 0 });
  };
  const toggleDisturb = () => {
    setIsEnabledDisturb(!isEnabledDisturb);
    setCaregiveeInfo({ doNotDisturb: 0 });
  };
  const toggleMonitor = () => {
    setIsEnabledMonitor(!isEnabledMonitor);
    setCaregiveeInfo({ monitoring: 1 });
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    updateConnections();
    fetchData();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const updateConnections = async () => {
    const params = {
      auth: tokenData.access_token,
      body: {
        caregiverID: null,
        caregiveeID: tokenData.caregiveeID,
      },
    };
    const json = await getDefaultEndpoint(params);

    // Accounts for array return value and missing default scenarios
    if (json.default) {
      if (json.default[0]) dispatch(setSelectedUser(json.default[0]));
      else dispatch(setSelectedUser(json.default));
    } else {
      const array =
        tokenJson[
          tokenJson.type === "caregiver" ? "caregiveeID" : "caregiverID"
        ];
      const res = array.filter((iter) => iter.status === "accepted");
      if (res[0]) dispatch(setSelectedUser(res[0]));
      else dispatch(resetSelectedData());
    }
  };

  const getCaregiveeInfo = async () => {
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
    };
    const json = await caregiveeGetEndpoint(params);
    if (json.caregivee) {
      setCaregivee(json.caregivee);
      setIsEnabledSleep(json.caregivee.sleep === 1);
      setIsEnabledDisturb(json.caregivee.doNotDisturb === 1);
      setIsEnabledMonitor(json.caregivee.monitoring === 1);
    }
  };

  const setCaregiveeInfo = async (newJson) => {
    const params = {
      targetID: tokenData.caregiveeID,
      auth: tokenData.access_token,
      body: {
        ...caregivee,
        ...newJson,
        physCity: undefined,
        physName: undefined,
        physPhone: undefined,
        physState: undefined,
        physStreet: undefined,
        physZip: undefined,
        caregiveeID: undefined,
        userID: undefined,
      },
    };
    const json = await caregiveeSetEndpoint(params);
    if (json.caregivee) setCaregivee(json.caregivee);
  };

  // CHANGE ALL METRIC TO "device" TO OPTIMIZE
  const fetchData = async () => {
    const params = {
      auth: tokenData.access_token,
      targetID: tokenData.caregiveeID,
      metric: "device",
      period: "recent",
    };
    const json = await fitbitDataEndpoint(params);
    if (!json) {
      console.log("Aborting data pull (Internal server error)");
      return;
    }

    if (json) {
      setBatteryLevel(json.device.battery);
      console.log(json.device.battery);
    }
  };

  // TODO: Move to login, redo caregivee field to accomodate. Will speed up things
  useEffect(() => {
    getCaregiveeInfo();
  }, []);

  return (
    <View style={{ height: windowHeight, width: windowWidth }}>
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
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                width: "110%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",
                textAlign: "left",
                padding: 7,
              }}
            >
              Turning on Sleep Mode will inform your caregiver(s) that you are
              going to sleep. They will not receive alerts.
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
                  setCaregiveeInfo({ sleep: 1 });
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
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                width: "110%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",
                padding: 7,
                textAlign: "left",
              }}
            >
              Turning on Do Not Disturb will inform your caregiver(s) that you
              do not want to be called. They will not receive alerts.
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
                  setCaregiveeInfo({ doNotDisturb: 1 });
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
              width: "100%",
              height: "60%",
              justifyContent: "space-evenly",

              //backgroundColor: "lightblue",
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
            <SafeAreaView
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                width: "100%",
              }}
            ></SafeAreaView>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",
                padding: 7,
                textAlign: "left",
              }}
            >
              Pausing Monitoring will prevent your caregiver(s) from receiving
              any of your health data, including alerts.
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
                  setCaregiveeInfo({ monitoring: 0 });
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            height: windowHeight - 50,
            width: windowWidth,
          }}
        >
          <SafeAreaView
            style={{
              height: "10%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2%",
              //backgroundColor: "blue",
            }}
          >
            <SafeAreaView
              style={{
                //backgroundColor: "green",
                height: "100%",
                width: "64%",
                justifyContent: "center",
                marginRight: "2%",
              }}
            >
              <Text
                style={{
                  marginLeft: "4%",
                  color: "darkgrey",
                  fontSize: responsiveFontSize(1.9),
                }}
                numberOfLines={1}
              >
                Hello {tokenData.firstName || "N/A"}
              </Text>
              {/* All users must have a phone number, otherwise there's no way to add them. Thus, no phone = no user */}
              {/* The only way for us not to have a Caregiver is if we don't have anyone added */}
              {/* Thus, send to add screen if no Caregiver exists */}
              {selectedUser.phone ? (
                <Text
                  style={{
                    color: "black",
                    fontSize: responsiveFontSize(2.2),
                    fontWeight: "500",
                    marginLeft: "4%",
                  }}
                  numberOfLines={1}
                >
                  Your Caregiver is {selectedUser.firstName}
                </Text>
              ) : (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: "dodgerblue",
                      fontSize: responsiveFontSize(2.2),
                      fontWeight: "500",
                      marginLeft: "4%",
                    }}
                    numberOfLines={1}
                    onPress={() => {
                      navigation.navigate("AddScreen");
                    }}
                  >
                    Click To Add A Caregiver
                  </Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "100%",
                width: "28%",
                justifyContent: "center",
                //backgroundColor: "red",
              }}
            >
              {number && (
                <TouchableOpacity
                  style={styles.callBody}
                  onPress={() => {
                    call(args).catch(console.error);
                  }}
                >
                  <Image
                    source={require("../../assets/images/icons-phone-color.imageset/icons-phone-color.png")}
                  />
                  <Text style={styles.callText} numberOfLines={2}>
                    Call {selectedUser.firstName || "N/A"}
                  </Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView
            style={{
              flexDirection: "row",
              height: "19%",
              width: "100%",
              //backgroundColor: "red",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: "5%",
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
              <SafeAreaView
                style={{
                  // backgroundColor: "blue",
                  marginTop: "5%",
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => {
                    navigation.navigate("ReceivedAlertsScreen");
                  }}
                >
                  <Image
                    style={styles.imagesBody}
                    source={require("../../assets/images/icons-alert-big-color.imageset/icons-alert-big-color.png")}
                  />
                </TouchableOpacity>
              </SafeAreaView>
              <SafeAreaView
                style={{
                  height: "40%",
                  width: "100%",
                  //backgroundColor: "red",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Text style={styles.buttonBigText}>Alerts</Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.08),
                    color: "darkgrey",
                    fontWeight: "500",
                  }}
                >
                  0 Today
                </Text>
              </SafeAreaView>
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
              <SafeAreaView
                style={{
                  // backgroundColor: "blue",
                  marginTop: "5%",
                  height: "40%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {BatteryLevel === "High" ? (
                  <Image
                    style={{ height: 29, width: 51 }}
                    source={require("../../assets/images/battery-full.imageset/battery-full.png")}
                  />
                ) : BatteryLevel === "Medium" ? (
                  <Image
                    style={{ height: 29, width: 51 }}
                    source={require("../../assets/images/battery-medium.imageset/battery-medium.png")}
                  />
                ) : (
                  <Image
                    style={{ height: 29, width: 51 }}
                    source={require("../../assets/images/battery-low.imageset/battery-low.png")}
                  />
                )}
              </SafeAreaView>
              <SafeAreaView
                style={{
                  height: "40%",
                  width: "100%",
                  //backgroundColor: "red",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Text style={[styles.buttonBigText]}>Battery</Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.08),
                    color: "darkgrey",
                    fontWeight: "500",
                  }}
                >
                  {BatteryLevel === null ? "Unlinked" : BatteryLevel}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView
            style={{
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
              marginTop: "8%",
              width: "100%",
            }}
          ></SafeAreaView>

          <SafeAreaView
            style={{
              //backgroundColor: "blue",
              alignSelf: "center",
              alignItems: "center",
              height: "8%",
              width: "92%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.preferencesText}>Preferences</Text>
            <Text
              style={{
                color: "darkgrey",
                fontSize: responsiveFontSize(1.8),
                marginRight: "2%",
              }}
            >
              {date}
            </Text>
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
                height: "100%",
                width: "75%",
                //backgroundColor: "green",
                flexDirection: "row",
                //justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isEnabledSleep ? (
                <Image
                  style={[
                    styles.imagesBody,
                    {
                      marginLeft: "5%",
                      marginRight: "5%",
                    },
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
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  //backgroundColor: "red",
                  height: "100%",
                  width: "40%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    styles.buttonBigText,
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
            <SafeAreaView
              style={{
                marginRight: "4%",
                //backgroundColor: "blue",
                height: "100%",
                width: "20%",
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "lightgray", true: "mediumaquamarine" }}
                thumbColor={isEnabledSleep ? "white" : "white"}
                style={styles.switchBody}
                onValueChange={
                  !isEnabledSleep ? toggleSwitchSleep : toggleSleep
                }
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
              { marginTop: "5%" },
            ]}
          >
            <SafeAreaView
              style={{
                height: "100%",
                width: "75%",
                //backgroundColor: "green",
                flexDirection: "row",
                //justifyContent: "center",
                alignItems: "center",
              }}
            >
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
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  justifyContent: "center",
                  //backgroundColor: "red",
                  height: "100%",
                  width: "60%",
                }}
              >
                <Text style={styles.buttonBigText}>Do Not Disturb</Text>
                <Text style={styles.buttonSmallText2}>
                  {isEnabledDisturb ? "On" : "Off"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "100%",
                width: "20%",
                marginRight: "3%",
                justifyContent: "center",
              }}
            >
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
              { marginTop: "5%" },
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
                height: "100%",
                width: "75%",
                //backgroundColor: "green",
                flexDirection: "row",
                //justifyContent: "center",
                alignItems: "center",
              }}
            >
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
              <SafeAreaView
                style={{
                  marginLeft: "4%",
                  alignSelf: "center",
                  justifyContent: "center",
                  //backgroundColor: "red",
                  height: "100%",
                  width: "60%",
                }}
              >
                <Text style={styles.buttonBigText}>Monitoring</Text>
                <Text style={styles.buttonSmallText2}>
                  {isEnabledMonitor ? "Active" : "Paused"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView
              style={{
                marginRight: "4%",
                //backgroundColor: "blue",
                height: "100%",
                width: "20%",
                justifyContent: "center",
              }}
            >
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
    //justifyContent: "center",
    height: "100%",
    width: "43%",
    borderRadius: 5,
  },
  chatBody: {
    backgroundColor: "white",
    alignItems: "center",
    //justifyContent: "center",
    height: "100%",
    width: "43%",
    borderRadius: 5,
  },
  imagesBody: {
    width: 45,
    height: 45,
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
    height: "12%",
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

  buttonBigText: {
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
    marginLeft: "2%",
  },
});
