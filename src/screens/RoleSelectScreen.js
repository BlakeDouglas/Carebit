import {
  StatusBar,
  SafeAreaView,
  Text,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";
import { setTokenData } from "../redux/actions";
import { moderateScale } from "react-native-size-matters";

export default function RoleSelectScreen({ navigation }) {
  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const caregiverCreateAccountButtonHandler = () => {
    dispatch(setTokenData({ ...tokenData, type: "caregiver" }));
    navigation.navigate("AccountCreationScreen");
  };
  const { fontScale } = useWindowDimensions();

  const caregiveeCreateAccountButtonHandler = () => {
    dispatch(setTokenData({ ...tokenData, type: "caregivee" }));
    navigation.navigate("AccountCreationScreen");
  };
  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background02.png")}
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />
        <SafeAreaView style={GlobalStyle.Container}>
          <Text
            style={[
              GlobalStyle.Subtitle,
              { fontSize: moderateScale(49) / fontScale },
            ]}
          >
            Choose Your
          </Text>
          <Text
            style={[
              GlobalStyle.Title,
              { fontSize: moderateScale(54) / fontScale },
            ]}
          >
            Role
          </Text>
          <SafeAreaView
            style={{
              height: "25%",
              width: "100%",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <Text
              style={[
                GlobalStyle.Text,
                { fontSize: moderateScale(19.3) / fontScale },
              ]}
            >
              To create your account, let us know if you're giving care or are
              being cared for
            </Text>
          </SafeAreaView>
          <TouchableOpacity
            style={[GlobalStyle.Button, { marginBottom: "4%" }]}
            onPress={caregiverCreateAccountButtonHandler}
          >
            <Text
              style={[
                GlobalStyle.ButtonText,
                { fontSize: moderateScale(19.4) / fontScale },
              ]}
            >
              I'm Caregiving
            </Text>
          </TouchableOpacity>
          <Text />
          <TouchableOpacity
            style={GlobalStyle.Button}
            onPress={caregiveeCreateAccountButtonHandler}
          >
            <Text
              style={[
                GlobalStyle.ButtonText,
                { fontSize: moderateScale(19.4) / fontScale },
              ]}
            >
              I'm Receiving Care
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
