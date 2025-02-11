import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearStaffData, getAllStudents } from "../redux-toolkit/reducers/staffReducer";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';


export default function StudentList() {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const selector = useSelector(state => state.staffSlice.allStudents);
  const hasLoadmoreData = useSelector(state => state.staffSlice.hasLoadmoreData)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const fetchData = () => {
    dispatch(getAllStudents({ page, type: selectedFilter }));
  };
  useEffect(() => {
    fetchData();
  }, [isFocused, page, selectedFilter]);

  const handleLoadMore = () => {
    if (hasLoadmoreData === true) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    closeMenu();
    setPage(1);
    dispatch(clearStaffData([]))
  };

  return (
    <SafeAreaView style={{ height: "100%", width: "100%", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
      <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, paddingVertical: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingHorizontal: 5 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10
          }}>Students List</Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <Ionicons name="filter-outline" size={20} color="#000000" />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => applyFilter('All')}
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ flex: 1 }}>All</Text>
                    {selectedFilter === 'All' && <Ionicons name="checkmark" size={20}/>}
                  </View>
                }
              ></Menu.Item>
              <Divider />
              <Menu.Item
                onPress={() => applyFilter('Walk-Up')}
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ flex: 1 }}>Walk-Up</Text>
                    {selectedFilter === 'Walk-Up' && <Ionicons name="checkmark" size={20}  />}
                  </View>
                }
              />
              <Divider />
              <Menu.Item
                onPress={() => applyFilter('Drive-Up')}
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ flex: 1 }}>Drive-Up</Text>
                    {selectedFilter === 'Drive-Up' && <Ionicons name="checkmark" size={20} />}
                  </View>
                }
              />
            </Menu>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={selector}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.cardContainer} key={index}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.imageIcon}
                  source={item?.photo ? { uri: item?.photo } : require("../../assets/profile2.png")}
                />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.name}>{item?.firstName + " " + item?.lastName}</Text>
                <Text style={styles.info}>Id: {item?.studentId}</Text>
                <Text style={styles.info}>Grade: {item?.grade}{item?.group ? "-" + item?.group : ""}</Text>
                <Text style={styles.info}>Gender: {item?.gender}</Text>
                <Text style={styles.info}>PickupType: {item?.pickupType}</Text>
              </View>
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            selector.loader ? (
              <View style={{ padding: 10, alignItems: "center" }}>
                <Text>Loading...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12 }} >No Students</Text>
            </View>
          )}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  },
  contactItem: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 15,
  },
  imageIcon: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  info: {
    fontSize: 14,
    color: "#777777",
    marginTop: 4,
  },
});
