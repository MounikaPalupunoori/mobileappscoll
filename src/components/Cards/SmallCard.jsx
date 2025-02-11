// import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { isCallSignatureDeclaration } from "typescript";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const SmallCard = ({ nav, cardtitle, icon,pointerEvents }) => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      backgroundColor: "white",
      elevation: 5,
      height: Platform.OS === "ios" ? 90 : 130,
      paddingVertical: 10,
      justifyContent: "center",
      width: "100%",
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowOffset: { x: 0, y: 10 },
      shadowOpacity: 0.5,
      backgroundColor: "white",
      borderRadius: 5,
      elevation: 5,
      gap: 10,
    },
    cardMargin: {
      flex: 1,
      margin: 15,
    },
    cardText: {
      fontSize: Platform.OS === "ios" ? 15 : 20,
      fontWeight: "bold",
    },
  });
  return (
    <TouchableOpacity
      style={[styles.cardMargin,{pointerEvents : pointerEvents ? pointerEvents :"auto"}]}
      onPress={() => {
        if(nav){
          if (nav === "Home") {
            navigation.navigate("Scan")
          }else{
            navigation.navigate(nav)
          }
        }
      }}
    >
      <View style={styles.card}>
        <Ionicons name={icon} size={35} color="#3C8DBC" />
        <Text style={styles.cardText}>{cardtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SmallCard;
