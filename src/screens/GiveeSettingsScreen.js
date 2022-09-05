import {
  StyleSheet,
  SafeAreaView,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { React } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { Provider, useSelector } from "react-redux";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function ChatScreen({ navigation }) {
  const userData = useSelector((state) => state.Reducers.userData);
  console.log(userData.firstName);
  const logOutButtonHandler = () => {
    navigation.navigate("TitleScreen");
  };
  return (
    // Header Container
    <SafeAreaView style={{ flex: 1 }}>
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
            {userData.firstName}
          </Text>
          <Text style={{ fontSize: responsiveFontSize(2.1) }}>
            pamelawisniewski@gmail.com
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>CAREGIVER</Text>
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Mamtaj</Text>
        <Text style={styles.BoxSub}>MamtajAkter@gmail.com</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>(407) 777-7777</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.TitleContainer}>
        <Text style={styles.Title}>PHYSICIAN INFO</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Dr. Doctor</Text>
        <Text style={styles.BoxSub}>RealDoctor@gmail.com</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.Box}>
        <Text style={styles.BoxTitle}>Phone</Text>
        <Text style={styles.BoxSub}>(407) 894-5656</Text>
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
