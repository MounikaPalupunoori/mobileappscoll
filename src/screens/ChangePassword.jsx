import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform,ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch ,useSelector} from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Header from "../components/Header/Header";
import { Ionicons } from "@expo/vector-icons";
import { Button, Snackbar } from 'react-native-paper';
import { changePassword } from "../redux-toolkit/reducers/passwordReducer";
import { useNavigation } from "@react-navigation/native";



const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const selector = useSelector(state => state.passwordSlice)

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current Password is required"),
    newPassword: Yup.string()
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header header="Change Password" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, marginTop: 50 }}>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            const payload = {
              password: values.currentPassword,
              newPassword: values.newPassword,
              confirNewPassword: values.confirmPassword
            }
            dispatch(changePassword(payload)).unwrap()
            .then(async (response) => {
             if(response.status === "SUCCESS"){
              Alert.alert(
                "",
                `Password changed Successfully`,
                [
                  { 
                    text: "OK", 
                    onPress: () => {
                      navigation.goBack()
                    },
                  },
                ],
                { cancelable: false }
              );
             }
            })
            .catch((error) => {
              Alert.alert("", error.error);
            });

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
            <View style={{ width: "100%" }}>
              <View>
                <TextField
                  label="Current Password"
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  onChangeText={handleChange("currentPassword")}
                  onBlur={handleBlur("currentPassword")}
                  value={values.currentPassword}
                  placeholderTextColor={'grey'}
                  className={styles.textField}
                  style={{fontSize:Platform.OS === "ios" ? 14 : 16}}
                  error={touched.currentPassword && errors.currentPassword}
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 35, right: 20 }}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.currentPassword && errors.currentPassword && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                  {errors.currentPassword}
                </Text>
              )}
              <View>
                <TextField
                  label="New Password"
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  placeholderTextColor={'grey'}
                  className={styles.textField}
                  style={{fontSize:Platform.OS === "ios" ? 14 : 16}}
                  error={touched.newPassword && errors.newPassword}
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 35, right: 20 }}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                  {errors.newPassword}
                </Text>
              )}
              <View>
                <TextField
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholderTextColor={'grey'}
                  className={styles.textField}
                  style={{fontSize:Platform.OS === "ios" ? 14 : 16}}
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 35, right: 20 }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                  {errors.confirmPassword}
                </Text>
              )}
              <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: "#3c8dbc", padding: 15, borderRadius: 5, marginTop: 20, alignItems: "center" }}>
              {selector.loader ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Change Password</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textField:{
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  }
});
export default ChangePassword;
