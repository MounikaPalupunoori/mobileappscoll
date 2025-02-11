import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { useIsFocused } from "@react-navigation/native";
import Header from "../components/Header/Header";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Button, Snackbar } from 'react-native-paper';
import { changePassword } from "../redux-toolkit/reducers/passwordReducer";
import { parentInfo, clearImageData, updatePick,  } from "../redux-toolkit/reducers/parentReducer";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { parentImage } from "../redux-toolkit/reducers/parentReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";
import { getStudents } from "../redux-toolkit/reducers/parentReducer";


import RadioGroup from 'react-native-radio-buttons-group';
import axios from "axios";
import { updatePickUpTypeURL } from "../Networks/EndPoints";

const Profile = () => {
  const [data, setData] = useState([])
  const isFocused = useIsFocused
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selector = useSelector(state => state.parentSlice)
  const [role, setRole] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState({
    father: "",
    mother: ""
  })
  const [updateImageType, setUpdateImageType] = useState("")
  const dispatch = useDispatch();
  const modes = [
    {
      id: '1',
      label: 'Drive-Up',
      value: 'Drive-Up',
      color: '#3c8dbc',
    },
    {
      id: '2',
      label: 'Walk-Up',
      value: 'Walk-Up',
      color: '#3c8dbc',
    },
  ]
  const [selectedMode, setSelectedMode] = useState("")
  const getRole = async () => {
    const Role = await AsyncStorage.getItem("role")
    if (Role === "Staff") {
      dispatch(parentInfo())
    } else {
      dispatch(getStudents())
    }
    setRole(Role)
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(clearImageData(""))
      getRole()
    }
  }, [isFocused])


  useMemo(() => {
    if (selector?.parentImage?.status === "SUCCESS") {
      setSnackbarVisible(true)
    }
  }, [selector.parentImage])



  const pickImage = async () => {
    dispatch(clearImageData(""))
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });
      setImage(result.assets[0].uri)
      const fileName = result.assets[0].uri.split("/").pop();
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType,
        name: fileName,
      });
      dispatch(parentImage(formData))
    } catch (error) {
      console.log(error)
    }
  };

  const onDismissSnackBar = () => setSnackbarVisible(false);
  const handleChange = async (value, _id) => {
    setSelectedMode(value);
    const id = `${_id}/Student`
    const data = { pickupType: value };
    dispatch(updatePick({id,data}))
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header header="Profile" />
      {selector.loader ? <HomeSkeletonLoader total={5} count={4} /> :
        <>
          {role === "Staff" ? null :
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
              <SegmentedControl
                values={['Student Details', 'Parents Details']}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
                }}
                tintColor="#3C8DBC"
                backgroundColor="white"
                textColor="#007AFF"
                fontStyle={{ color: 'black' }}
                activeFontStyle={{ color: 'white' }}
                style={{ height: 40, width: "90%" }}
              />
            </View>

          }
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop: 5 }}
            style={{ height: '100%', width: "100%" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {role === "Staff" ?
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", width: "90%", marginVertical: 10, color: "#000" }}>Staff Details</Text>
                <View style={styles.staffContainer}>
                  <Image
                    style={styles.staffIcon}
                    source={selector?.userInfo && selector?.userInfo?.length > 0 && selector?.userInfo[0]?.photo && selector?.userInfo[0]?.photo !== "null" ? { uri: selector?.userInfo[0]?.photo } : require("../../assets/profile2.png")}
                  />
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>{selector?.userInfo[0]?.firstName ? selector?.userInfo[0]?.firstName + " " : ""}{selector?.userInfo[0]?.lastName ? selector?.userInfo[0]?.lastName : ""}{selector?.userInfo[0]?.staffId ? ` (${selector?.userInfo[0]?.staffId})` : ""}</Text>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>Email: {selector?.userInfo[0]?.email ? selector?.userInfo[0]?.email : ""}</Text>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>Mobile: {selector?.userInfo[0]?.mobile ? selector?.userInfo[0]?.mobile : ""}</Text>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>Designation: {selector?.userInfo[0]?.designation ? selector?.userInfo[0]?.designation : ""}</Text>
                  <Text style={{ fontSize: 18, marginTop: 10, fontWeight: "bold" }}>Address:</Text>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>{selector?.userInfo[0]?.address1 ? selector?.userInfo[0]?.address1 + " " : ""}{selector?.userInfo[0]?.address2 ? selector?.userInfo[0]?.address2 + " " : ""}</Text>
                </View>
              </View>
              : <View style={{ flex: 1, width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
                {selectedIndex === 0 ?
                  <View style={{ width: "100%", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
                    {selector?.studentsList && selector?.studentsList.length > 0 && selector?.studentsList.map((student, index) => (
                      <View style={[styles.cardContainer, { flexDirection: 'column' }]} key={index}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                          <View style={styles.iconContainer}>
                            <Image
                              style={styles.imageIcon}
                              source={student?.students?.photo ? { uri: student?.students?.photo } : require("../../assets/profile2.png")}
                            />

                          </View>
                          <View style={styles.detailsContainer}>
                            <Text style={styles.name}>{student?.students?.firstName ? student?.students?.firstName + " " : ""} {student?.students?.lastName ? student?.students?.lastName : ""}</Text>
                            <Text style={styles.info}>Id: {student?.students?.studentId}</Text>
                            <Text style={styles.info}>Roll Number : {student?.students?.rollNumber}</Text>
                            <Text style={styles.info}>Class : {student?.students?.grade + "-" + student?.students?.group}</Text>
                            <Text style={styles.info}>Gender : {student?.students?.gender}</Text>
                            {student?.students?.bloodGroup ? <Text style={styles.info}>Blood Group : {student?.students?.bloodGroup}</Text> : null}
                            {student?.students?.dob ? <Text style={styles.info}>DOB : {student?.students?.dob}</Text> : null}
                          </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
  radioButtons={modes}
  onPress={(id) => {
    const selectedMode = modes.find(mode => mode.id === id);
    handleChange(selectedMode.value, student?.students?._id);
  }}
  selectedId={modes.find(mode => mode.value === student?.students?.pickupType)?.id || selectedMode}
  layout='row'
  containerStyle={{
    justifyContent: "space-around",
    alignItems: "flex-start",
  }}
  labelStyle={{
    fontSize: 14,
    fontWeight: '500',
  }}
/>

                        </View>
                      </View>
                    ))}
                    {/* <View style={{ width: "90%" }}>
                      <Text style={{ fontSize: 20, marginTop: 15, fontWeight: "bold" }}>Point of Contact :</Text>
                      <Text style={{ fontSize: 20, marginTop: 5 }}>Email : {data[0]?.email ? data[0].email : ""} </Text>
                      <Text style={{ fontSize: 20, marginTop: 5 }}>Mobile : {data[0]?.mobile ? data[0].mobile : ""} </Text>
                    </View> */}
                  </View>
                  :
                  <>
                    {selector?.imageLoader ? <HomeSkeletonLoader total={3} count={1} /> :
                      <View style={styles.cardContainer}>
                        <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
                          <Image
                            style={styles.imageIcon}
                            source={image ? { uri: image } : selector && selector?.studentsList.length > 0 && selector?.studentsList[0]?.parents?.photo ? { uri: selector?.studentsList[0]?.parents?.photo } : require("../../assets/profile2.png")}
                          />
                          <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "gray",
                            borderRadius: 20,
                            padding: 7,
                            justifyContent: "center",
                            color: "blue",
                            position: "absolute",
                            bottom: 5,
                            right: 10,
                          }}>
                            <Ionicons
                              name={"pencil"}
                              size={20}
                              color="white"
                            />
                          </View>

                        </TouchableOpacity>
                        <View style={styles.detailsContainer}>
                          <Text style={styles.name}>{selector?.studentsList[0]?.parents?.firstName ? selector?.studentsList[0]?.parents?.firstName + " " : ""}{data[0]?.parents?.lastName ? data[0]?.parents?.lastName : ""}</Text>
                          <Text style={styles.info}>Mobile: {selector?.studentsList[0]?.parents?.mobile ? selector?.studentsList[0]?.parents?.mobile : ""}</Text>
                          <Text style={styles.info}>Email: {selector?.studentsList[0]?.parents?.email ? selector?.studentsList[0]?.parents?.email : ""}</Text>
                          <Text style={styles.info}>Relation: {selector?.studentsList[0]?.parents?.relation ? selector?.studentsList[0]?.parents?.relation : ""}</Text>
                        </View>
                      </View>
                    }
                    <View style={{ width: "90%" }}>
                      <Text style={{ fontSize: 20, marginTop: 15, fontWeight: "bold" }}>Address :</Text>
                      <Text style={{ fontSize: 20, marginTop: 5 }}>{selector?.studentsList[0]?.students?.address1 && selector?.studentsList[0]?.students?.address2 ? selector?.studentsList[0]?.students?.address1 + " " + selector?.studentsList[0]?.students?.address2 : selector?.studentsList[0]?.students?.address1 ? selector?.studentsList[0]?.students?.address1 : selector?.studentsList[0]?.students?.address2 ? selector?.studentsList[0]?.students?.address2 : ""}</Text>
                    </View>
                  </>
                }
              </View>
            }
          </ScrollView>
        </>
      }
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "close",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        Image Updated Successfully.
      </Snackbar>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  },
  iconContainer: {
    marginRight: 15,
  },
  imageIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    padding: 5,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  staffIcon: {
    width: 150,
    height: 150,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
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
    width: "98%"
  },
  cardContainer: {
    width: "90%",
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
  },
  staffContainer: {
    width: "90%",
    flexDirection: "column",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
});
export default Profile;
