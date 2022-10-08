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
    type: "StepsHigh",
    time: "12:50pm",
    total: "865",
    id: "1",
  },
  {
    type: "StepsNone",
    time: "1:15am",
    total: "0",
    id: "2",
  },
  {
    type: "HeartNone",
    time: "8:16am",
    total: "8",
    id: "3",
  },
  {
    type: "HeartHigh",
    time: "10:16am",
    total: "162",
    id: "4",
  },
  {
    type: "StepsHigh",
    time: "12:50pm",
    total: "865",
    id: "5",
  },
  {
    type: "StepsNone",
    time: "1:15am",
    total: "0",
    id: "6",
  },
  {
    type: "HeartNone",
    time: "8:16am",
    total: "8",
    id: "7",
  },
  {
    type: "HeartLow",
    time: "10:16am",
    total: "62",
    id: "8",
  },
];

const Item = ({ type, time, total }) => (
  <SafeAreaView
    style={{
      justifyContent: "center",
      //marginVertical: ".2%",
      //backgroundColor: "blue",
    }}
  >
    <SafeAreaView
      style={{
        marginVertical: "1%",
        flexDirection: "row",
        alignItems: "center",
        //backgroundColor: "red",
      }}
    >
      {type === "StepsHigh" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-steps-high.imageset/icons-alert-steps-high.png")}
        />
      )}
      {type === "StepsNone" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-steps-none.imageset/icons-alert-steps-none.png")}
        />
      )}
      {type === "HeartHigh" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-high.imageset/icons-alert-heart-high.png")}
        />
      )}
      {type === "HeartLow" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-low.imageset/icons-alert-heart-low.png")}
        />
      )}
      {type === "HeartNone" && (
        <Image
          style={styles.images}
          source={require("../../assets/images/icons-alert-heart-none.imageset/icons-alert-heart-none.png")}
        />
      )}
      <SafeAreaView
        style={{
          marginLeft: "3%",
          //height: "100%",
          width: "62%",
          //backgroundColor: "blue",
          marginVertical: "5%",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2.4), fontWeight: "600" }}>
          {type === "StepsHigh"
            ? "Too Many Steps"
            : type === "StepsNone"
            ? "No Steps"
            : type === "HeartHigh"
            ? "High Heart Rate"
            : type === "HeartLow"
            ? "Low Heart Rate"
            : type === "HeartNone"
            ? "Heart Rate Not Recorded"
            : null}
        </Text>
        <Text
          style={{
            marginTop: "1%",
            fontSize: responsiveFontSize(1.8),
            color: "gray",
          }}
          numberOfLines={2}
        >
          {type === "StepsHigh"
            ? "Name has taken more than " + total + " steps in the past hour"
            : type === "StepsNone"
            ? "Name has gone more than x hour(s) without steps"
            : type === "HeartHigh"
            ? "Name's heart rate was " + total
            : type === "HeartLow"
            ? "Name's heart rate was " + total
            : type === "HeartNone"
            ? "Name's heart rate hasn't been recorded for over " +
              total +
              " hour(s)"
            : null}
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
        <Text style={{ color: "grey", marginTop: "14%" }}>{time}</Text>
      </SafeAreaView>
    </SafeAreaView>
  </SafeAreaView>
);

export default function ReceivedAlertsScreen({ navigation }) {
  //const [data, setData] = useState([]);

  const renderItem = ({ item }) => (
    <Item type={item.type} time={item.time} total={item.total} />
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
        keyExtractor={(item) => item.id}
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
