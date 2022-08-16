import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Image,
  Switch,
  ImageBackground,
} from "react-native";
import React, { useState } from 'react';
import { TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";

import GlobalStyle from "../utils/GlobalStyle";


export default function GiveeHomeScreen() {

  const [isEnabledSleep, setIsEnabledSleep] = useState(true);
  const [isEnabledDisturb, setIsEnabledDisturb] = useState(true);
  const [isEnabledMonitor, setIsEnabledMonitor] = useState(true);
  const toggleSwitchSleep = () => {
    setIsEnabledSleep(previousState => !previousState)
  }
  const toggleSwitchDisturb = () => {
    setIsEnabledDisturb(previousState => !previousState)
  }
  const toggleSwitchMonitor = () => {
    setIsEnabledMonitor(previousState => !previousState)
  }

  return (
    <SafeAreaView style={styles.background}>
      <SafeAreaView style={styles.topBody}>
        <SafeAreaView style={styles.settingImageBody}>
          <Image
            source={require('../../assets/images/icons-settings.imageset/icons-settings.png')}
          />
        </SafeAreaView>
        <SafeAreaView style={styles.carebitSyncBody}>
          <Text style={styles.carebitText}>
            Carebit
          </Text>
          <Text style={styles.syncText}>
            Last Sync 4 hours ago
          </Text>
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.mediumTopBody}>
        <SafeAreaView>
          <Text style={styles.helloText}>
            Hello Testing care
          </Text>
          <Text style={styles.caregiverText}>
            Your Caregiver is Paola
          </Text>
        </SafeAreaView>
        <TouchableOpacity style={styles.callBody}>

          <Image
            source={require('../../assets/images/icons-heart-small-color.imageset/icons-heart-small-color.png')}
          />
          <Text style={styles.callText}>
            Call Paola
          </Text>

        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={styles.mediumBody}>
        <TouchableOpacity style={styles.alertBody}>
          <Image
            style={styles.imagesBody}
            source={require('../../assets/images/icons-alert-big-color.imageset/icons-alert-big-color.png')}
          />
          <Text style={styles.buttonBigText}>Alerts</Text>
          <Text style={styles.buttonSmallText}>0 Today</Text>

        </TouchableOpacity>
        <TouchableOpacity style={[styles.alertBody, { marginRight: 12 }]}>
          <Image
            style={styles.imagesBody}
            source={require('../../assets/images/icons-caregivee-message.imageset/icons-caregivee-message.png')}
          />
          <Text style={styles.buttonBigText}>Quick Chat</Text>
          <Text style={styles.buttonSmallText}>0 New</Text>


        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView
        style={{ borderBottomColor: 'lightgray', borderBottomWidth: 2, marginTop: 20 }}
      >
      </SafeAreaView>
      <Text style={styles.preferencesText}>Preferences</Text>

      <SafeAreaView style={styles.bottomBody}>

        <SafeAreaView style={styles.bottomRowBody}>
          <Image
            style={[styles.imagesBody, { marginLeft: 20, marginRight: 20 }]}
            source={require('../../assets/images/icons-caregivee-sleep-off.imageset/icons-caregivee-sleep-off.png')}
          />
          <SafeAreaView>
            <Text style={styles.buttonBigText}>Sleep Mode</Text>
            <Text style={styles.buttonSmallText}>Off</Text>
          </SafeAreaView>
          <Switch
            trackColor={{false: 'lightgray', true: 'mediumaquamarine'}}
            thumbColor={isEnabledSleep?'white':'white'}
            style={styles.switchBody}
            onValueChange={toggleSwitchSleep}
            value={isEnabledSleep}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.bottomRowBody}>
          <Image
            style={[styles.imagesBody, { marginLeft: 20, marginRight: 20 }]}
            source={require('../../assets/images/icons-caregivee-dnd-off.imageset/icons-caregivee-dnd-off.png')}
          />
          <SafeAreaView>
            <Text style={styles.buttonBigText}>Do Not Disturb</Text>
            <Text style={styles.buttonSmallText}>Off</Text>
          </SafeAreaView>
          <Switch
          
            trackColor={{false: 'lightgray', true: 'mediumaquamarine'}}
            thumbColor={isEnabledDisturb?'white':'white'}
            style={styles.switchBodyDisturb}
            onValueChange={toggleSwitchDisturb}
            value={isEnabledDisturb}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.bottomRowBody}>
          <Image
            style={[styles.imagesBody, { marginLeft: 20, marginRight: 20 }]}
            source={require('../../assets/images/icons-caregivee-monitor-on.imageset/icons-caregivee-monitor-on.png')}
          />
          <SafeAreaView>
            <Text style={styles.buttonBigText}>Monitoring</Text>
            <Text style={styles.buttonSmallText}>Active</Text>
          </SafeAreaView>
          <Switch
            trackColor={{false: 'lightgray', true: 'mediumaquamarine'}}
            thumbColor={isEnabledMonitor?'white':'white'}
            style={styles.switchBody}
            onValueChange={toggleSwitchMonitor}
            value={isEnabledMonitor}
          />
        </SafeAreaView>

      </SafeAreaView>
    </SafeAreaView >

  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  topBody: {
    height: 75,
    flexDirection: 'row',
    backgroundColor: 'dodgerblue',
    alignItems: 'center'
  },
  settingImageBody: {
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 15
  },
  carebitSyncBody: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 85,
    marginTop: 15,

  },
  mediumTopBody: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  callBody: {
    alignItems: 'center',
    marginLeft: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  mediumBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  alertBody: {
    width: 177,
    height: 150,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginLeft: 10,
  },
  imagesBody: {
    width: 45,
    height: 45,
  },
  switchBody: {
    marginLeft: 120,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  switchBodyDisturb: {
    marginLeft: 95,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  bottomBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',

  },
  bottomRowBody: {
    width: 370,
    height: 90,
    marginLeft: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderRadius: 7,
  },

  carebitText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5
  },
  syncText: {
    color: 'white',
    fontSize: 15,
    marginBottom: 10,
  },
  helloText: {
    color: 'darkgrey',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },

  callText: {
    color: 'dodgerblue',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5
  },
  caregiverText: {
    color: 'black',
    fontSize: 21,
    marginLeft: 10,
    fontWeight: '500'
  },
  buttonBigText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  buttonSmallText: {
    fontSize: 16,
    color: 'darkgrey',
    fontWeight: '500',
  },
  preferencesText: {
    marginTop: 15,
    fontSize: 19,
    fontWeight: '500',
    marginLeft: 10,
  },


});
