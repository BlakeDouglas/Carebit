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
  FlatList,
} from "react-native";
import moment from "moment";
import { responsiveFontSize } from "react-native-responsive-dimensions";
//const selectedUser = useSelector((state) => state.Reducers.selectedUser);
import { useSelector } from "react-redux";

const data_temp = [
  {
    alertType: "StepsHigh",
    dateTime: "12:50pm",
    title: "Too Many Steps",
    body: "Name has taken more than 865 steps in the past hour",
    caregiveeID: "BH32L",
    alertID: "1",
    ok: 1,
  },
  {
    alertType: "StepsNone",
    dateTime: "1:15am",
    title: "No Steps",
    body: "Name has gone more than x hour(s) without steps",
    total: "0",
    alertID: "2",
    ok: 0,
  },
  {
    alertType: "HeartNone",
    dateTime: "1:18am",
    title: "Heart Rate Not Recorded",
    body: "Name's heart rate hasn't been recorded for over 8 hour(s)",
    total: "0",
    alertID: "3",
    ok: 0,
  },
  {
    alertType: "HeartHigh",
    dateTime: "10:16am",
    title: "High Heart Rate",
    body: "Name's heart rate was 162",
    total: "162",
    alertID: "4",
    ok: 0,
  },
  {
    alertType: "StepsHigh",
    dateTime: "12:50pm",
    title: "Too Many Steps",
    body: "Name has taken more than 865 steps in the past hour",
    total: "865",
    alertID: "5",
    ok: 0,
  },
  {
    alertType: "StepsNone",
    dateTime: "1:15am",
    title: "No Steps",
    body: "Name has gone more than x hour(s) without steps",
    total: "0",
    alertID: "6",
    ok: 1,
  },
  {
    alertType: "HeartNone",
    dateTime: "8:16am",
    title: "Heart Rate Not Recorded",
    body: "Name's heart rate hasn't been recorded for over 8 hour(s)",
    total: "8",
    alertID: "7",
    ok: 0,
  },
  {
    alertType: "HeartLow",
    dateTime: "10:16am",
    title: "Low Heart Rate",
    body: "Name's heart rate was 62",
    total: "62",
    alertID: "8",
    ok: 0,
  },
];

const Item = ({ alertType, dateTime, body, title, ok }) => (
  <SafeAreaView
    style={{
      marginVertical: "1%",
      flexDirection: "row",
      alignItems: "center",
      //backgroundColor: "red",
    }}
  >
    {alertType === "StepsHigh" && (
      <Image
        style={styles.images}
        source={require("../../assets/images/icons-alert-steps-high.imageset/icons-alert-steps-high.png")}
      />
    )}
    {alertType === "StepsNone" && (
      <Image
        style={styles.images}
        source={require("../../assets/images/icons-alert-steps-none.imageset/icons-alert-steps-none.png")}
      />
    )}
    {alertType === "HeartHigh" && (
      <Image
        style={styles.images}
        source={require("../../assets/images/icons-alert-heart-high.imageset/icons-alert-heart-high.png")}
      />
    )}
    {alertType === "HeartLow" && (
      <Image
        style={styles.images}
        source={require("../../assets/images/icons-alert-heart-low.imageset/icons-alert-heart-low.png")}
      />
    )}
    {alertType === "HeartNone" && (
      <Image
        style={styles.images}
        source={require("../../assets/images/icons-alert-heart-none.imageset/icons-alert-heart-none.png")}
      />
    )}
    <SafeAreaView
      style={{
        marginLeft: "3%",
        //height: "100%",
        width: "58%",
        //backgroundColor: "blue",
        marginVertical: "5%",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: responsiveFontSize(2.4), fontWeight: "600" }}>
        {title}
      </Text>
      <Text
        style={{
          marginTop: "1%",
          fontSize: responsiveFontSize(1.8),
          color: "gray",
        }}
        numberOfLines={2}
      >
        {body}
      </Text>
    </SafeAreaView>
    <SafeAreaView
      style={{
        marginLeft: "1%",
        marginRight: "3%",
        // backgroundColor: "red",
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          color: "rgba(0,225,200,.6)",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: responsiveFontSize(2.3),
          marginTop: "10%",
        }}
      >
        OKAY
      </Text>
      <Text style={{ color: "grey", marginTop: "14%" }}>{dateTime}</Text>
    </SafeAreaView>
  </SafeAreaView>
);

export default function ReceivedAlertsScreen({ navigation }) {
  //const [data, setData] = useState([]);
  const tokenData = useSelector((state) => state.Reducers.tokenData);

  const getAlerts = async () => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/alerts/" + tokenData.caregiveeID,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      if (json) {
        console.log(json.alerts);
      }
    } catch (error) {
      console.log(
        "Caught error from /alerts/<caregiveeID> in ReceivedAlerts: " + error
      );
    }
  };

  const renderItem = ({ item }) => (
    <Item
      alertType={item.alertType}
      dateTime={item.dateTime}
      body={item.body}
      title={item.title}
      ok={item.ok}
    />
  );
  return (
    <SafeAreaView
      style={{
        alignSelf: "flex-end",
        height: "100%",
        width: "97%",
        //backgroundColor: "green",
      }}
    >
      <SafeAreaView
        style={{
          width: "100%",
          alignSelf: "center",
          height: "7%",
          //backgroundColor: "yellow",
          justifyContent: "flex-end",
          marginBottom: "6%",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.5), fontWeight: "600" }}>
          Today
        </Text>
      </SafeAreaView>
      <FlatList
        data={data_temp}
        renderItem={renderItem}
        keyExtractor={(item) => item.alertID}
        //backgroundColor="blue"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  images: {
    height: 50,
    width: 50,
  },
});
