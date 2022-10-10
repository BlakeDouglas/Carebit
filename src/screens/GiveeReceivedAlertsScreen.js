import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import React, { useState } from "react";
import Modal from "react-native-modal";

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

export default function GiveeReceivedAlertsScreen({ navigation }) {
  const [isModal1Visible, setModal1Visible] = useState(false);
  const toggleModal1 = () => {
    console.log(isModal1Visible);
    setModal1Visible(!isModal1Visible);
  };

  const Item = ({ alertType, dateTime, body, title, ok }) => (
    <SafeAreaView
      style={{
        justifyContent: "center",
      }}
    >
      <Modal
        isVisible={isModal1Visible}
        backdropOpacity={0.2}
        useNativeDriverForBackdrop={true}
        halertIDeModalContentWhileAnimating={true}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View
          style={{
            alignSelf: "center",
            height: "31%",
            width: "75%",
            backgroundColor: "white",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              width: "90%",
              height: "60%",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2.2),
              }}
            >
              Mark You're Okay
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "400",
                textAlign: "left",
              }}
            >
              Would you like to mark that you're okay? Note that your Caregiver
              will see this as well
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              height: "40%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWalertIDth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  console.log("Okay Pressed");
                  toggleModal1();
                  //Set that they're okay and send it to the Giver's screen
                }}
              >
                <Text
                  style={{
                    color: "rgba(0,225,200,.8)",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Yes, I'm Okay
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "rgba(128, 128, 128, .2)",
                borderTopWalertIDth: 1,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  toggleModal1();
                  console.log("Cancel Pressed");
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: responsiveFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </Modal>
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
            width: "62%",
            //backgroundColor: "blue",
            marginVertical: "5%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: responsiveFontSize(2.4), fontWeight: "600" }}
          >
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
          {ok === 0 ? (
            <TouchableOpacity
              style={{
                marginTop: "10%",
                borderColor: "lightblue",
                borderWidth: 1,
                borderRadius: 5,
              }}
              onPress={() => {
                toggleModal1();
                console.log("Okay Pressed");
              }}
            >
              <Text
                style={{
                  color: "rgba(0,225,200,.6)",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "2%",
                  fontSize: responsiveFontSize(2.3),
                }}
              >
                Okay?
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                marginTop: "10%",
                borderColor: "lightblue",
                borderWidth: 1,
                borderRadius: 5,
                //width: "20%",
              }}
              onPress={() => {
                toggleModal1();
                console.log("Okay Pressed");
              }}
            >
              <Text
                style={{
                  color: "rgba(0,225,200,.6)",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "2%",
                  fontSize: responsiveFontSize(2.3),
                }}
              >
                {""} Okay {""}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={{ color: "grey", marginTop: "14%" }}>{dateTime}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
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
