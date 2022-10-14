import { StyleSheet, SafeAreaView, Text, Image, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { React } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { resetData, setSelectedUser, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function GiverSettingsScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const logOutButtonHandler = async () => {
    await SecureStore.deleteItemAsync("carebitcredentials");
    dispatch(resetData());
  };

  const customAlertButtonHandler = () => {
    navigation.navigate("CustomNotification");
  };

  const activityButtonHandler = () => {
    navigation.navigate("ActivityLevel");
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
          <Text style={{ fontSize: responsiveFontSize(2.8) }}>
            {tokenData.firstName || "N/A"} {tokenData.lastName || "N/A"}
          </Text>
          <Text style={{ fontSize: responsiveFontSize(2.1) }}>
            {tokenData.email || "N/A"}
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>SELECTED CAREGIVEE</Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Name</Text>
        <Text style={styles.BoxSub}>
          {selectedUser.firstName || ""} {selectedUser.lastName || "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>
          {selectedUser.phone
            ? "(" +
              selectedUser.phone.substring(0, 3) +
              ") " +
              selectedUser.phone.substring(3, 6) +
              "-" +
              selectedUser.phone.substring(6)
            : "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>PHYSICIAN INFO</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Name</Text>
        <Text style={styles.BoxSub}>{selectedUser.physName || "N/A"}</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>
          {selectedUser.physPhone
            ? "(" +
              selectedUser.physPhone.substring(0, 3) +
              ") " +
              selectedUser.physPhone.substring(3, 6) +
              "-" +
              selectedUser.physPhone.substring(6)
            : "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>ALERTS</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Activity Level</Text>
        <TouchableOpacity
          onPress={activityButtonHandler}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text style={styles.BoxSub}>Active</Text>
          <Image
            style={{ height: 15, width: 15, marginLeft: "1%" }}
            source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Custom Alert Settings</Text>
        <TouchableOpacity
          onPress={customAlertButtonHandler}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text style={styles.BoxSub}>
            {selectedUser.healthProfile === 4 ? "On" : "Off"}
          </Text>
          <Image
            style={{ height: 15, width: 15, marginLeft: "1%" }}
            source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
          />
        </TouchableOpacity>
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
    marginTop: "2%",
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
