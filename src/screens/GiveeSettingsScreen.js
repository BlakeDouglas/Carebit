import * as React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Entypo";

const renderHero = () => <View style={styles.heroContainer}></View>;

export default class App extends React.Component {
  state = {
    refreshing: false,
  };

  render() {
    return <View style={styles.container}></View>;
  }
}

const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({});
