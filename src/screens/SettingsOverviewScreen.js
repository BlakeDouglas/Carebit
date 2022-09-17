import { StyleSheet, SafeAreaView, Text, Image, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { React } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Provider, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function SettingsOverviewScreen({ navigation }) {
  const userData = useSelector((state) => state.Reducers.tokenData);

  const logOutButtonHandler = () => {
    navigation.navigate("TitleScreen");
  };
  const customAlertButtonHandler = () => {
    navigation.navigate("CustomNotification");
  };

  const activityButtonHandler = () => {
    navigation.navigate("ActivityLevel");
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
        <Text style={styles.Title}>
          {userData.type === "caregivee" ? "CAREGIVER" : "CAREGIVEE"}
        </Text>
      </SafeAreaView>

      <SafeAreaView style={styles.Box2}>
        <SafeAreaView style={[styles.Box]}>
          <Text style={styles.BoxTitle}>Pam</Text>
          {/* TODO: Add and implement caregivee info here */}
          <Text style={styles.BoxSub}>PamWisniewski@gmail.com</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.Box}>
          <Text style={styles.BoxTitle}>Phone</Text>
          <Text style={styles.BoxSub}>(407) 777-7777</Text>
        </SafeAreaView>
      </SafeAreaView>

      <SafeAreaView style={[styles.TitleContainer]}>
        {userData.type === "caregiver" ? (
          <SafeAreaView>
            <Text style={styles.Title}>PHYSICIAN INFO</Text>
          </SafeAreaView>
        ) : null}
      </SafeAreaView>
      {userData.type === "caregiver" ? (
        <SafeAreaView style={styles.Box2}>
          <SafeAreaView style={[styles.Box]}>
            <Text style={styles.BoxTitle}>Dr. Pam</Text>
            {/* TODO: Add and implement caregivee info here */}
            <Text style={styles.BoxSub}>DrDoctor@gmail.com</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.Box}>
            <Text style={styles.BoxTitle}>Phone</Text>
            <Text style={styles.BoxSub}>(407) 777-7777</Text>
          </SafeAreaView>
        </SafeAreaView>
      ) : null}

      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>ALERTS</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box2}>
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
            <Text style={styles.BoxSub}>Off</Text>
            <Image
              style={{ height: 15, width: 15, marginLeft: "1%" }}
              source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
            />
          </TouchableOpacity>
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
            Delete {userData.type === "caregivee" ? "Caregiver" : "Caregivee"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Box: {
    height: "50%",
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
  Box2: {
    height: "14%",
    width: "100%",
    backgroundColor: "white",
  },
  Title: {
    fontSize: responsiveFontSize(1.9),
    color: "gray",
    fontWeight: "500",
  },
  TitleContainer: {
    width: "100%",
    justifyContent: "center",
    height: "5%",
    marginVertical: "1%",
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
