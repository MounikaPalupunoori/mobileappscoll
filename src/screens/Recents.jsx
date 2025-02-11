import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getRecentGuests } from "../redux-toolkit/reducers/parentReducer";
import HomeSkeletonLoader from "../components/Loaders/HomeSkeletonLoader";
import { MaterialIcons } from "@expo/vector-icons";



export default function Recents({ onValueChange }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [recents, setRecents] = useState([])
  const selector = useSelector(state => state.parentSlice)
  const [filteredRecents, setFilteredRecents] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (isFocused) {
      dispatch(getRecentGuests())
        .unwrap()
        .then(async (response) => {
          if (response.status === "SUCCESS") {
            setRecents(response.result)
            setFilteredRecents(response.result);
          } else {
            alert(response.error)
          }
        })
        .catch((error) => {
          // Handle error
          console.log(error)
        });
    }
  }, [isFocused]);

  const shareContact = async (selectedContact) => {
    const selectedValue = {
      name: selectedContact.name,
      mobile: selectedContact.mobile,
    }
    onValueChange(selectedValue)
  }

  const handleSearch = (text) => {
    setSearchText(text);
    if(text){
      const filteredData = filteredRecents.filter((item) =>{
      const name = item.name?.toLowerCase() || "";
      const mobile = item.mobile?.toString() || "";
      return name.includes(text.toLowerCase()) || mobile.includes(text);
    });
      console.log(filteredData,"jjjj")
      setFilteredRecents(filteredData);
    }else{
      setFilteredRecents(recents)
    }
    
  };


  return (
     <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or mobile"
        value={searchText}
        onChangeText={handleSearch}
      />
      {selector?.loader ? <HomeSkeletonLoader total={3} count={6} /> : <FlatList
        data={filteredRecents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} onPress={() => shareContact(item)}>
            <View>
            <MaterialIcons
              name="history"
              size={30}
              color="#000000"
            />
            </View>
            <View style={{marginLeft:10}}> 
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.mobile}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12 }} >No Recents</Text>
          </View>
        )}
      />}
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
  contactItem: {
    flex:1,
    width:"100%",
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
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
