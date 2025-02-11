import React from "react";
import { View, Pressable, FlatList } from "react-native";

const SkeletonPlaceholder = ({ width = "100%", height = 14, style }) => (
  <View
    style={{
      backgroundColor: "#E5E7EB",
      borderRadius: 4,
      width,
      height,
      ...style,
    }}
  />
);

const SkeletonCard = () => (
  <Pressable
    style={{
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    }}
  >
    {/* Skeleton for date range */}
    <View
      style={{
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 8,
        borderColor: "#E5E7EB",
        borderBottomWidth: 0.5,
      }}
    >
      <SkeletonPlaceholder />
    </View>

    {/* Skeleton for rating */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingBottom: 8,
        borderColor: "#E5E7EB",
        borderBottomWidth: 0.5,
      }}
    >
      <SkeletonPlaceholder width={50} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
                marginRight: 4,
              }}
            />
          ))}
        </View>
      </View>
    </View>

    {/* Skeleton for comment */}
    <View>
      <SkeletonPlaceholder width={100} />
      <SkeletonPlaceholder style={{ marginTop: 4, width: "90%" }} />
    </View>
  </Pressable>
);

const RatingsLoader = ({ count }) => {
  const renderItem = () => <SkeletonCard />;

  return (
    <FlatList
      data={Array.from({ length: count })}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default RatingsLoader;
