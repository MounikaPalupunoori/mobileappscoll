import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  skeletonLoader: {
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    maxWidth: 160,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    alignSelf: "center",
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E7E6",
    elevation: 3,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    opacity: 0.5,
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
    height: 30,
    backgroundColor: "#f7f5f5",
    borderRadius: 5,
    marginBottom: 5,
    overflow: "hidden",
    position: "relative",
  },
  iconSkeleton: {
    width: 30,
    height: 30,
    backgroundColor: "#f7f5f5",
    borderRadius: 15,
    marginRight: 5,
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

function HomeSkeletonLoader({ total, count }) {
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

  const renderSkeleton = () => (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [{ translateX }],
        },
      ]}
    />
  );

  return Array(total)
    .fill()
    .map((_, index) => (
      <View style={styles.card} key={index}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, gap:15 }}>
            {[...Array(count)].map((_, cardIndex) => (
              <View style={styles.titleSkeleton} key={cardIndex}>
                {renderSkeleton()}
              </View>
            ))}
          </View>
        </View>
      </View>
    ));
}

export default HomeSkeletonLoader;
