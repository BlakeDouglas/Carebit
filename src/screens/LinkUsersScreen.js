import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import CustomTextInput from "../utils/CustomTextInput";
import React, { useEffect, useState, useCallback } from "react";
import GlobalStyle from "../utils/GlobalStyle";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";
import { discovery } from "./AuthenticationScreen";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { setTokenData } from "../redux/actions";

export default function LinkUsersScreen({ navigation }) {
  const handleChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const [inputs, setInputs] = useState({
    phone: "",
  });
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const [errors, setErrors] = useState({});
  const tokenData = useSelector((state) => state.Reducers.tokenData);
  const dispatch = useDispatch();
  const typeOfRequester =
    tokenData.type === "caregivee" ? "caregiver" : "caregivee";

  const createButtonAlert = () =>
    Alert.alert(
      "Warning",
      "You will need to sign into your caregivee's Fitbit device.\nOnly continue if you know their Fitbit credentials.",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: promptAsync,
        },
      ]
    );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "238QS3",
      scopes: [
        "activity",
        "heartrate",
        "location",
        "nutrition",
        "profile",
        "settings",
        "sleep",
        "social",
        "weight",
        "oxygen_saturation",
        "respiratory_rate",
        "temperature",
      ],
      redirectUri: makeRedirectUri({
        scheme: "carebit",
        path: "callback",
      }),

      usePKCE: false,
      extraParams: { prompt: "login" },
    },
    discovery
  );

  const makeRequest = async () => {
    if (!tokenData.phone || !inputs.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? { caregiveePhone: tokenData.phone, caregiverPhone: inputs.phone }
        : { caregiverPhone: tokenData.phone, caregiveePhone: inputs.phone };
    try {
      const response = await fetch("https://www.carebit.xyz/createRequest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      console.log(json);
      if (json.request)
        dispatch(setTokenData({ ...tokenData, caregiveeID: [json.request] }));

      getRequests(tokenData);
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };

  /* Shouldn't be necessary. Fetches 
  const getRequests = async (tokenData) => {
    if (!tokenData.type) return;
    const body =
      tokenData.type === "caregivee"
        ? { caregiveeID: tokenData.caregiveeID, caregiverID: null }
        : { caregiverID: tokenData.caregiverID, caregiveeID: null };
    try {
      const response = await fetch("https://www.carebit.xyz/getRequests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      dispatch(
        setTokenData({ ...tokenData, caregiveeID: [json.connections[0]] })
      );
    } catch (error) {
      console.log("Caught error: " + error);
    }
  };
  */

  React.useEffect(() => {
    if (response?.type === "success") {
      navigation.navigate("ModifiedCaregiveeAccountCreation", {
        caregiverToken: tokenData,
        code: response.params.code,
      });
    }
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/images/background-hearts.imageset/background03.png")} // Edit me if you find a better image~!
      resizeMode="cover"
      style={GlobalStyle.Background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} translucent={true} backgroundColor="black" />

        <SafeAreaView style={[GlobalStyle.Container, { marginTop: "20%" }]}>
          <Text
            style={[
              GlobalStyle.Subtitle,
              { fontSize: responsiveFontSize(5.3) },
            ]}
          >
            Connect to a Caregivee
          </Text>
          <SafeAreaView
            style={{
              height: "75%",
              width: "100%",
              marginTop: "10%",
              justifyContent: "center",

              //backgroundColor: "green",
            }}
          >
            <SafeAreaView
              style={{
                height: "50%",
                width: "100%",
                alignSelf: "center",
                //backgroundColor: "blue",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  GlobalStyle.Text,
                  { fontSize: responsiveFontSize(2.3) },
                ]}
              >
                Request a Caregivee for monitoring {"\n"}(recommended method)
              </Text>
              <SafeAreaView
                style={{
                  alignSelf: "center",
                  width: "100%",
                  //backgroundColor: "blue",
                  justifyContent: "center",
                  marginTop: "5%",
                }}
              >
                <CustomTextInput
                  label={
                    typeOfRequester === "caregivee"
                      ? "Caregivee's Phone Number"
                      : "Caregiver's Phone Number"
                  }
                  placeholder="(XXX) XXX-XXXX"
                  iconName="phone-outline"
                  keyboardType="number-pad"
                  error={errors.phone}
                  onChangeText={(text) =>
                    handleChange(text.replace(/[^0-9]+/g, ""), "phone")
                  }
                  onFocus={() => {
                    handleError(null, "phone");
                  }}
                />
              </SafeAreaView>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "5%" }]}
                onPress={() => {
                  makeRequest();
                }}
              >
                <Text style={GlobalStyle.ButtonText}>Send Request</Text>
              </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
              style={{ flex: 1, marginTop: "20%", alignItems: "center" }}
            >
              <Text
                style={[
                  GlobalStyle.Text,
                  { fontSize: responsiveFontSize(2.3) },
                ]}
              >
                Proceed without your Caregivee using the app
              </Text>
              <TouchableOpacity
                style={[GlobalStyle.Button, { marginTop: "8%" }]}
                onPress={createButtonAlert}
              >
                <Text style={GlobalStyle.ButtonText}>Opt Out</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
}
