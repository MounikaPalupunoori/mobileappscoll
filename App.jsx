import 'react-native-gesture-handler';
import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Login from "./src/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "./src/redux-toolkit/store"; // Import your Redux store
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import QR from "./src/screens/QR";
import ScanQR from "./src/screens/ScanQR";
import ForgotPassword from "./src/screens/ForgotPassword"
import BottomMenu from "./src/components/BottomMenu";
import ChangePassword from "./src/screens/ChangePassword";
import Profile from './src/screens/Profile';
import Logs from "./src/screens/Logs"
import GuestAccess from './src/screens/GuestAccess';
import Pickup from './src/screens/Pickup';
import ChangeMode from './src/screens/ChangeMode';
import StudentList from './src/screens/StudentList';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  const [Token, setToken] = useState("");
  const Stack = createNativeStackNavigator();

  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/LucidaGrandeBold.ttf"),
    Regular: require("./assets/fonts/LucidaGrande.ttf"),
    Light: require("./assets/fonts/LucidaGrande.ttf"),
  });

  useEffect(() => {
    getToken();
  }, []);

  if (__DEV__) {
    require("./ReactotronConfig");
  }

  const getToken = async () => {
    const Token = await AsyncStorage.getItem("token");
    setToken(Token);
  };

  if (!fontsLoaded) {
    return null;
  }
  const lightTheme = {
    mode: 'light',
  };
  return (
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: false,
          }}
        >
          {Token ?  <Stack.Screen
            name="HomePage"
            component={BottomMenu}
            options={{ headerShown: false, gestureEnabled: false }}
          />:
          <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
        />}
         <Stack.Screen
            name="MainLogin"
            component={Login}
            options={{ headerShown: false, gestureEnabled: false }}
          />
            <Stack.Screen
            name="Home"
            component={BottomMenu}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="qr"
            component={QR}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="scanqr"
            component={ScanQR}
            options={{ headerShown: false, gestureEnabled: false }}
          />
            <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="logs"
            component={Logs}
            options={{ headerShown: false, gestureEnabled: false }}
          />
            <Stack.Screen
            name="guest"
            component={GuestAccess}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="pickup"
            component={Pickup}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="changeMode"
            component={ChangeMode}
            options={{ headerShown: false, gestureEnabled: false }}
          />
           <Stack.Screen
            name="studentlist"
            component={StudentList}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
        <StatusBar style="dark"/>
      </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
