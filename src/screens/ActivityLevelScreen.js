import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  Platform,
  StatusBar,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import GlobalStyle from "../utils/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/actions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function AccountCreationScreen({ navigation, route }) {
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const selectedUser = useSelector((state) => state.Reducers.selectedUser);
  const dispatch = useDispatch();
  const fontScale = useWindowDimensions();
  const setActivity = async (level) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/activity/" +
          selectedUser.caregiveeID +
          "/" +
          level +
          "/" +
          tokenData.caregiverID,
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
      if (!responseText) {
        dispatch(setSelectedUser({ ...selectedUser, healthProfile: level }));
        navigation.goBack();
      } else console.log("Error setting activity level");
    } catch (error) {
      console.log("Caught error in /activity: " + error);
    }
  };
  let doesSelectedUserExist = selectedUser.email !== "";
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
              <Text style={GlobalStyle.Subtitle}>Activity Level</Text>

              <SafeAreaView
                style={{
                  flex: 1,
                  //backgroundColor: "blue",
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
                  <Text style={GlobalStyle.ButtonText}>Select Caregivee</Text>
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
                    setActivity(1);
                  }}
                >
                  <SafeAreaView>
                    <Text style={styles.InnerTitle}>Active</Text>
                    <Text style={styles.InnerText}>Living an active life</Text>
                  </SafeAreaView>
                  <Image
                    style={{
                      height: verticalScale(15),
                      width: scale(15),
                      marginRight: "5%",
                    }}
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
                    style={{
                      height: verticalScale(15),
                      width: scale(15),
                      marginRight: "5%",
                    }}
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
                    <Text style={styles.InnerText}>
                      Unable able to leave home
                    </Text>
                  </SafeAreaView>

                  <Image
                    style={{
                      height: verticalScale(15),
                      width: scale(15),
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
    fontSize: responsiveFontSize(2.2) / fontScale,
    color: "white",
  },
  InnerContainers: {
    flexDirection: "row",
    marginTop: "7%",
    backgroundColor: "white",
    height: "15%",
    width: "100%",
    borderRadius: moderateScale(8),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: scale(1), height: verticalScale(3) },
        shadowOpacity: moderateScale(0.4),
      },
      android: {
        elevation: moderateScale(4),
      },
    }),
    justifyContent: "space-between",
    alignItems: "center",
  },
  InnerTitle: {
    marginLeft: "6%",
    color: "black",
    fontWeight: "600",
    fontSize: responsiveFontSize(2.4) / fontScale,
  },
  InnerText: {
    marginLeft: "6%",
    marginTop: "2%",
    color: "darkgray",
    fontWeight: "400",
    fontSize: responsiveFontSize(2.2) / fontScale,
  },
});
