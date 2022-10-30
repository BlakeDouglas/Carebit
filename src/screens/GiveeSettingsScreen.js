import {
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { resetData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import phone from "phone";
import GlobalStyle from "../utils/GlobalStyle";
export default function GiveeSettingsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const fontScale = useWindowDimensions();
  const logOutButtonHandler = async () => {
    SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
  };
  // Grab country code from phone number
  const physCountryCode = phone(tokenData.physPhone).countryCode;
  // Separate phone number from country code
  const physNumber = tokenData.physPhone.substring(physCountryCode.length);

  // Grab country code from phone number
  let selectedCountryCode = selectedUser
    ? phone(selectedUser.phone).countryCode
    : null;
  // Separate phone number from country code
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
        {/* Settings header container. Includes Setting image, name, and email */}
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
              width: "68%",
              marginRight: "1%",
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.8) / fontScale,
                width: "100%",
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

        <SafeAreaView
          style={{
            width: "100%",
            height: "19%",
            marginTop: "8%",
            //backgroundColor: "blue",
          }}
        >
          <Text style={styles.Title}>PHYSICIAN INFO</Text>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Name</Text>
            <SafeAreaView
              style={{
                width: "80%",
                height: "100%",
                //backgroundColor: "blue",
                justifyContent: "center",
              }}
            >
              <Text
                style={[styles.BoxSub, { textAlign: "right" }]}
                numberOfLines={1}
              >
                {tokenData.physName || ""}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={styles.Box2}>
            <Text style={styles.BoxTitle}>Phone</Text>
            <SafeAreaView
              style={{
                width: "80%",
                height: "100%",

                justifyContent: "center",
              }}
            >
              <Text style={[styles.BoxSub, { textAlign: "right" }]}>
                {tokenData.physPhone
                  ? physCountryCode === "+1"
                    ? physCountryCode +
                      " (" +
                      physNumber.substring(0, 3) +
                      ") " +
                      physNumber.substring(3, 6) +
                      "-" +
                      physNumber.substring(6)
                    : physCountryCode + " " + physNumber
                  : ""}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>

        {/* SELECTED CAREGIVER Container */}
        {selectedUser.phone ? (
          <SafeAreaView
            style={{
              marginTop: "6%",
              height: "19%",
              width: "100%",
            }}
          >
            <Text style={styles.Title}>SELECTED CAREGIVER</Text>
            <SafeAreaView style={styles.Box}>
              <Text style={styles.BoxTitle}>Name</Text>
              <SafeAreaView
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[styles.BoxSub, { textAlign: "right" }]}
                  numberOfLines={1}
                >
                  {selectedUser.firstName || ""}{" "}
                  {selectedUser.lastName || "N/A"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView style={styles.Box2}>
              <Text style={styles.BoxTitle}>Email</Text>
              <SafeAreaView
                style={{
                  width: "80%",
                  height: "100%",

                  justifyContent: "center",
                }}
              >
                <Text
                  style={[styles.BoxSub, { textAlign: "right" }]}
                  numberOfLines={1}
                >
                  {selectedUser.email || "N/A"}
                </Text>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        ) : (
          <SafeAreaView
            style={{
              height: "39%",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              //backgroundColor: "blue",
            }}
          >
            <SafeAreaView
              style={{
                width: "92%",
                height: "40%",
                justifyContent: "center",

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
                To view additional information and start being monitored, you
                will need to add a Caregiver. If your Caregiver has already sent
                you a request, you can accept it below
              </Text>
            </SafeAreaView>

            <SafeAreaView
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "3%",
                //backgroundColor: "green",
              }}
            >
              <TouchableOpacity
                style={GlobalStyle.Button}
                onPress={() => {
                  navigation.navigate("RequestScreen");
                }}
              >
                <Text style={GlobalStyle.ButtonText}>View Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "5%" }]}
                onPress={() => {
                  navigation.navigate("AddScreen");
                }}
              >
                <Text style={GlobalStyle.ButtonText}>Add Caregiver</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        )}

        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
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
    height: "38%",
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
    height: "38%",
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
    fontSize: responsiveFontSize(1.9) / fontScale,
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
    fontSize: responsiveFontSize(2.2) / fontScale,
    fontWeight: "600",
    marginLeft: "4%",
    color: "white",
  },
  BoxSub: {
    fontSize: responsiveFontSize(2.2) / fontScale,
    marginRight: "4%",
    color: "white",
  },
});
