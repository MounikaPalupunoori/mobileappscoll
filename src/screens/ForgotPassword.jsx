import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";

import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux-toolkit/reducers/passwordReducer";

const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});


export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.avoidingView}
    >
      <View
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
                height: 200,
                aspectRatio: 1,
                resizeMode: "contain",
                marginBottom: 50,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30
          }}
        >
          <Formik
            initialValues={
              { email: "" }
            }
            validationSchema={EmailSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values) => {
              const payload = {
                email: values.email
              }
              dispatch(resetPassword(payload)).unwrap()
                .then(async (response) => {
                 if(response.status === "SUCCESS"){
                  Alert.alert("", `New Password is sent to ${values.email}`, [
                    { text: "OK", onPress: () => navigation.goBack() },
                  ]);
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
              <View
                style={{
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  placeholder="Enter Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  style={{ width: 300 ,height: Platform.OS === "ios" ? 45 : 50,fontSize: 14,}}
                  autoCorrect={false}
                  placeholderTextColor={'grey'}
                  textContentType="emailAddress"
                />
                {errors.email && touched.email && (
                  <Text style={{ color: "red", textAlign: "left", width: 300 }}>
                    {errors.email}
                  </Text>
                )}

                <Button
                  onPress={handleSubmit}
                  style={{
                    borderRadius: 5,
                    marginTop: 15,
                    width: 300,
                  }}
                >
                  Reset
                </Button>

                <TouchableOpacity
                  onPress={() => navigation.navigate("MainLogin")}
                  style={{ marginTop: 25 }}
                >
                  <Text style={{ color: "#3c8dbc" }}>
                    Already have an account? Log in.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
});
