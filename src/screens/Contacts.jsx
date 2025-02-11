import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput
} from "react-native";
import Button from "../components/Button";
import { useIsFocused } from "@react-navigation/native";
import * as Contacts from 'expo-contacts';
import Icon from 'react-native-vector-icons/Ionicons';



export default function Contact({ onValueChange }) {
  const isFocused = useIsFocused();
  const [permissionstatus, setPermissionStatus] = useState("")
  const [userContacts, setUserContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermissionStatus(status)
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        const formattedContacts = data.map((contact) => ({
          name: contact.name || 'Unknown',
          phone: contact.phoneNumbers && contact.phoneNumbers[0] ? contact.phoneNumbers[0].number : 'No Phone Number',
        }));
        setUserContacts(formattedContacts)
        setFilteredContacts(formattedContacts)
      }
    }
  }

  const handleSearch = (text) => {
    setSearchText(text);
    if(text){
      const filteredData = userContacts.filter((item) =>{
        const number = cleanPhoneNumber(item.phone)
        console.log(number)
      const name = item?.name?.toLowerCase() || "";
      const mobile =number.toString()|| "";
      return name.includes(text.toLowerCase()) || mobile.includes(text);
    });
    console.log(filteredData.length)
      setFilteredContacts(filteredData);
    }else{
      setFilteredContacts(userContacts)
    }
    
  };

  useEffect(() => {
    if (isFocused) {
      getContacts()
    }
  }, [isFocused]);
  function cleanPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
  }

  const shareContact = async (selectedContact) => {
    const cleanedPhoneNumber = await cleanPhoneNumber(selectedContact.phone);
    const selectedValue = {
      name: selectedContact.name,
      mobile: cleanedPhoneNumber,
    }
    onValueChange(selectedValue)
  }

  return (
    <View>
       <TextInput
        style={styles.searchBar}
        placeholder="Search by name or mobile"
        value={searchText}
        onChangeText={handleSearch}
      />
      {permissionstatus === "granted" ?
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => shareContact(item)}>
              <Icon name="person-circle-outline" size={35} color={"#000000"}/>
              <View style={{marginLeft:10}}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>

            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12 }} >No Contacts</Text>
            </View>
          )}
        />
        : <View style={styles.container}>
          <Text style={styles.message}>We need your permission to Contacts</Text>
          <Button onPress={() => { Linking.openSettings(); getContacts() }}> {"Grant permission"}</Button>
        </View>}
    </View>
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
