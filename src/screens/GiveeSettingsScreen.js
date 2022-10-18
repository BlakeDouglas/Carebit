import {
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { resetData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import phone from "phone";
export default function GiveeSettingsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
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
    // Header Container
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
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          style={{ height: 85, width: 85, marginLeft: "6%" }}
          source={require("../../assets/images/avatar/DefaultAvatar.png")}
        />
        <SafeAreaView
          style={{
            marginLeft: "3%",
            //backgroundColor: "blue",
            width: "68%",
            marginRight: "1%",
          }}
        >
          <Text
            style={{ fontSize: responsiveFontSize(2.8), width: "100%" }}
            numberOfLines={1}
          >
            {tokenData.firstName || "N/A"} {tokenData.lastName || ""}
          </Text>
          <Text style={{ fontSize: responsiveFontSize(2.1) }} numberOfLines={1}>
            {tokenData.email || "N/A"}
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>SELECTED CAREGIVER</Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
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
            {selectedUser.firstName || ""} {selectedUser.lastName || "N/A"}
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
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
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <SafeAreaView
          style={{
            width: "80%",
            height: "100%",

            justifyContent: "center",
          }}
        >
          <Text style={[styles.BoxSub, { textAlign: "right" }]}>
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
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>PHYSICIAN INFO</Text>
      </SafeAreaView>
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
            {tokenData.physName || "N/A"}
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
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
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Box: {
    height: "7%",
    width: "100%",
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
    fontSize: responsiveFontSize(1.9),
    color: "gray",
    fontWeight: "500",
  },
  TitleContainer: {
    marginTop: "5%",
    width: "100%",
    justifyContent: "center",
    height: "5%",
    marginLeft: "4%",
  },
  BoxTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    marginLeft: "4%",
  },
  BoxSub: {
    fontSize: responsiveFontSize(2.2),
    marginRight: "4%",
    color: "rgba(128,128,128,.8)",
  },
});
