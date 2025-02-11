import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform, ActivityIndicator, Dimensions, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Header from "../components/Header/Header";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Snackbar } from 'react-native-paper';
import { changePassword } from "../redux-toolkit/reducers/passwordReducer";

import QR from "./QR"
import Icon from 'react-native-vector-icons/Ionicons';
import { guestData } from "../redux-toolkit/reducers/parentReducer";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Contact from "./Contacts";
import Recents from "./Recents";

const { height } = Dimensions.get("window");


const GuestAccess = ({ route }) => {
  const { selectedDate, selectedStudent } = route.params ? route.params : ""
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const [data, setData] = useState(null)
  const [qrData, setQrData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState({
    name: "",
    phone: ""
  })

  const postGuest = async (values) => {
    values.studentId = selectedStudent
    if(values.frequentCount){
      delete values.frequentCount
    }
    dispatch(guestData(values))
      .unwrap()
      .then(async (response) => {
        console.log(response,"hiii")
        if (response.status === "SUCCESS") {
          values.frequentCount = response.frequentCount
          const currentDate = new Date(selectedDate);
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(0, 0, 0, 0);
          const selectedStudents = await selector?.studentsList?.filter((item) => item?.students?.studentId === values.studentId)
          const qr = []
          qr.push(selectedStudents[0])
          qr.push(`${currentDate}`)
          qr.push("Guest")
          qr.push(values);
          setQrData(qr)
          setShowModal(true)
        } else {
          alert(response.error)
        }
      })
      .catch((error) => {
        // Handle error
        console.log(error)
      });
  }


  const selector = useSelector(state => state.parentSlice)

  const [selectedIndex, setSelectedIndex] = useState(0);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("This field is required"),
    mobile: Yup.string()
      .min(10, 'Mobile Number should be 10 characters')
      .matches(/^[0-9]+$/, 'Only enter numbers')
      .required('This field is required'),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header header="Guest Access" />

      <SegmentedControl
        values={['Contacts', 'Recent', 'Manual']}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        tintColor="#3c8dbc"
        backgroundColor="white"
        paddingVertical={10}
        textColor="#007AFF"
        fontStyle={{ color: 'black' }}
        activeFontStyle={{ color: 'white' }}
        style={{ height: 40 }}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }} nestedScrollEnabled={true}>
        {selectedIndex === 0 && <Contact onValueChange={postGuest} />}
        {selectedIndex === 1 && <Recents onValueChange={postGuest} />}

        {selectedIndex === 2 && <View style={{ marginTop: 10 }}>
          <Formik
            initialValues={{
              name: "",
              mobile: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              postGuest(values)
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={{ width: "100%" }}>
                <View>
                  <TextField
                    label="Guest Name"
                    placeholder="Enter Guest Name"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor={'grey'}
                    className={styles.textField}
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 16 }}
                    error={touched.name && errors.name}
                  />
                </View>
                {touched.name && errors.name && (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                    {errors.name}
                  </Text>
                )}
                <View style={{ marginTop: 15 }}>
                  <TextField
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    onChangeText={handleChange("mobile")}
                    onBlur={handleBlur("mobile")}
                    value={values.mobile}
                    keyboardType="numeric"
                    placeholderTextColor={'grey'}
                    className={styles.textField}
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 16 }}
                    error={touched.mobile && errors.mobile}
                  />
                </View>
                {touched.mobile && errors.mobile && (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
                    {errors.mobile}
                  </Text>
                )}



                <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: "#3c8dbc", padding: 15, borderRadius: 5, marginTop: 20, alignItems: "center" }}>
                  {selector.loader ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Give Access</Text>}
                </TouchableOpacity>
              </View>


            )}
          </Formik>
        </View>}
      </ScrollView>
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

            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop: 40 }}>
              <QR qr={qrData} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height/1.05,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333333",
  },
});
export default GuestAccess;
