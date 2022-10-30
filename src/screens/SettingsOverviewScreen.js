import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { deleteRequestEndpoint } from "../network/CarebitAPI";

export default function SettingsOverviewScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const { fontScale } = useWindowDimensions();
  const customAlertButtonHandler = () => {
    navigation.navigate("CustomNotification", route.params);
  };

  const activityButtonHandler = () => {
    navigation.navigate("ActivityLevel", route.params);
  };

  const deleteConnection = async (rejectID) => {
    const params = { auth: tokenData.access_token, targetID: rejectID };
    const json = await deleteRequestEndpoint(params);
    navigation.navigate("HomeScreen");
  };

  const oppositeUser =
    tokenData.type === "caregiver" ? "caregivee" : "caregiver";
  const onPressDelete = (item) => {
    console.log(item);
    Alert.alert(
      `Remove ${item.firstName} ${item.lastName} as a ${oppositeUser}?`,
      "",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            deleteConnection(item.requestID);
          },
        },
      ]
    );
  };

  return (
    // Header Container
    <SafeAreaView style={{ flex: 1, marginTop: "2%" }}>
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor="dodgerblue"
      />

      <SafeAreaView style={styles.TitleContainer}>
        <Text
          style={[
            styles.Title,
            { fontSize: responsiveFontSize(1.9) / fontScale },
          ]}
        >
          {"SELECTED "}
          {tokenData.type === "caregivee" ? "CAREGIVER" : "CAREGIVEE"}
        </Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
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
        >
          {selectedUser.firstName || "N/A"} {selectedUser.lastName || "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text
          style={[
            styles.BoxTitle,
            { fontSize: responsiveFontSize(2.2) / fontScale },
          ]}
        >
          Email
        </Text>
        <Text
          style={[
            styles.BoxSub,
            { fontSize: responsiveFontSize(2.2) / fontScale },
          ]}
        >
          {selectedUser.email || "N/A"}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
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
          {"(" +
            selectedUser.phone.substring(0, 3) +
            ") " +
            selectedUser.phone.substring(3, 6) +
            "-" +
            selectedUser.phone.substring(6) || "N/A"}
        </Text>
      </SafeAreaView>

      {tokenData.type === "caregiver" && (
        <>
          <SafeAreaView style={styles.TitleContainer}>
            <Text
              style={[
                styles.Title,
                { fontSize: responsiveFontSize(1.9) / fontScale },
              ]}
            >
              PHYSICIAN INFO
            </Text>
          </SafeAreaView>
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
            >
              {selectedUser.physName || "N/A"}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
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
              {selectedUser.physPhone || "N/A"}
            </Text>
          </SafeAreaView>

          <SafeAreaView style={styles.TitleContainer}>
            <Text
              style={[
                styles.Title,
                { fontSize: responsiveFontSize(1.9) / fontScale },
              ]}
            >
              ALERTS
            </Text>
          </SafeAreaView>
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
              onPress={() => {
                activityButtonHandler();
              }}
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
                Active
              </Text>
              <Image
                style={{ height: 15, width: 15, marginLeft: "1%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text
              style={[
                styles.BoxTitle,
                { fontSize: responsiveFontSize(2.2) / fontScale },
              ]}
            >
              Custom Alert Settings
            </Text>
            <TouchableOpacity
              onPress={() => {
                customAlertButtonHandler();
              }}
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
                style={{ height: 15, width: 15, marginLeft: "1%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </>
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
          onPress={() => {
            onPressDelete(selectedUser);
          }}
        >
          <Text
            style={{
              color: "red",
              fontSize: responsiveFontSize(2.5) / fontScale,
              fontWeight: "bold",
            }}
          >
            Delete {tokenData.type === "caregiver" ? "Caregivee" : "Caregiver"}
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
