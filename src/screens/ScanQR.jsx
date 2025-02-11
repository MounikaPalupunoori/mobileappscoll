import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, ScrollView, Alert, Linking } from 'react-native';
import Header from "../components/Header/Header"
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { scanCode } from '../redux-toolkit/reducers/scanReducer';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import HomeSkeletonLoader from '../components/Loaders/HomeSkeletonLoader';
import moment from 'moment';
import { encryptionKey } from "../../utils/encryptionKey";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from "crypto-es";

export default function ScanQR() {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const staffSelector = useSelector(state => state.staffSlice)
  const selector = useSelector(state => state.scanSlice)
  const [data, setData] = useState( [
   
  ])
  const [permission, requestPermission] = useCameraPermissions();
  const { height, width } = Dimensions.get("window");
  const maskRowHeight = Math.round((height - 200) / 20);
  const maskColWidth = (width - 200) / 2;

  useEffect(() => {
    if (isFocused) {
      setData([])
      if (!permission) {
        requestPermission();
      }
    }
  }, [permission, isFocused]);

  const addTask = async (value) => {
    let modeType;
    const mode = await AsyncStorage.getItem("mode")
    if(mode && mode === "1"){
      modeType = "Drive-Up"
    }else if(mode && mode === "2"){
      modeType = "Walk-Up"
    }else{
      modeType = "Drive-Up"
    }
    let paylod;
    if (data[2] === "Home") {
      paylod = {
        comments: `Exit ${value}`,
        staffId: staffSelector?.staffDetails[0].staffId,
        studentId: data[0]?.students?.studentId,
        parent: data[0]?.parents?._id,
        staff: staffSelector?.staffDetails[0]._id,
        student: data[0]?.students?._id,
        scool: data[0]?.students?.scool,
        approvalStatus: value,
        pickupType:modeType
      }
    } else {
      paylod = {
        comments: `Exit ${value}`,
        staffId: staffSelector?.staffDetails[0].staffId,
        studentId: data[0]?.students?.studentId,
        parent: data[0]?.parents?._id,
        staff: staffSelector?.staffDetails[0]._id,
        student: data[0]?.students?._id,
        scool: data[0]?.students?.scool,
        approvalStatus: value,
        relationType: "Guest",
        mobile: data[3].mobile,
        pickupType:modeType
      }
    }
    dispatch(scanCode(paylod)).unwrap()
      .then(async (response) => {
        if (response.status === "SUCCESS") {
          Alert.alert(
            "",
            value === "Reject" ? "Guest/guardian access successfully Rejected" :  value === "Released" ? "Student is successfully Released": "Student is successfully Picked up",
            [
              {
                text: "OK",
                onPress: () => {
                  clearData();
                },
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        console.log(error, "error")
        Alert.alert(
          "",
          `${error.error} ${error?.data?.createdAt ? "at" + " " + moment(error?.data?.createdAt).format('DD-MMM-YYYY, HH:mm') : ""}`,
          [
            {
              text: "OK",
              onPress: () => {
                clearData();
              },
            },
          ],
          { cancelable: false }
        );
      });
  }

  const submit = (value) => {
    Alert.alert('', "Are you sure you want to proceed?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          addTask(value)
        }
      },
    ])
  }

  const clearData = () => {
    setData([])
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={() => { Linking.openSettings(); requestPermission() }}> {"Grant permission"}</Button>
      </View>
    );
  }

  const checkValidity = async(resp) => {
    const decryption =  CryptoES.AES.decrypt(resp.data, encryptionKey)
    var plaintext = decryption.toString(CryptoES.enc.Utf8);
    const parsedData = JSON.parse(plaintext)
    setData(parsedData)
    if (parsedData) {
      const firstDate = new Date(parsedData[1])
      const secondDate = new Date()
      if (secondDate > firstDate) {
        Alert.alert(
          "",
          "QR is Expired, Please generate a new QR",
          [
            {
              text: "OK",
              onPress: () => {
                clearData();
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }
  return (
    <SafeAreaView style={data && data.length > 0 ? { height: "100%", width: "100%", flex: 1, justifyContent: "flex-start", alignItems: "center" } : {
      flex: 1,
      justifyContent: "center",
    }} edges={["top", "left", "right"]}>
      <Header header="Scan" />
      {data && data.length > 0 ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {selector.loader ? <HomeSkeletonLoader total={5} count={3} /> :
            <View style={{ width: "100%", flex: 1, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ width: "100%" ,justifyContent:"flex-start",alignItems:"center"}}>
              <Text style={{ fontSize: 20, fontWeight: "bold", width: "90%", color: "#000"}}>Student Details:</Text>
                <View style={styles.cardContainer}>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.imageIcon}
                      source={data && data.length > 0 && data[0]?.students?.photo ? { uri: data[0]?.students?.photo } : require("../../assets/profile2.png")}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{data[0]?.students?.firstName + " " + data[0]?.students?.lastName}</Text>
                    <Text style={styles.info}>Id:{data[0]?.students?.studentId}</Text>
                    <Text style={styles.info}>Grade: {data[0]?.students?.grade}</Text>
                    <Text style={styles.info}>Gender: {data[0]?.students?.gender}</Text>
                  </View>

                </View>
                <Text style={{ fontSize: 20, fontWeight: "bold", width: "90%",  color: "#000" ,marginTop:20}}>{data[3]?.name ? "Guardian Details" : "Parent Details"}:</Text>
                <View style={styles.cardContainer}>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.imageIcon}
                      source={data && data.length > 0 && data[0]?.parents?.photo ? { uri: data[0]?.parents?.photo } : require("../../assets/profile2.png")}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{data[0]?.parents?.firstName ? data[0]?.parents?.firstName + " " : ""}{data[0]?.parents?.lastName ? data[0]?.parents?.lastName : ""}</Text>
                    <Text style={styles.info}>Email: {data[0]?.parents?.email ? data[0]?.parents?.email : ""}</Text>
                    <Text style={styles.info}>Mobile: {data[0]?.parents?.mobile ? data[0]?.parents?.mobile : ""}</Text>
                    <Text style={styles.info}>Relation : {data[0]?.parents?.relation ? data[0]?.parents?.relation : ""}</Text>
                  </View>
                </View>
                {data[3]?.mobile ?
                  <View style={{ width: "100%", marginTop: 20,justifyContent:"center",alignItems:"center" }}>
                    <View style={{ width: "90%" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", width: "90%", color: "#000"}}>Guest Pickup Details:</Text>
                      </View>
                     
                  <View style={styles.cardContainer}>
                  <View style={styles.detailsContainer}>
                    <Text style={{marginTop:5}}>Guest Name: {data[3]?.name ? data[3]?.name : ""}</Text>
                    <Text style={{marginTop:5}}>Guest Mobile : {data[3]?.mobile ? data[3]?.mobile : ""}</Text>
                    <Text style={{fontWeight:"bold",marginTop:10}}>{data[3]?.frequentCount && data[3]?.frequentCount > 0 ? `Picked up ${data[3]?.frequentCount} times in the past.`:"Picking up for the first time."} </Text>
                  </View>
                </View>
                  </View>

                  : <View style={{ width: "90%", marginTop: 20 }}>
                     <Text style={{fontWeight:"bold"}}>{data[0]?.parents?.frequentCount > 0 ? `Picked up ${data[0]?.parents?.frequentCount} times in the past.`:"Picking up for the first time."} </Text>
                    </View>
                    }
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginBottom: 5 }}>
                <View style={{ flex: 0.3 }}>
                  <Button style={{ backgroundColor: "red", width: "100%" }} onPress={() => submit("Reject")}> {"Reject"}</Button>
                </View>
                <View style={{ flex: 0.3 }}>
                  <Button style={{ backgroundColor: "#F28500", width: "100%" }} onPress={() => submit("Released")}> {"Release"}</Button>
                </View>
                <View style={{ flex: 0.3 }}>
                  <Button style={{ backgroundColor: "green", width: "100%" }} onPress={() => submit("Pickedup")}> {"Pickedup"}</Button>
                </View>
              </View>
            </View>
          }
        </ScrollView>
      ) :
        <CameraView style={styles.camera} facing={'back'}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(response) => {
            checkValidity(response)

          }}
        >
          <View style={styles.app}>
            <View style={styles.maskOutter}>
              <View
                style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
              />
              <View style={[{ flex: 40 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <View style={styles.maskInner}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 10,
                      borderColor: "#FFFFFF",
                      borderTopWidth: 1
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: 10,
                      borderColor: "#FFFFFF",
                      borderBottomWidth: 1
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 20,
                      height: "100%",
                      borderColor: "#FFFFFF",
                      borderLeftWidth: 1
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 20,
                      height: "100%",
                      borderColor: "#FFFFFF",
                      borderRightWidth: 1
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 30,
                      height: 30,
                      borderColor: "red",
                      borderTopWidth: 4,
                      borderLeftWidth: 4
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderColor: "red",
                      borderTopWidth: 4,
                      borderRightWidth: 4
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 30,
                      height: 30,
                      borderColor: "red",
                      borderBottomWidth: 4,
                      borderLeftWidth: 4
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderColor: "red",
                      borderBottomWidth: 4,
                      borderRightWidth: 4
                    }}
                  />
                </View>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
              <View
                style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
              />
            </View>
          </View>
        </CameraView>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: "100%",
    backgroundColor: "red"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  app: {
    flex: 1
  },
  cameraView: {
    flex: 1,
    justifyContent: "flex-start"
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent"
  },
  maskFrame: {
    backgroundColor: "#1C355E",
    opacity: 0.7
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" },
  rectangleText: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
    textAlign: "center",
    color: "white"
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
    width:"90%"
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
