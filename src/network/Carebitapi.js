import { resetSelectedData, setSelectedUser, setTokenData } from "../redux/actions";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";


  export const login = async (email, password) => {
    const body = JSON.stringify({ email, password });
    try {
      let response = await fetch("https://www.carebit.xyz/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      });
      const json = await response.json();
      return json
      
    } catch (error) {
      console.log("Caught error in /login: " + error);
    }
  };

  export const deleteConnection = async (tokenData, rejectID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/deleteRequest/" + rejectID,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      return json; 
    } catch (error) {
      console.log("Caught error in /deleteRequest: " + error);
    }
  };

  export const rejectRequest = async (tokenData, rejectID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/deleteRequest/" + rejectID,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      );
      const json = await response.json();
      console.log("Result from delete: " + JSON.stringify(json));
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.log("Caught error in /deleteRequest: " + error);
    }
  };

  


  
  export const updateConnections = async (tokenData) => {
    try {
      const response = await fetch("https://www.carebit.xyz/getRequests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify({
          caregiverID: tokenData.caregiverID,
          caregiveeID: null,
        }),
      });
      const json = await response.json();
      return json;
    
    } catch (error) {
      console.log("Caught error in /getRequests: " + error);
    }
  };


  export const registerPhysician = async (inputs, tokenData) => {
    try {
      let response = await fetch("https://www.carebit.xyz/physician", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
        body: JSON.stringify({
          ...inputs,
          caregiveeID: tokenData.caregiveeID,
        }),
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log("Caught error in /physician: " + error);
    }
  };

  
  export const registerShellCaregivee = async () => {
    const output = {
      ...inputs,
      type: "caregivee",
      mobilePlatform: "NA",
    };
    try {
      const response = await fetch("https://www.carebit.xyz/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(output),
      });
      const json = await response.json();
      console.log("registerShellCaregivee: " + JSON.stringify(json));
      if (json.access_token) {
        navigation.navigate("ModifiedAuthScreen", { json });
      }
    } catch (error) {
      console.log("Caught error in /user: " + error);
    }
  };

  export const setActivity = async (level, route, tokenData) => {
    const giveeID = route.params
      ? route.params.caregiveeID
      : tokenData.caregiveeID;

    try {
      const response = await fetch(
        "https://www.carebit.xyz/activity/" + giveeID + "/" + level,
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
      return responseText; 
     
    } catch (error) {
      console.log("Caught error in /activity: " + error);
    }
  };

  
  export const makeRequest = async (tokenData, inputs) => {
    if (!tokenData.phone || !inputs.phone) return;
    const body =
      tokenData.type !== "caregiver"
        ? {
            caregiveePhone: tokenData.phone,
            caregiverPhone: inputs.phone,
            sender: tokenData.type,
          }
        : {
            caregiverPhone: tokenData.phone,
            caregiveePhone: inputs.phone,
            sender: tokenData.type,
          };
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
      if (json.error) {
        console.log(json.error);
        // TODO: Prettify these errors.
        if (json.error === "This request already exists") {
          handleError("  Already added", "phone");
        } else {
          handleError("  Not Found", "phone");
        }
      }
      if (json.request)
        dispatch(setTokenData({ ...tokenData, caregiveeID: [json.request] }));

      getRequests(tokenData);
    } catch (error) {
      console.log("Caught error in /createRequest: " + error);
    }
  };

  
  // Stores expo-token-notification in user's database
  export const storeMessageToken = async (token) => {
    try {
      let url =
        "https://www.carebit.xyz/notificationToken/" +
        tokenData.userID +
        "/" +
        token;

      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenData.access_token,
        },
      });
      const json = await response.json();
    } catch (error) {
      console.log("Caught error in /notificationToken: " + error);
    }
  };

  export const refreshFitbitAccessToken = async (caregiveeID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/refreshFitbitToken/" + caregiveeID,
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
      if (json.access_token) setFitbitAccessToken(json.access_token);
      else console.log("Refreshing error: " + json.error);
    } catch (error) {
      console.log("Caught error in /refreshFitbitToken: " + error);
    }
  };
  export const fetchFitbitAccessToken = async (caregiveeID) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/getFitbitToken/" + caregiveeID,
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
      if (!json.error) setFitbitAccessToken(json.fitbitToken);
      else console.log("Error: " + json.error);
    } catch (error) {
      console.log("Caught error in /getFitbitToken: " + error);
    }
  };

  
  export const getCaregiveeInfo = async () => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/caregivee/" + tokenData.caregiveeID,
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
      if (json.caregivee) {
        setCaregivee(json.caregivee);
        setIsEnabledSleep(json.caregivee.sleep === 1);
        setIsEnabledDisturb(json.caregivee.doNotDisturb === 1);
        setIsEnabledMonitor(json.caregivee.monitoring === 1);
      }
    } catch (error) {
      console.log(
        "Caught error downloading from /caregivee/<caregiveeID>: " + error
      );
    }
  };
  export const setCaregiveeInfo = async (newJson, tokenData) => {
    try {
      const response = await fetch(
        "https://www.carebit.xyz/caregivee/" + tokenData.caregiveeID,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: JSON.stringify({
            ...caregivee,
            ...newJson,
            physCity: undefined,
            physName: undefined,
            physPhone: undefined,
            physState: undefined,
            physStreet: undefined,
            physZip: undefined,
            caregiveeID: undefined,
            userID: undefined,
          }),
        }
      );
      const json = await response.json();
      if (json.caregivee) setCaregivee(json.caregivee);
    } catch (error) {
      console.log(
        "Caught error uploading to /caregivee/<caregiveeID>: " + error
      );
    }
  };

  export const thresholdsAPI = async (type, newJson) => {
    if (type === "PUT" && !thresholds) type = "GET";
    if (!newJson) newJson = thresholds;
    try {
      let response = await fetch(
        "https://www.carebit.xyz/thresholds/" + selectedUser.caregiveeID,
        {
          method: type,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenData.access_token,
          },
          body: type === "PUT" ? JSON.stringify(newJson) : undefined,
        }
      );
      const json = await response.json();
      if (json.thresholds) {
        setThresholds(json.thresholds);
        dispatch(setSelectedUser({ ...selectedUser, healthProfile: 4 }));
      }
    } catch (error) {
      console.log("Caught error in /thresholds: " + error);
    }
  };

 export const acceptRequest = async (caregiveeID, caregiverID) => {
    try {
      const response = await fetch("https://www.carebit.xyz/acceptRequest", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + route.params.json.access_token,
        },

        body: JSON.stringify({
          caregiveeID: caregiveeID,
          caregiverID: caregiverID,
        }),
      });
      const json = await response.json();
      return json
      
    } catch (error) {
      console.log("Caught error in /acceptRequest: " + error);
    }
  };

  export const makeCaregivee = async (code, userID) => {
    try {
      const response = await fetch("https://www.carebit.xyz/caregivee/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + route.params.json.access_token,
        },
        body: JSON.stringify({
          userID: userID,
          authCode: code,
        }),
      });
      const json = await response.json();
      return json
      
    } catch (error) {
      console.log("Caught error in /caregivee/create: " + error);
    }
  };

  export const getRequests = async (tokenData) => {
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
      return json;
      
    } catch (error) {
      console.log("Caught error in /getRequests: " + error);
    }
  };