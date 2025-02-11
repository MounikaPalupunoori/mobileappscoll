import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  iconSkeleton: {
    width: 50,
    height: 50,
    backgroundColor: "#f7f5f5",
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

const ProfileLoader = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.iconSkeleton}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export default ProfileLoader;
