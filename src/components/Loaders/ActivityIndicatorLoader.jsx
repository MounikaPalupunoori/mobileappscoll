import React from "react";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.7);",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: "center",
  },
});
function ActivityIndicatorLoader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'rgba(0, 0, 0, 0.1)',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF",
          padding: Platform.OS === "ios" ? 20 : 8,
          borderRadius: Platform.OS === "ios" ? 10 : 50,
          borderWidth: 0.1,
          shadowColor: "#000",
        }}
      >
        <ActivityIndicator
          size={Platform.OS === "ios" ? "small" : "large"}
          color="#1ba3a5"
        />
      </View>
    </View>
  );
}

export default ActivityIndicatorLoader;
