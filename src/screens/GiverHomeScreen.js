import { StyleSheet, Text, View, StatusBar, Image, SafeAreaView } from "react-native";

export default function GiverHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
       {/*Sync Container*/}

       <View style={styles.lastSyncContainer}>
       <Text style={[styles.h3, styles.syncText]}> Carebit</Text>
        <Text style={[styles.h4, styles.syncText]}> Last Sync 4 hours ago</Text>
      </View>
      {/*Alerts Container*/}
      <View style={styles.alertsContainer}>
        <Text style={styles.h4}> 0 Alerts Today</Text>
        <Text style={[styles.h4, styles.viewhistory]}> View History</Text>
      </View>

      {/*Greetings Container*/}
      <View style={styles.greetingsContainer}>
        <Text style={styles.h4}> Hello Name</Text>
        <Text style={styles.h2}> Some other text goes in here</Text>
      </View>

      {/*HeartRate & Steps Container*/}
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.h3}>Last Recorded activity</Text>
          <Text style={styles.h4}>Time</Text>
        </View>
        <View style={styles.dataCardsContainer}>
          <View style={styles.smallCard}>
            <View style = {styles.cardTitle}>
              <View style = {styles.title}>
                <Image
                 source={require("../../assets/images/heart/heart.png")}
                
                />
                <Text  style={styles.h2}>Heart Rate</Text>
              </View>
              
            </View>
            <View style = {styles.inCard}>
              <View style={styles.heartData}>
                <Text style={styles.h1}>74</Text>
                <Text style={styles.h4}>BPM</Text>
              </View>
              <View>
                <Text style={styles.h4}>15 mins ago</Text>
              </View>
            </View>
          </View>
          <View style={styles.smallCard}>
            <View style = {styles.cardTitle}>
            <View style = {styles.title}>
                <Image
                 source={require("./assets/images/steps/steps.png")}
                
                />
                <Text  style={styles.h2}>Steps</Text>
              </View>
              
            </View>
            <View style = {styles.inCard}>
              <Text  style={styles.h1}>174</Text>

              <Text style={styles.h4}>15 mins ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/*Summary Container*/}
      <View style={styles.summaryContainer}>
        <View style={styles.titleContainer}>
          <Text  style={styles.h3}>Today</Text>
          <Text style={styles.h4}>Date</Text>
        </View>
        <View style={styles.largeCard}>
        <View style={styles.cardTitle}>
        <View style = {styles.title}>
                <Image
                 source={require("../../assets/images/heart/heart.png")}
                
                />
               <Text  style={styles.h2}>Heart Rate Summary</Text>
              </View>
          
          <Text style={styles.h4}>BPM</Text>
        </View>
        <View style={styles.summaryDataContainer}>
        <View style = {styles.leftBoarder}>
          <View style = {styles.inCard}>
            <Text  style={styles.h1}>74</Text>
            <Text style={styles.h4}>min</Text>
          </View>
          </View>
          <View style = {styles.leftBoarder}>
          <View style = {styles.inCard}>
            <Text  style={styles.h1}>74</Text>
            <Text style={styles.h4}>average</Text>
          </View>
          </View>
          <View style = {styles.leftBoarder}>
          <View style = {[styles.inCard]}>
            <Text  style={styles.h1}>74</Text>
            <Text style={styles.h4}>max</Text>
          </View>
          </View>
        </View>
        </View>
       
      </View>

      {/*Total steps and Battery Container*/}
      <View style={styles.batteryContainer}>
        <View style={styles.smallCard}>
          <View style = {styles.cardTitle}>
          <View style = {styles.title}>

                <Image
                 source={require("../../assets/images/steps/steps.png")}
                
                />
                <Text  style={styles.h2}>Total Steps</Text>
              </View>
            
          </View>
          <View style = {styles.inCard}>
            <Text  style={styles.h1}>174</Text>

            <Text style={styles.h4}>15 mins ago</Text>
          </View>
        </View>
        <View style={styles.smallCard}>
          <View style = {styles.cardTitle}>
          <View style = {styles.title}>
                <Image
                 source={require(".../../assets/images/fitbit/fitbit.png")}
                
                />
                <Text  style={styles.h2}>Fitbit Battery</Text>
              </View>
            
          </View>
          <View style = {styles.inCard}>
          <View style = {styles.batteryImage} >
          <Image
                 
                 source={require("../../assets/images/batterymedium/batterymedium.png")}
                
                />
            </View>
            <Text style={styles.h4}>15 mins ago</Text>
          
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"whitesmoke",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  lastSyncContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding:15,
    
    backgroundColor: 'dodgerblue',

  },
  alertsContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 3},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },

  syncText: {
    fontWeight: 'bold',
    color:  "white"

  },
  viewhistory: {
    color: 'dodgerblue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  h1: {
    fontSize:42,
    fontWeight:"bold"
  },
  h2: {
    fontSize:21,
  },
  h3: {
    fontSize:18,
  },
  h4: {
    fontSize:17,
    color:"grey",
    fontWeight:"500"
  },
  title:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center"

  },
  largeCard: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      },
    }),

  },
  greetingsContainer: {
    padding: 5,
    marginTop:10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  dataCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    
    
  },
  leftBoarder: {
    flex:1,
    borderRightWidth:1,
    borderRightColor:'whitesmoke',
    justifyContent: "center",
    alignItems:"center",

  },
  smallCard: {
    backgroundColor: "white",
    width: 180,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    flexDirection: "row",
    borderBottomColor: 'lightgrey',
    padding:10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    width:"100%",
    marginTop:0,
    ...Platform.select({
      android:{
         borderBottomWidth:1,
         borderBottomColor:'whitesmoke'      
      },
      default:{
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.25,
      }
    }),
    
  },
  heartData: {
    flexDirection: "row",
  },
  dataContainer: {
    marginTop:0,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    
  },
  summaryContainer: {
    justifyContent: "space-around",
  },
  inCard:{
    padding:24,
    alignItems:"center",
    justifyContent:"center"
  },

  summaryDataContainer: {
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
  },
  batteryContainer: {
    marginTop:10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  batteryImage: {
    
    padding:12,
  }
});