import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSkeleton: {
    width: 130,
    height: 130,
    backgroundColor: "#f7f5f5",
    borderRadius: 65, 
    marginBottom: 20, 
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
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#d2d9d4",
    backgroundColor: "white",
    width: "100%",
    marginVertical: 5,
  },
  titleSkeleton: {
    width: "100%",
    height: 15,
    backgroundColor: "#f7f5f5",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
});

function ProfileSkeletonLoader({ totalFields }) {
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

  const renderShimmer = () => (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [{ translateX }],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Profile Image Skeleton */}
      <View style={styles.imageSkeleton}>{renderShimmer()}</View>

      {/* Field Skeletons */}
      {Array(totalFields)
        .fill()
        .map((_, index) => (
          <View style={styles.card} key={index}>
            <View style={styles.titleSkeleton}>{renderShimmer()}</View>
          </View>
        ))}
    </View>
  );
}

export default ProfileSkeletonLoader;
