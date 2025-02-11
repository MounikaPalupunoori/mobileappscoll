import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import Header from "../components/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from 'react-native-paper';



export default function ChangeMode() {

  const [selectedMode, setSelectedMode] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const modes = [
    {
      id: '1',
      label: 'Drive up',
      value: 'drive',
      color: '#3c8dbc',
    },
    {
      id: '2',
      label: 'Walk up',
      value: 'walk',
      color: '#3c8dbc',
    },
  ]

  const getMode = async () => {
    const mode = await AsyncStorage.getItem("mode")
    if (mode && mode !== "") {
      setSelectedMode(mode)
    } else {
      setSelectedMode("1")
    }
  }

  useEffect(() => {
    getMode()
  }, [])

  const handleChange = async (value) => {
    setSelectedMode(value)
    await AsyncStorage.setItem("mode", value)
    setSnackbarVisible(true)
  }

  const onDismissSnackBar = () => setSnackbarVisible(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header header="Change Mode" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: "center", marginTop: 5 }}
        style={{ height: '100%', width: "100%" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{
          width: "90%", 
          marginTop: 20,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: { x: 0, y: 10 },
          shadowOpacity: 0.5,
          backgroundColor: "white",
          borderRadius: 5,
          elevation: 5, 
          paddingVertical: 10,
           paddingHorizontal: 5
        }}>
          <Text style={{ fontSize: 20, color: "#3c8dbc", marginVertical: 15, paddingLeft: 10 }}>Select a Mode</Text>
          <RadioGroup
            radioButtons={modes}
            onPress={(id) => {
              handleChange(id)
            }}
            selectedId={selectedMode}
            layout='column'
            containerStyle={{
              justifyContent: "space-around",
              alignItems: "flex-start",
              height: 100
            }}
            labelStyle={{
              fontSize: 14,
              fontWeight: 500,
            }}
          />
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "close",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        Mode changed successfully
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  },
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
  contactItem: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    fontSize: 16,
  },
});
