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
import { setSelectedUser } from "../redux/actions";
import { setActivityEndpoint } from "../network/CarebitAPI";
import { moderateScale } from "react-native-size-matters";
export default function ActivityLevelScreen({ navigation, route }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();

  const setActivity = async (level) => {
    const params = {
      targetID: selectedUser.caregiveeID,
      selfID: tokenData.caregiverID,
      level: level,
      auth: tokenData.access_token,
    };
    const responseText = await setActivityEndpoint(params);
    if (!responseText) {
      dispatch(setSelectedUser({ ...selectedUser, healthProfile: level }));
      navigation.goBack();
    } else console.log("Error setting activity level");
  };
  let doesSelectedUserExist = selectedUser.email !== "";
  const { fontScale } = useWindowDimensions();
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode={"cover"}
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        {!doesSelectedUserExist && (
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
                  { fontSize: moderateScale(49) / fontScale },
                ]}
              >
                Activity Level
              </Text>

              <SafeAreaView
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginTop: "40%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(3) / fontScale,
                  }}
                >
                  Please Choose a Caregivee First
                </Text>
                <TouchableOpacity
                  style={[GlobalStyle.Button, { marginTop: "20%" }]}
                  onPress={() => {
                    navigation.navigate("ListOfFriendsScreen");
                  }}
                >
                  <Text
                    style={[
                      GlobalStyle.ButtonText,
                      { fontSize: moderateScale(19) / fontScale },
                    ]}
                  >
                    Select Caregivee
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        )}
        {doesSelectedUserExist && (
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
                  { fontSize: moderateScale(49) / fontScale },
                ]}
              >
                Activity Level
              </Text>

              <SafeAreaView style={styles.TextBox}>
                <Text
                  style={[
                    styles.DescriptiveText,
                    { fontSize: moderateScale(17) / fontScale },
                  ]}
                >
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
                    setActivity(1);
                  }}
                >
                  <SafeAreaView>
                    <Text
                      style={[
                        styles.InnerTitle,
                        { fontSize: moderateScale(18.5) / fontScale },
                      ]}
                    >
                      Active
                    </Text>
                    <Text
                      style={[
                        styles.InnerText,
                        { fontSize: moderateScale(17) / fontScale },
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
                        { fontSize: moderateScale(18.5) / fontScale },
                      ]}
                    >
                      Sedentary
                    </Text>
                    <Text
                      style={[
                        styles.InnerText,
                        { fontSize: moderateScale(17) / fontScale },
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
                        { fontSize: moderateScale(18.5) / fontScale },
                      ]}
                    >
                      Homebound
                    </Text>
                    <Text
                      style={[
                        styles.InnerText,
                        { fontSize: moderateScale(17) / fontScale },
                      ]}
                    >
                      Unable able to leave home
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
        )}
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
    fontSize: moderateScale(17),
    color: "white",
  },
  InnerContainers: {
    flexDirection: "row",
    marginTop: "7%",
    backgroundColor: "rgba(218, 223, 225, 1)",
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
    fontSize: moderateScale(18.5),
  },
  InnerText: {
    marginLeft: "6%",
    marginTop: "2%",
    color: "darkgray",
    fontWeight: "400",
    fontSize: moderateScale(17),
  },
});
