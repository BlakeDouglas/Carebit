import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { setTokenData } from "../redux/actions";
import {
  setActivityEndpoint,
  setDefaultActivityEndpoint,
} from "../network/CarebitAPI";
export default function ModifiedActivityScreen({ navigation }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const { fontScale } = useWindowDimensions();
  const setActivity = async (level) => {
    let params = { level: level, auth: tokenData.access_token };
    let responseText;

    // In case we're going through the opt-out feature, authPhase = 5
    if (tokenData.authPhase === 5) {
      params.targetID = tokenData.optedUser.caregiveeID;
      params.selfID = tokenData.caregiverID;
      responseText = await setActivityEndpoint(params);
    }
    // Account creation, caregivee edition, authPhase = 8, will be set to 9 after calling /updateHealthProfile
    else {
      params.body = {
        caregiveeID: tokenData.caregiveeID,
        healthProfile: level.toString(),
      };
      responseText = await setDefaultActivityEndpoint(params);
    }
    if (!responseText) {
      // Send to 2 (giverhome) for opt-out, and 9 (giveehome) for normal givee account creation
      const newPhase = tokenData.authPhase === 5 ? 2 : 9;
      dispatch(
        setTokenData({
          ...tokenData,
          authPhase: newPhase,
        })
      );
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
            <Text
              style={[
                GlobalStyle.Subtitle,
                { fontSize: responsiveFontSize(6.3) / fontScale },
              ]}
            >
              Activity Level
            </Text>

            <SafeAreaView style={styles.TextBox}>
              <Text
                style={[
                  styles.DescriptiveText,
                  { fontSize: responsiveFontSize(2.2) / fontScale },
                ]}
              >
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
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: responsiveFontSize(2.4) / fontScale },
                    ]}
                  >
                    Active
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: responsiveFontSize(2.2) / fontScale },
                    ]}
                  >
                    Living an active life
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
                  setActivity(2);
                }}
              >
                <SafeAreaView>
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: responsiveFontSize(2.4) / fontScale },
                    ]}
                  >
                    Sedentary
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: responsiveFontSize(2.2) / fontScale },
                    ]}
                  >
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
                  <Text
                    style={[
                      styles.InnerTitle,
                      { fontSize: responsiveFontSize(2.4) / fontScale },
                    ]}
                  >
                    Homebound
                  </Text>
                  <Text
                    style={[
                      styles.InnerText,
                      { fontSize: responsiveFontSize(2.2) / fontScale },
                    ]}
                  >
                    Unable to leave home
                  </Text>
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
