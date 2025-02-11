import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Application from 'expo-application';
import { clearImageData } from "../redux-toolkit/reducers/parentReducer";
import { clearParentData } from "../redux-toolkit/reducers/parentReducer";
import { useDispatch, useSelector } from "react-redux";

const { height } = Dimensions.get("window");


const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
  },
  versionText: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    color: "gray",
    fontSize: 14,
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
    height: height / 2,
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
});





export default function Menu() {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [menuItems, setMenuItems] = useState([])
  const[role,setRole]=useState("")
  const getRole = async () => {
    const Role = await AsyncStorage.getItem("role")
    setRole(Role)
    if(Role === "Parent"){
      setMenuItems([
        { name: "Profile", icon: "person-outline", route: "profile" },
        {
          name: "Change Password",
          icon: "lock-closed-outline",
          route: "ChangePassword",
        },
        { name: "Logout", icon: "log-out-outline", route: "" },
      ])
    }else{
      setMenuItems([
        { name: "Profile", icon: "person-outline", route: "profile" },
        {
          name: "Change Password",
          icon: "lock-closed-outline",
          route: "ChangePassword",
        },
        {
          name: "Student List",
          icon: "people-outline",
          route: "studentlist",
        },
        { name: "Logs", icon: "document-outline", route: "logs" },
        { name: "Change Pickup Mode", icon: "car-outline", route: "changeMode" },
        { name: "Logout", icon: "log-out-outline", route: "" },
      ])
    }
     
  }

  useEffect(() => {
    getRole()
  }, [])

  const Logout = async()=>{
    const rememberValue = await AsyncStorage.getItem("remember")
   
    try {
      const keys = await AsyncStorage.getAllKeys();
      if(rememberValue === "false"){
        const keyToPreserve = 'remember';
        await AsyncStorage.multiRemove(keys.filter(key => key !== keyToPreserve));
        navigation.navigate("MainLogin");
      }else{
        const keysToPreserve = ['remember', 'username', 'password'];
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter(key => !keysToPreserve.includes(key));
         await AsyncStorage.multiRemove(keysToRemove);
         navigation.navigate("MainLogin");
      }
    } catch (error) {
      console.error('Error clearing AsyncStorage values:', error);
    }
    
  }
  

  return (
    <SafeAreaView style={styles.container}>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
          Menu
        </Text>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (item.name === "Logout") {
              Alert.alert('', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                },
                {
                  text: 'OK', onPress: () => {
                   Logout()
                  }
                },
              ]);
            } else {
              dispatch(clearImageData(""))
                if (item.route === "profile") {
                  dispatch(clearParentData(""))
                }
                navigation.navigate(item.route);
            }
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              marginTop: 15,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name={item.icon} size={25} color="#3c8dbc" />
              <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </View>
            <MaterialCommunityIcons
              name={"chevron-right"}
              size={25}
              color="#198b8b"
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              marginTop: 10,
              borderBottomColor: "#E5E7EB",
            }}
          />
        </TouchableOpacity>
      ))}

      <Text style={styles.versionText}>{Application.nativeApplicationVersion}V</Text>
    </SafeAreaView>
  );
}
