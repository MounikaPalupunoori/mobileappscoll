import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Text,
  Platform,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
} from "react-native";
import {
  createBottomTabNavigator,
  BlurView,
} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Home from "../screens/Home"
import Menu from "../screens/Menu";
import ScanQR from "../screens/ScanQR"
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
  },
  modalContent: {
    alignItems: "center",
    padding: 4,
    margin: 5,
  },
});

export default function BottomMenu() {
  const [Role, setRole] = useState("")

  const getRole = async () => {
    const role = await AsyncStorage.getItem("role")
    setRole(role)
  }

  useEffect(() => {
    getRole()
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {Role === "Staff" ? 
      <>
       <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBarStyle],
          tabBarActiveTintColor: "#3c8dbc",
          tabBarInactiveTintColor: "#AFA8A8",
          tabBarLabel: () => null,
        }}
      >
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarLabel: "home",
            tabBarIcon: ({focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={"#3c8dbc"}
                />
              </View>
            ),
          }}
        />
          <Tab.Screen
            name="Scan"
            component={ScanQR}
            options={{
              tabBarLabel: "Scan QR",
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    height: 50,
                    width: 50,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name={focused ? "scan" : "scan-outline"}
                    size={24}
                    color={"#3c8dbc"}
                  />
                </View>
              ),
            }}
          />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarLabel: "Menu",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={focused ? "settings" : "settings-outline"}
                  size={24}
                  color={"#3c8dbc"}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      </>
      :
      <>
       <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBarStyle],
          tabBarActiveTintColor: "#198b8b",
          tabBarInactiveTintColor: "#AFA8A8",
          tabBarLabel: () => null,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={"#3c8dbc"}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarLabel: "Menu",
            tabBarIcon: ({focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={focused ? "settings" : "settings-outline"}
                  size={24}
                  color={"#3c8dbc"}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      </>
      }
     
    </View>
  );
}
