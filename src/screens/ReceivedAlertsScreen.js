import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  StatusBar,
  Platform,
  View,
  Image,
} from "react-native";
import moment from "moment";
import { responsiveFontSize } from "react-native-responsive-dimensions";
//const selectedUser = useSelector((state) => state.Reducers.selectedUser);
import { useSelector } from "react-redux";
export default function ReceivedAlertsScreen({ navigation }) {
  return (
    <SafeAreaView style={{ height: "100%", width: "100%" }}>
      <SafeAreaView
        style={{
          width: "100%",
          height: "8%",
          marginLeft: "4%",
          //backgroundColor: "blue",
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: "600" }}>
          Today
        </Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          flexDirection: "row",
          //backgroundColor: "blue",
          height: "15%",
          width: "96%",
          marginLeft: "4%",
          marginTop: "2%",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-steps-high.imageset/icons-alert-steps-high.png")}
        />

        <SafeAreaView
          style={{
            marginLeft: "3%",
            height: "100%",
            width: "62%",
            //backgroundColor: "blue",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: responsiveFontSize(2.4), fontWeight: "600" }}
          >
            Too Many Steps
          </Text>
          <Text
            style={{
              marginTop: "1%",
              fontSize: responsiveFontSize(1.8),
              color: "gray",
            }}
            numberOfLines={2}
          >
            Name has taken more than x steps in the past hour
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            height: "100%",
            marginLeft: "1%",
            width: "17%",
            marginRight: "3%",
            //backgroundColor: "red",
            justifyContent: "space-evenly",
          }}
        >
          <Text
            style={{
              color: "rgba(0,225,200,.6)",
              fontWeight: "bold",
              textAlign: "right",
              fontSize: responsiveFontSize(2.3),
            }}
          >
            OKAY
          </Text>
          <Text style={{ color: "grey" }}>{moment().format("hh:mm A")}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  images: {
    height: 50,
    width: 50,
  },
});
