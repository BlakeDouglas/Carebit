import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { React } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { resetData, setSelectedUser, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import phone from "phone";
import { deleteKeychain } from "../network/Auth";
import { logoutEndpoint } from "../network/CarebitAPI";
export default function GiverSettingsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const logOutButtonHandler = async () => {
    const json = await logoutEndpoint({
      auth: tokenData.access_token,
      targetID: tokenData.userID,
    });
    if (json.error) {
      console.log("Failed /logout: ", json.error);
    }

    deleteKeychain();
    dispatch(resetData());
  };
  const { fontScale } = useWindowDimensions();
  const customAlertButtonHandler = () => {
    navigation.navigate("CustomNotification");
  };

  const activityButtonHandler = () => {
    navigation.navigate("ActivityLevel");
  };
  // Grab country code from phone number
  let physCountryCode = selectedUser
    ? phone(selectedUser.physPhone).countryCode
    : null;
  // Separate phone number from country code
  let physNumber = physCountryCode
    ? selectedUser.physPhone.substring(physCountryCode.length)
    : null;

  let selectedCountryCode = selectedUser
    ? phone(selectedUser.phone).countryCode
    : null;
  let selectedNumber = selectedCountryCode
    ? selectedUser.phone.substring(selectedCountryCode.length)
    : null;
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          translucent={false}
          backgroundColor="dodgerblue"
        />
        <SafeAreaView
          style={{
            marginTop: "8%",
            height: "15%",
            width: "100%",
            borderTopColor: "rgba(255,255,255,0)",
            borderTopWidth: 1,
            borderBottomColor: "rgba(255,255,255,0)",
            borderBottomWidth: 1,
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "rgba(255,255,255,.1)",
          }}
        >
          <Image
            style={{ height: 85, width: 85, marginLeft: "6%" }}
            source={require("../../assets/images/avatar/DefaultAvatar.png")}
          />
          <SafeAreaView
            style={{
              marginLeft: "3%",
              //backgroundColor: "white",
              width: "68%",
              marginRight: "1%",
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.8) / fontScale,
                color: "white",
              }}
              numberOfLines={1}
            >
              {tokenData.firstName || ""} {tokenData.lastName || ""}
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2.1) / fontScale,
                color: "white",
              }}
              numberOfLines={1}
            >
              {tokenData.email || "email error"}
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        {/* If there is no user selected, don't render selected user information */}
        {selectedUser.phone ? (
          <SafeAreaView style={{ width: "100%", height: "63%" }}>
            <SafeAreaView
              style={{
                marginTop: "5%",
                height: "29%",
                width: "100%",
                //backgroundColor: "red",
              }}
            >
              <Text
                style={[
                  styles.Title,
                  { fontSize: responsiveFontSize(1.9) / fontScale },
                ]}
              >
                SELECTED CAREGIVEE
              </Text>

              <SafeAreaView style={styles.Box}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Name
                </Text>
                <SafeAreaView
                  style={{
                    width: "80%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.BoxSub,
                      {
                        textAlign: "right",
                        fontSize: responsiveFontSize(2.2) / fontScale,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedUser.firstName || ""}{" "}
                    {selectedUser.lastName || "N/A"}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
              <SafeAreaView style={styles.Box2}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Phone
                </Text>
                <SafeAreaView
                  style={{
                    width: "80%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.BoxSub,
                      {
                        textAlign: "right",
                        fontSize: responsiveFontSize(2.2) / fontScale,
                      },
                    ]}
                  >
                    {selectedUser.phone
                      ? selectedCountryCode === "+1"
                        ? selectedCountryCode +
                          " (" +
                          selectedNumber.substring(0, 3) +
                          ") " +
                          selectedNumber.substring(3, 6) +
                          "-" +
                          selectedNumber.substring(6)
                        : selectedCountryCode + " " + selectedNumber
                      : "N/A"}
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>

            {/* SELECTED CAREGIVEE Container */}

            <SafeAreaView
              style={{
                height: "29%",
                width: "100%",
                marginTop: "6%",
                //backgroundColor: "blue",
              }}
            >
              <Text
                style={[
                  styles.Title,
                  { fontSize: responsiveFontSize(1.9) / fontScale },
                ]}
              >
                PHYSICIAN INFO
              </Text>

              <SafeAreaView style={styles.Box}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Name
                </Text>
                <Text
                  style={[
                    styles.BoxSub,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                  numberOfLines={1}
                >
                  {selectedUser.physName || "N/A"}
                </Text>
              </SafeAreaView>
              <SafeAreaView style={styles.Box2}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Phone
                </Text>
                <Text
                  style={[
                    styles.BoxSub,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  {selectedUser.physPhone
                    ? physCountryCode === "+1"
                      ? physCountryCode +
                        " (" +
                        physNumber.substring(0, 3) +
                        ") " +
                        physNumber.substring(3, 6) +
                        "-" +
                        physNumber.substring(6)
                      : physCountryCode + " " + physNumber
                    : "N/A"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>

            {/* SELECTED CAREGIVEE Container */}

            <SafeAreaView
              style={{
                height: "29%",
                width: "100%",
                marginTop: "3%",
                //backgroundColor: "blue",
              }}
            >
              <Text
                style={[
                  styles.Title,
                  { fontSize: responsiveFontSize(1.9) / fontScale },
                ]}
              >
                ALERTS
              </Text>

              <SafeAreaView style={styles.Box}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Activity Level
                </Text>
                <TouchableOpacity
                  onPress={activityButtonHandler}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      styles.BoxSub,
                      { fontSize: responsiveFontSize(2.2) / fontScale },
                    ]}
                  >
                    {selectedUser.healthProfile === 1
                      ? "Active"
                      : selectedUser.healthProfile === 2
                      ? "Sedentary"
                      : selectedUser.healthProfile === 3
                      ? "Homebound"
                      : "Select a preset"}
                  </Text>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: "1%",
                      //tintColor: "white",
                      alignSelf: "center",
                    }}
                    source={require("../../assets/images/icons-forward-light.imageset/icons-forward-light.png")}
                  />
                </TouchableOpacity>
              </SafeAreaView>
              <SafeAreaView style={styles.Box2}>
                <Text
                  style={[
                    styles.BoxTitle,
                    { fontSize: responsiveFontSize(2.2) / fontScale },
                  ]}
                >
                  Custom Alert Settings
                </Text>
                <TouchableOpacity
                  onPress={customAlertButtonHandler}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      styles.BoxSub,
                      { fontSize: responsiveFontSize(2.2) / fontScale },
                    ]}
                  >
                    {selectedUser.healthProfile === 4 ? "On" : "Off"}
                  </Text>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: "1%",
                      //tintColor: "black",
                    }}
                    source={require("../../assets/images/icons-forward-light.imageset/icons-forward-light.png")}
                  />
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        ) : (
          <SafeAreaView
            style={{
              height: "50%",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              //backgroundColor: "blue",
            }}
          >
            <SafeAreaView
              style={{
                width: "92%",
                height: "70%",
                justifyContent: "center",
                alignSelf: "center",
                //backgroundColor: "blue",
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2) / fontScale,
                  //fontWeight: "600",
                  color: "white",
                  textAlign: "left",
                }}
              >
                To begin monitoring a Caregivee's Fitbit data and access their
                information, you must add them first. If the person you are
                caring for has already sent you a request, you can accept it
                below.
              </Text>
            </SafeAreaView>

            <SafeAreaView
              style={{
                width: "100%",
                justifyContent: "center",
                //backgroundColor: "green",
              }}
            >
              <TouchableOpacity
                style={GlobalStyle.Button}
                onPress={() => {
                  navigation.navigate("RequestScreen");
                }}
              >
                <Text
                  style={[
                    GlobalStyle.ButtonText,
                    { fontSize: responsiveFontSize(2.51) / fontScale },
                  ]}
                >
                  View Requests
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "5%" }]}
                onPress={() => {
                  navigation.navigate("AddScreen");
                }}
              >
                <Text
                  style={[
                    GlobalStyle.ButtonText,
                    { fontSize: responsiveFontSize(2.51) / fontScale },
                  ]}
                >
                  Add Caregivee
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        )}
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={logOutButtonHandler}
          >
            <Text
              style={{
                color: "red",
                fontSize: responsiveFontSize(2.5) / fontScale,
                fontWeight: "bold",
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  Box: {
    height: "37%",
    width: "100%",
    backgroundColor: "rgba(255,255,255,.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "rgba(255,255,255,0)",
    borderTopWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0)",
    borderBottomWidth: 0.5,
  },
  Box2: {
    height: "37%",
    width: "100%",
    backgroundColor: "rgba(255,255,255,.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "rgba(255,255,255,.8)",
    borderTopWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0)",
    borderBottomWidth: 0.5,
  },
  Title: {
    fontSize: responsiveFontSize(1.9),
    color: "white",
    fontWeight: "500",
    marginLeft: "4%",
    marginBottom: "2%",
  },
  TitleContainer: {
    marginTop: "1%",
    width: "100%",
    justifyContent: "center",
    height: "5%",
    marginLeft: "4%",
  },
  BoxTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    marginLeft: "4%",
    color: "white",
  },
  BoxSub: {
    fontSize: responsiveFontSize(2.2),
    marginRight: "4%",
    color: "white",
  },
});
