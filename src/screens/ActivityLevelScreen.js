import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setTokenData } from "../redux/actions";
export default function AccountCreationScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();

  const setActivity = async (tokenData, level) => {
    if (!selectedUser) {
      console.log("Couldn't set activity level");
      return;
    }
    try {
      const response = await fetch(
        "https://www.carebit.xyz/activity/" +
          selectedUser.caregiveeID +
          "/" +
          level,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const responseText = await response.text();
      if (!responseText)
        console.log("Successfylly set activity level to " + level);
      else {
        console.log("Error setting activity level");
        return;
      }
      var tempTokenData = tokenData;
      tempTokenData.caregiveeID[tempTokenData.selected].healthProfile = level;
      dispatch(setSelectedUser({ ...selectedUser, healthProfile: level }));
      dispatch(setTokenData(tempTokenData));
      console.log(selectedUser);
      navigation.goBack();
    } catch (error) {
      console.log("Caught error in /activity: " + error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")} // Edit me if you find a better image~!
      resizeMode={"cover"}
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />

        <SafeAreaView
          style={[
            GlobalStyle.Container,
            { marginLeft: "10%", marginRight: "10%" },
          ]}
        >
          <Text style={GlobalStyle.Subtitle}>Activity Level</Text>
          <SafeAreaView style={styles.TextBox}>
            <Text style={styles.DescriptiveText}>
              Choose the usual level of activity for your Caregivee
            </Text>
          </SafeAreaView>
          <SafeAreaView
            style={{
              width: "100%",
              height: "80%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.InnerContainers}
              onPress={() => {
                setActivity(tokenData, 3);
              }}
            >
              <SafeAreaView>
                <Text style={styles.InnerTitle}>Active</Text>
                <Text style={styles.InnerText}>Living an active life</Text>
              </SafeAreaView>
              <Image
                style={{ height: 15, width: 15, marginRight: "5%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.InnerContainers}
              onPress={() => {
                setActivity(tokenData, 2);
              }}
            >
              <SafeAreaView>
                <Text style={styles.InnerTitle}>Sedentary</Text>
                <Text style={styles.InnerText}>
                  Not active, but not homebound
                </Text>
              </SafeAreaView>
              <Image
                style={{ height: 15, width: 15, marginRight: "5%" }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.InnerContainers}
              onPress={() => {
                setActivity(tokenData, 1);
              }}
            >
              <SafeAreaView>
                <Text style={styles.InnerTitle}>Homebound</Text>
                <Text style={styles.InnerText}>Unable able to leave home</Text>
              </SafeAreaView>

              <Image
                style={{
                  height: 15,
                  width: 15,
                  marginRight: "5%",
                }}
                source={require("../../assets/images/icons-forward-light.imageset/grayArrow.png")}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  TextBox: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  DescriptiveText: {
    fontSize: responsiveFontSize(2.2),
    color: "white",
  },
  InnerContainers: {
    flexDirection: "row",
    marginTop: "7%",
    backgroundColor: "white",
    height: "15%",
    width: "100%",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
      },
      android: {
        elevation: 4,
      },
    }),
    justifyContent: "space-between",
    alignItems: "center",
  },
  InnerTitle: {
    marginLeft: "6%",
    color: "black",
    fontWeight: "600",
    fontSize: responsiveFontSize(2.4),
  },
  InnerText: {
    marginLeft: "6%",
    marginTop: "2%",
    color: "darkgray",
    fontWeight: "400",
    fontSize: responsiveFontSize(2.2),
  },
});
