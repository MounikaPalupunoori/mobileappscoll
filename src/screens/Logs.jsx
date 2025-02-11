import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header/Header";
import { Ionicons } from "@expo/vector-icons";
import { getLogs } from "../redux-toolkit/reducers/staffReducer";
import moment from "moment";
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";


const Logs = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.staffSlice)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(getLogs())
  }, [])

  useMemo(() => {
    setData(selector.logs)
  }, [selector.logs])



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header header="Logs" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop: 5 }}
        style={{ height: '100%', width: "100%" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {selector.loader ? <HomeSkeletonLoader total={5} count={4} /> :
          <View style={{ flex: 1, width: "100%", justifyContent: "flex-start", alignItems: "center", marginTop: 10, paddingBottom: 5 }}>
            {data && data.length > 0 && data.map((log, index) => (
              <View
                style={styles.card}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 40,
                    paddingHorizontal: 10
                  }}
                >
                  <Text style={styles.cardText}>
                    {log?.students.firstName ? log?.students.firstName + " " : ""}{log?.students?.lastName ? log?.students?.lastName : ""}{log?.students.studentId ? `(${log?.students.studentId})` : ""}
                  </Text>
                  <Text style={[styles.cardText, { color: log.approvalStatus === "Reject" ? "red" :  log.approvalStatus === "Released" ? "#F28500": "green" }]}>
                  {log.approvalStatus === "Reject" ? "Rejected" : log.approvalStatus === "Released" ? "Released":"Pickedup"}
                  </Text>
                </View>
                <View style={{ flex:1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 5 }}>
                  <View
                    style={{
                      flex:0.5,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: 5
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Student Details : </Text>
                    <Text style={{ marginTop: 5 }}>Class : {log?.students?.grade ? log?.students?.grade : ""}{log?.students?.group ? "-" + log?.students?.group : ""}</Text>
                    <Text style={{ marginTop: 5 }}>Gender : {log?.students?.gender ? log?.students?.gender : ""}</Text>
                  </View>
                  <View
                    style={{
                      flex:0.5,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: 5
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{log.approvalStatus === "Reject" ? "Rejected" : log.approvalStatus === "Released" ? "Released":"Pickedup"} on : </Text>
                    <Text style={{ marginTop: 5 }}>{moment(log.createdAt).format('DD-MMM-YYYY, HH:mm')}</Text>
                  </View>
                </View>
                <View style={{ flex:1,flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 5 }}>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: 5,
                    flex:0.5,
                  }}
                >
                  {log?.relationType !== "Guest" ?
                    <>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Picked up by : </Text>
                      <Text style={{ marginTop: 5 }}>Name : {log?.parents?.firstName ? log?.parents?.firstName + " " + log?.parents?.lastName : ""}</Text>
                      {log?.parents?.mobile ? <Text style={{ marginTop: 5 }}>Mobile : {log?.parents?.mobile ? log?.parents?.mobile : ""}</Text> : null}
                      <Text style={{ marginTop: 5 }}>Relation : {log?.parents?.relation ? log?.parents?.relation : ""}</Text>
                    </>
                    : <>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Picked up by : </Text>
                      <Text style={{ marginTop: 5 }}>Name : {log?.guests?.name ? log?.guests?.name : ""}</Text>
                      {log?.guests?.mobile ? <Text style={{ marginTop: 5 }}>Mobile : {log?.guests?.mobile ? log?.guests?.mobile : ""}</Text> : null}
                      <Text style={{ marginTop: 5 }}>Relation : Guest</Text>
                    </>}


                </View>
                </View>
              </View>
            ))}

            {data && data.length === 0 ?
              <View style={{ height: "100%", width: "100%", flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No Logs</Text>
              </View> : null}

          </View>
        }

      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textField: {
    height: Platform.OS === "ios" ? 45 : 50,
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    elevation: 10,
    paddingVertical: 10,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { x: 0, y: 11 },
    shadowOpacity: 0.5,
    borderRadius: 5,
    width: "95%",
    gap: 10,
    marginTop: 10,
    marginBottom: 5
  },
  cardText: {
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "bold",
  },
});
export default Logs;
