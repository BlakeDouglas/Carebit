import {storeMessageToken, refreshFitbitAccessToken, fetchFitbitAccessToken } from '../network/Carebitapi';

export const fetchFitbitData = async (selectedUser) => {
    const caregiveeID = selectedUser.caregiveeID;
    if (!fitbitAccessToken) {
      // Seems that refresh has a cooldown. Switch this on if u get invalid token
      // await refreshFitbitAccessToken();
      await fetchFitbitAccessToken(caregiveeID);
    } else {
      let date_today = moment().format("YYYY[-]MM[-]DD");
      //Get HeartRate
      let heartResponse = await fetch(
        "https://api.fitbit.com/1/user/" +
          caregiveeID +
          "/activities/heart/date/" +
          date_today +
          "/1d.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let heart = await heartResponse.json();
      let HeartAvg = heart["activities-heart"][0].value.restingHeartRate;
      let HeartMax = heart["activities-heart"][0].value.heartRateZones[3].max;
      let HeartMin = heart["activities-heart"][0].value.heartRateZones[0].min;

      // Checks for expired token
      if (heart.errors) {
        console.log("Refreshing ");
        await refreshFitbitAccessToken(caregiveeID);
        return;
      }

      

      //Get Steps
      let stepsResponse = await fetch(
        "https://api.fitbit.com/1/user/" +
          caregiveeID +
          "/activities/tracker/steps/date/" +
          date_today +
          "/1d.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let json = await stepsResponse.json();
      let steps = json["activities-tracker-steps"][0].value;
      console.log("Steps: " + steps);
      //Get Battery
      //TODO: implement levels for different battery icons. getBatteryIcon(level)
      let deviceResponse = await fetch(
        "https://api.fitbit.com/1/user/-/devices.json",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + fitbitAccessToken,
          },
        }
      );
      let battery = await deviceResponse.json();
      console.log("Response from devices:");
      console.log(battery);

      return {
        Steps: steps, 
        Heart: heart,
        HeartAvg: HeartAvg,
        HeartMax: HeartMax,
        HeartMin: HeartMin,
        Battery: battery,
    };
    }

    
}