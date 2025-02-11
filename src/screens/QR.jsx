
import React, { useState, useRef, useEffect ,useMemo} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Share,
  Image
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from "@expo/vector-icons";
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";
import Button from "../components/Button";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from "expo-sharing";
import { encryptionKey } from "../../utils/encryptionKey";
import CryptoES from "crypto-es";


export default function QR({ qr }) {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [QR, setNewQr] = useState(qr)
  const [loader, setLoader] = useState(false)
  const [countdown, setCountdown] = useState(60);
  const spinValue = useRef(new Animated.Value(0)).current;
  const viewShotRef = useRef(null);

  useEffect(() => {
    if (qr[2] === "Home") {
      const intervalId = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          regenerateQR();
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      requestPermission()
    }
  }, [countdown]);

  const qrData = useMemo(() => {
    if (!QR) return null; 
    return CryptoES.AES.encrypt(JSON.stringify(QR), encryptionKey).toString();
  }, [QR, qr[1]]); 

  

  const shareImage = async(val)=>{
      try {
        // Capture the screenshot
        await MediaLibrary.saveToLibraryAsync(val);
        await Sharing.shareAsync("file://" + val,{
          dialogTitle: 'Share Image', 
          mimeType: 'image/png', 
        });
  
      } catch (error) {
        console.error('Error taking screenshot or sharing:', error);
      }
  }

  const takeScreenShot = async () => {
    viewShotRef.current.capture().then((uri) => {
      shareImage(uri)
      }),
      (error) => console.error("Oops, snapshot failed", error);
  }


  const regenerateQR = () => {
    setLoader(true)
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
      const currentDate = new Date()
      qr[1] = currentDate.setMinutes(currentDate.getMinutes() + 1)
      setNewQr(qr);
      setCountdown(60)
      setLoader(false)
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      {status !== null ? <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <ViewShot ref={viewShotRef} style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center",backgroundColor:"white" ,padding:20}} options={{ fileName: "Screen shot",format: "png", quality: 0.9 }}>
         {qr[3]?.name ?<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center",marginVertical:10,backgroundColor:"white" }}>
            <Text style={{fontWeight: "bold"}}>Student Name:</Text>
            <Text style={{ fontSize: 20 }}>{qr && qr[0]?.students?.firstName + " " + qr[0]?.students?.lastName} ({qr && qr[0]?.students?.studentId})</Text>
          </View>:null} 
          <View >
            {loader ? <HomeSkeletonLoader total={3} count={1} /> : <QRCode
              value={qrData}
              ecl="L"
              size={200}
              color="black"
              backgroundColor="white"
              // onError={(error)=>console.log(error,"hihihi")}
            />}
          </View>
          {qr[2] === "Guest" ?
            <View style={{ width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" ,backgroundColor:"white"}}>
              <View style={{ marginTop: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Guest Details:</Text>
                <Text>Guest Name: {qr[3].name}</Text>
                <Text>Guest Mobile Number: {qr[3].mobile}</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>School Details:</Text>
                <Text style={{textAlign:"center"}}>School Name: {qr[0]?.scools?.name}</Text>
                <Text style={{textAlign:"center"}}>School Address: {qr[0]?.scools?.address1 ? qr[0]?.scools?.address1 : ""}{qr[0]?.scools?.address2 ? " " + qr[0]?.scools?.address2 : ""}</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>Guest Access Created by:</Text>
                <Text>Name: {qr[0]?.parents?.firstName + " " + qr[0]?.parents?.lastName}</Text>
                <Text>Relation: {qr[0]?.parents?.relation}</Text>
              </View>
            </View>
            : null}
        </ViewShot>
        {qr[2] === "Home" ?
          <>
            {loader && QR ? null : <Text style={{ marginTop: 20, fontWeight: "bold" }}>QR Code Expires in {countdown} seconds</Text>}
          </>
          : <Button
            onPress={takeScreenShot}
            style={{ borderRadius: 5, marginTop: 25, width: 300 }}
          >
            Share as a Screenshot
          </Button>}
      </View>
        : <View style={styles.container}>
          <Text style={styles.message}>We need your permission to save the screenshot</Text>
          <Button onPress={() => { Linking.openSettings(); requestPermission() }}> {"Grant permission"}</Button>
        </View>}
    </>

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
});

