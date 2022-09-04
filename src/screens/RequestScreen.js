import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  View,
  Switch,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function GiveeHomeScreen({ navigation }) {
  return (
    <View style={styles.mainBody}>
      <FlatList
        data={{ id: "yo", title: "item1" }}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainBody: {
    height: "100%",
    width: "100%",
    backgroundColor: "whitesmoke",
  },
});
