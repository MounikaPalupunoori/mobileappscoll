import React from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { emailLogin } from "../redux-toolkit/reducers/loginReducer";
import TextField from "../components/TextField";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useEffect,useState } from "react";
import { clearStaffData } from "../redux-toolkit/reducers/staffReducer"
import { clearParentData } from "../redux-toolkit/reducers/parentReducer";
import Checkbox from 'expo-checkbox';
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .email("Invalid username")
    .required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [remember, setRemember] = useState(false);
  const { loader, errorMsg } = useSelector((state) => state.loginSlice);
  const [initialValues,setInitialValues] = useState({
    username:"",
    password:""
  })
  const [showLoader,setShowLoader]=useState(false)

  const handleLogin = async (values) => {
    dispatch(emailLogin(values))
      .unwrap()
      .then(async (response) => {
        if (response?.result?.role === "Parent") {
          dispatch(clearStaffData(""))
        } else {
          dispatch(clearParentData(""))
        }
        await AsyncStorage.setItem("remember", remember.toString());
        await AsyncStorage.setItem("username", values.username);
        await AsyncStorage.setItem("password", values.password);
        await AsyncStorage.setItem("role", response?.result?.role);
        await AsyncStorage.setItem("token", response?.result?.token);
        navigation.navigate("Home")
      })
      .catch((error) => {
        // Handle error
        console.log(error)
      });
  };

  const getRemember = async()=>{
    setShowLoader(true)
    const rememberValue = await AsyncStorage.getItem("remember")
    if(rememberValue === "true"){
      const name = await AsyncStorage.getItem("username")
      const password = await AsyncStorage.getItem("password")
      setRemember(true)
      setInitialValues({
        username: name, password: password 
     })
    }else{
      setInitialValues({
        username: "", password: "" 
     })
    }
    setShowLoader(false)
  }

  useEffect(() => {
    if (isFocused) {
      getRemember()
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
  }, [isFocused]);

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.avoidingView}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {showLoader ? <HomeSkeletonLoader total={5} count={2} />:  <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF",
            width: "100%",
          }}
        >
          <View style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Image
                source={require("../../assets/logo2.png")}
                style={{
                  width: "100%",
                  height: 100,
                  aspectRatio: 1,
                  resizeMode: "contain",
                }}
              />
            </View>
          </View>
          {/* {errorMsg ? (
          <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
            {errorMsg}
          </Text>
        ) : null} */}
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
              style={{
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View
                  style={{
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    placeholder="Username"
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    keyboardType="email-address"
                    className={styles.textField}
                    style={{ width: 300, fontSize: Platform.OS === "ios" ? 14 : 16 }}
                    autoCorrect={false}
                    textContentType={"oneTimeCode"}
                    placeholderTextColor={'grey'}
                  />
                  {errors.username && touched.username && (
                    <Text style={{ color: "red", textAlign: "left", width: 300 }}>
                      {errors.username}
                    </Text>
                  )}

                  <TextField
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry={true}
                    className={styles.textField}
                    style={{ width: 300, fontSize: Platform.OS === "ios" ? 14 : 16 }}
                    autoCorrect={false}
                    textContentType={"oneTimeCode"}
                    placeholderTextColor={'grey'}
                  />
                  {errors.password && touched.password && (
                    <Text style={{ color: "red", textAlign: "left", width: 300 }}>
                      {errors.password}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginTop: 20,
                      width: 300,
                    }}
                  >
                    <Checkbox value={remember} onValueChange={(val) => {setRemember(val)}} color='#3c8dbc' />
                    <Text style={{ paddingLeft: 10, lineHeight: 20, fontSize: 15 }}>
                      Remember me
                    </Text>
                  </View>
                  <Button
                    onPress={handleSubmit}
                    style={{ borderRadius: 5, marginTop: 15, width: 300 }}
                  >
                    {loader ? <ActivityIndicator color="#FFF" /> : "Login"}
                  </Button>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={{ marginTop: 25 }}
                  >
                    <Text style={{ color: "#3c8dbc" }}>
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>}
          
       
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  }
});
