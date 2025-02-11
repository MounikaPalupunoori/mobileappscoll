import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  BackHandler,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { getStudents } from "../redux-toolkit/reducers/parentReducer";
import { getStaff } from "../redux-toolkit/reducers/staffReducer";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import QR from "./QR";
import NameLoader from "../components/Loaders/NameLoader";
import ProfileLoader from "../components/Loaders/ProfileLoader";
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";
import SmallCard from "../components/Cards/SmallCard"
import DateTimePicker from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from "../components/Button";
import moment from "moment";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { height } = Dimensions.get("window");

export default function Home() {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const selector = useSelector(state => state.parentSlice)
  const staffSelector = useSelector(state => state.staffSlice)
  const navigation = useNavigation();
  const [role, setRole] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [studentList, setStudentList] = useState([])
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [staffData, setStaffData] = useState(null)
  const [qrData, setQrData] = useState([])
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState()
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getRole()
  }, [selector.parentImage, isFocused])

  const getRole = async () => {
    const userRole = await AsyncStorage.getItem("role")
    setRole(userRole)
    if (userRole === "Parent") {
      dispatch(getStudents())
    } else {
      dispatch(getStaff())
    }
  }

  useEffect(()=>{
    if (isFocused ) {
    const backAction = () => {
      Alert.alert("", "Do you want to close Scool", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        { text: "OK", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }
  },[isFocused])

  useEffect(() => {
    if (isFocused && selector?.studentsList) {
      const studentItems = selector?.studentsList.map(item => ({
        label: `${item.students.firstName} ${item.students.lastName}`,
        value: `${item.students.studentId}`
      }));
      setItems(studentItems)

      if (studentItems.length === 1) {
        setValue(studentItems[0].value)
        setDate()
      } else {
        setValue("")
        setDate()
      }
    }
   
  
  }, [isFocused, selector.studentsList])

  useEffect(() => {
    if (role) {
      setStudentList(selector?.studentsList)
    }
  }, [selector.studentsList, selector.parentImage, isFocused])

  useMemo(() => {
    if (role) {
      setStaffData(staffSelector.staffDetails)
    }
  }, [staffSelector.staffDetails])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const getCurrentDay = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  };
  const getIsRestrictedDay = (
    selector &&
    selector?.studentsList?.length > 0 &&
    selector?.studentsList[0]?.parents?.weekDays &&
    selector?.studentsList[0].parents.weekDays.includes(getCurrentDay())
  );
  
  const handleSubmit = () => {
    if (date && value) {
      setShowGuestModal(false)
      navigation.navigate("guest", { selectedDate: date, selectedStudent: value })
    } else {
      alert("Please fill all the fields")
    }
  }

  return (
    <SafeAreaView style={{ height: "100%", width: "100%", flex: 1, justifyContent: "flex-start", alignItems: "center" }} edges={["top", "left", "right"]}>
      <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", backgroundColor: "#3c8dbc", alignItems: "center", borderBottomWidth: 1,paddingVertical:5,paddingHorizontal:5, borderBottomColor: "#E5E7EB", }}>
        {selector.loader || staffSelector.loader ? <ProfileLoader /> :
          role !== "Staff" && selector?.studentsList?.length > 0 && (studentList[0]?.parents?.photo) ?
            <Image
              source={{ uri: studentList[0]?.parents?.photo }}
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
            />
            :
            role === "Staff" && staffSelector?.staffDetails?.length > 0 && (staffSelector?.staffDetails[0]?.scools?.photo && staffSelector?.staffDetails[0]?.scools?.photo !== "null") ?
              <Image
                source={{ uri: staffSelector?.staffDetails[0]?.scools?.photo }}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
              />
              :
              <View style={styles.icon}>
                <Text style={styles.iconText}>
                  {role && role === "Staff" && staffSelector && staffSelector?.staffDetails && staffSelector?.staffDetails?.length > 0 ?
                    <Image source={require("../../assets/scooll.png")} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 20 }} />
                    : selector?.studentsList && selector?.studentsList?.length > 0 && selector?.studentsList[0]?.parents?.firstName ? selector?.studentsList[0]?.parents?.firstName.charAt(0).toUpperCase() : ""}
                </Text>
              </View>
        }
        {selector.loader || staffSelector.loader ? <NameLoader /> :
          <Text style={{ fontSize: 20, flex: 1, color: "#fff" }}>
            {role === "Staff" && staffSelector?.staffDetails?.length > 0 ?
              staffSelector?.staffDetails[0]?.scools?.name
              :selector?.studentsList && selector?.studentsList?.length > 0 && studentList[0]?.parents?.firstName ? studentList[0]?.parents?.firstName + " " + studentList[0]?.parents?.lastName : ""} </Text>
        }
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: "center", margin: 10 }}
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{ width: "100%" }}>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            {role !== "Staff" ? <Text style={{ fontSize: 20, fontWeight: "bold", width: "95%", color: "#000" }}>Children</Text> : null}
            {selector.loader ? <HomeSkeletonLoader total={5} count={1} /> : studentList && studentList.length > 0 ?

              studentList.map((student, index) => (
                <TouchableOpacity 
                style={[
                  styles.cardContainer,
                  (student?.students?.isRestricted && !getIsRestrictedDay) && styles.restricted,
                ]}
                key={index} onPress={() => {
                  const currentDate = new Date()
                  const data = []
                  data.push(student)
                  data.push(currentDate.setMinutes(currentDate.getMinutes() + 1))
                  data.push("Home")
                  setQrData(data)
                  setShowModal(true)
                  
                }}
                disabled={student?.students?.isRestricted && !getIsRestrictedDay}
                >
                  <View style={{padding:15,flexDirection:'row'}}>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.imageIcon}
                      source={student?.students?.photo ? { uri: student?.students?.photo } : require("../../assets/profile2.png")}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{student?.students?.firstName + " " + student?.students?.lastName}</Text>
                    <Text style={styles.info}>Id: {student?.students?.studentId}</Text>
                    <Text style={styles.info}>Grade: {student?.students?.grade}{student?.students?.group ? "-" + student?.students?.group : ""}</Text>
                    <Text style={styles.info}>Gender: {student?.students?.gender}</Text>
                  </View>
                    </View>
                  
                  {student?.students?.isRestricted && !getIsRestrictedDay && 
                  <View style={styles.restrictedText}>
                    <Text style={{fontSize:20,fontWeight:600,color:'red'}}>Restricted</Text>
                    </View>}
                </TouchableOpacity>
              ))
              : null}

            {role === "Parent" ?
              <>
                <Text style={{ fontSize:16, fontWeight: "bold", width: "95%", color: "#000" }}>Categories</Text>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: "100%" }}>

                  <View style={{ flex: 0.5 }}>
                    <TouchableOpacity onPress={() => setShowGuestModal(true)}>
                      <SmallCard cardtitle={"Guest Access"} icon={"person-add-outline"} pointerEvents={"none"} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <TouchableOpacity onPress={()=>navigation.navigate("pickup")}>
                      <SmallCard cardtitle={"Pickup Actions"} icon={"file-tray-full-outline"} pointerEvents={"none"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>

              : null}

            {role === "Staff" ?
              <View style={{ width: "100%", justifyContent: 'center', paddingVertical: 10, alignItems: "center", backgroundColor: "white", borderRadius: 10, }}>
                <View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                      <TouchableOpacity>
                        {staffSelector?.staffDetails?.length > 0 && (staffSelector?.staffDetails[0]?.photo && staffSelector?.staffDetails[0]?.photo !== "null") ?
                          <Image
                            source={{ uri: staffSelector?.staffDetails[0]?.photo }}
                            style={styles.image}
                          /> :
                          <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row', height: 130, width: 130, borderRadius: 80, backgroundColor: "#3c8dbc" }}>
                            <Text
                              style={[
                                {
                                  backgroundColor: "#3c8dbc",
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: 50,
                                  fontWeight: "bold",
                                }
                              ]}
                            >

                            </Text>
                          </View>
                        }
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editImg}>
                        {staffSelector?.staffDetails?.length > 0 && staffSelector?.staffDetails[0]?.status === "Active" ?
                          <Icon name="checkmark-circle-sharp" size={20} color='green' />
                          :
                          <Icon name="close-circle-sharp" size={20} color='red' />}

                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", }}>
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    {staffSelector?.staffDetails?.length > 0 &&
                      staffSelector?.staffDetails[0]?.firstName + " " + staffSelector?.staffDetails[0]?.lastName}
                  </Text>
                  <Text style={{ fontSize: 18, color: "grey", marginVertical: 5 }}>
                    Teacher Id: {staffSelector?.staffDetails?.length > 0 &&
                      staffSelector?.staffDetails[0]?.staffId}
                  </Text>
                  <Text style={{ fontSize: 18, color: "grey", marginBottom: 5 }}>
                    Designation: {staffSelector?.staffDetails?.length > 0 &&
                      staffSelector?.staffDetails[0]?.type}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: staffSelector?.staffDetails?.length > 0 &&
                        staffSelector?.staffDetails[0]?.status === "Active" ? "green" : "red",
                      borderColor: staffSelector?.staffDetails?.length > 0 &&
                        staffSelector?.staffDetails[0]?.status === "Active" ? "green" : "red",
                      borderWidth: 1,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      marginTop: 5,
                    }}
                  >
                    {staffSelector?.staffDetails?.length > 0 &&
                      staffSelector?.staffDetails[0]?.status}
                  </Text>
                  <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: 'center', width: "100%", padding: 10, backgroundColor: "#F5F5F5", borderRadius: 10, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate("Scan")
                    }}>
                      <MaterialIcons name="qr-code-scanner" size={150} color='black' />
                    </TouchableOpacity>
                    <Button onPress={() => {
                      navigation.navigate("Scan")
                    }} style={{ fontSize: 20, fontWeight: '600', width: 150, height: 30, marginTop: 10 }}>Scan</Button>
                  </View>
                </View>
              </View>
              : null}
          </View>
          {role === "Staff" ? 
          <>
           <Text style={{ fontSize: 20, fontWeight: "bold", width: "95%", color: "#000",marginTop:15 }}>Pending Pickup Actions for Today</Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start", width: "100%" }}>
                  <View style={{ flex: 0.5 }}>
                    <TouchableOpacity onPress={()=>navigation.navigate("pickup")}>
                      <SmallCard cardtitle={"Pickup Actions"} icon={"file-tray-full-outline"} pointerEvents={"none"} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.5 }}>
                  </View>
                </View>
          </>:null}
         
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  <Icon name={"close-outline"} size={30} color={"black"} />
                </TouchableOpacity>

              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>{qrData && qrData[0]?.students?.firstName + " " + qrData[0]?.students?.lastName} ({qrData && qrData[0]?.students?.studentId})</Text>
              </View>
              <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop: 20 }}>
                <QR qr={qrData} />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showGuestModal}
          onRequestClose={() => setShowGuestModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => setShowGuestModal(false)}
                  style={styles.closeButton}
                >
                  <Icon name={"close-outline"} size={30} color={"black"} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 20, color: "#3c8dbc", textAlign: "center", fontWeight: "bold" }}>Create guest access to pickup your child (Once or frequently)</Text>
              <View style={{ flex: 1, width: "100%", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      marginTop: 12,
                      width: "100%",
                      maxWidth: 450
                    }}
                  >
                    <Text style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      color: "#444444",
                      paddingBottom: 7
                    }}>Select a Student</Text>
                    <DropDownPicker
                      open={open}
                      value={value}
                      key={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={setValue}
                      dropDownDirection="UP"
                      setItems={setItems}
                      placeholder={'Select a Student'}
                      textStyle={{
                        fontSize: 16,
                        fontFamily: 'Light',

                      }}
                      style={{
                        backgroundColor: "#f5f5f5"
                      }}
                      placeholderStyle={{
                        color: '#989898',

                      }}
                    />
                  </View>
                  <View style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10, zIndex: -1 }}>
                    <Text style={[styles.datelabel, { zIndex: -1, width: "100%", marginVertical: 5, fontWeight: "bold" }]}>
                      Select End Date
                    </Text>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"100%",marginBottom:8,borderRadius:5}}>
                    <TouchableOpacity onPress={()=> setDate(new Date())}>
                    <Text style={{paddingHorizontal:10,paddingVertical:10,borderWidth:1,borderColor:date && moment(date).format("DD/MM/YYYY") ===  moment(new Date()).format("DD/MM/YYYY") ? "black":"#3c8dbc",textAlign:"center",borderRadius:5,backgroundColor: date && moment(date).format("DD/MM/YYYY") ===  moment(new Date()).format("DD/MM/YYYY") ? "#3c8dbc":"white",color:date && moment(date).format("DD/MM/YYYY") ===  moment(new Date()).format("DD/MM/YYYY") ? "white":"#3c8dbc"}}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setDatePickerVisibility(true)}>
                    <Text style={{paddingHorizontal:10,paddingVertical:10,borderWidth:1,textAlign:"center",marginLeft:10,borderRadius:5,borderColor:date && moment(date).format("DD/MM/YYYY") !==  moment(new Date()).format("DD/MM/YYYY") ? "black":"#3c8dbc",backgroundColor: date && moment(date).format("DD/MM/YYYY") !==  moment(new Date()).format("DD/MM/YYYY") ? "#3c8dbc":"white",color:date && moment(date).format("DD/MM/YYYY") !==  moment(new Date()).format("DD/MM/YYYY") ? "white":"#3c8dbc"}}>Frequently</Text>
                    </TouchableOpacity>
                  </View>

                    <View style={{ zIndex: -1, width: "100%", borderWidth: 1, borderRadius: 5 }}>
                      <TouchableOpacity onPress={showDatePicker} style={{ width: "100%" }}>
                        <View style={[styles.picker, { zIndex: -1, width: "100%" }]}>
                          <Text style={{ fontSize: 18 }}>
                            {date ? (
                              moment(date).format('DD/MM/YYYY')
                            ) : (
                              "Select End Date"
                            )}
                          </Text>
                          <Text>
                            <Icon name="calendar-outline" size={23} />
                          </Text>
                        </View>
                      </TouchableOpacity>

                    </View>
                    <View >
                      <DateTimePicker
                        date={date}
                        mode="date"
                        value={new Date()}
                        isVisible={isDatePickerVisible}
                        onPress={showDatePicker}
                        onConfirm={(dates) => {
                          setDate(dates);

                          hideDatePicker();
                        }}
                        onCancel={hideDatePicker}
                        textColor="#000"
                        maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                        style={{ height: 200, zIndex: -1 }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    onPress={handleSubmit}
                    style={{
                      borderRadius: 5,
                      marginTop: 15,
                      width: 450,
                    }}
                  >
                    Continue
                  </Button>
                </View>

              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
    backgroundColor: "#3c8dbc",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height / 1.5,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333333",
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
    padding: 15,
    height: 50,
    fontSize: 16,
    borderRadius: 10,
    zIndex: -1,
  },
  datelabel: {
    fontSize: 12,
    color: '#444444',
    paddingBottom: 7,
  },
  picker: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: 50,
    width: "100%",
    maxWidth: 450,
    fontSize: 18,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#F0F0F0',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 1,
    justifyContent: 'center',
    color: 'blue',
    position: 'absolute',
    bottom: 10,
    right: 15,
  },
  restrictedText: {
    textAlign: 'center',
    backgroundColor: "rgba(190, 188, 188, 0.5)",
    position: 'absolute',
    height:'100%',
    width:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    zIndex:11111
  },
  restricted: {
    padding:0
  }
});
