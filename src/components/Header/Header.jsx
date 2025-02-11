/* eslint-disable react/prop-types */
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  mainHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default function Header({
  header,
  iconData,
  color,
  background,
  name,
  iconPosition,
  customBackPress,
  useSvgComponent = true,
  RightSvgComponent,
  LeftSvgComponent,
  onRightIconPress,
  clearData,
  navigateTo,
  onIconPress,
  ...props
}) {
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.mainHeader, { backgroundColor: background }]}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TouchableOpacity onPress={handleBackButton}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text
            style={{
              color: color,
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {header}
          </Text>
        </View>
        {iconData && (
          <TouchableOpacity
            style={{ marginLeft: "auto" }}
            onPress={onIconPress}
          >
            {iconData}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
