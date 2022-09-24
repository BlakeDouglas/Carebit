import { StyleSheet, SafeAreaView, Text, StatusBar, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { resetData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function GiveeSettingsScreen({ navigation }) {
  const userData = useSelector((state) => state.Reducers.userData);
  const physData = useSelector((state) => state.Reducers.physData);
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const logOutButtonHandler = async () => {
    await SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
  };
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
        <SafeAreaView style={{ marginLeft: "5%" }}>
          <Text style={{ fontSize: responsiveFontSize(2.8), width: "100%" }}>
            {userData.firstName || "N/A"} {userData.lastName || "N/A"}
          </Text>
          <Text style={{ fontSize: responsiveFontSize(2.1) }}>
            {userData.email || "N/A"}
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>SELECTED CAREGIVER</Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Name</Text>
        <Text style={styles.BoxSub}>
          {tokenData.caregiverID.length !== 0
            ? tokenData.caregiverID[tokenData.selected].firstName
            : "N/A"}{" "}
          {tokenData.caregiverID.length !== 0
            ? tokenData.caregiverID[tokenData.selected].lastName
            : "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Email</Text>
        <Text style={styles.BoxSub}>
          {tokenData.caregiverID.length !== 0
            ? tokenData.caregiverID[tokenData.selected].email
            : "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>
          {tokenData.caregiverID.length !== 0
            ? "(" +
              tokenData.caregiverID[tokenData.selected].phone.substring(0, 3) +
              ") " +
              tokenData.caregiverID[tokenData.selected].phone.substring(3, 6) +
              "-" +
              tokenData.caregiverID[tokenData.selected].phone.substring(6)
            : "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>PHYSICIAN INFO</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Name</Text>
        <Text style={styles.BoxSub}>{physData.physName || "N/A"}</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>
          {"(" +
            physData.physPhone.substring(0, 3) +
            ") " +
            physData.physPhone.substring(3, 6) +
            "-" +
            physData.physPhone.substring(6) || "N/A"}
        </Text>
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
