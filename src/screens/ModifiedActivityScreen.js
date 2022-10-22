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
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { setTokenData } from "../redux/actions";
import {
  setActivityEndpoint,
  setDefaultActivityEndpoint,
} from "../network/CarebitAPI";
export default function ModifiedActivityScreen({ navigation, route }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();

  const setActivity = async (level) => {
    let params = { level: level, auth: tokenData.access_token };
    let responseText;

    // In case we're going through the opt-out feature
    if (route.params) {
      params.targetID = route.params.caregiveeID;
      params.selfID = tokenData.caregiverID;
      responseText = await setActivityEndpoint(params);
    }
    // TODO: Ensure the [0] part of this part
    // Account creation, caregiver edition
    else if (tokenData.type === "caregiver") {
      params.targetID = tokenData.caregiveeID[0];
      params.selfID = tokenData.caregiverID;
      responseText = await setActivityEndpoint(params);
    }
    // Account creation, caregivee edition`
    else {
      params = {
        auth: tokenData.access_token,
        body: {
          caregiveeID: tokenData.caregiveeID,
          healthProfile: level.toString(),
        },
      };
      responseText = await setDefaultActivityEndpoint(params);
    }
    if (!responseText) {
      // Sets caregiveeID to send to home screen
      if (tokenData.type === "caregiver") {
        dispatch(
          setTokenData({
            ...tokenData,
            caregiveeID: [],
          })
        );
      }
      // Sets healthProfile to send to home screen
      else {
        dispatch(
          setTokenData({
            ...tokenData,
            healthProfile: level,
          })
        );
      }
    } else console.log("Error setting activity level: ", responseText);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode={"cover"}
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />

        <SafeAreaView style={{ flex: 1 }}>
          <SafeAreaView
            style={[
              GlobalStyle.Container,
              { marginLeft: "10%", marginRight: "10%" },
            ]}
          >
            <Text style={GlobalStyle.Subtitle}>Activity Level</Text>

            <SafeAreaView style={styles.TextBox}>
              <Text style={styles.DescriptiveText}>
                Choose the usual level of activity for this account
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
                  setActivity(1);
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
                  setActivity(2);
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
                  setActivity(3);
                }}
              >
                <SafeAreaView>
                  <Text style={styles.InnerTitle}>Homebound</Text>
                  <Text style={styles.InnerText}>Unable to leave home</Text>
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
