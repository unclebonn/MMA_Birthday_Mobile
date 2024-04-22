import { useNavigation } from '@react-navigation/native';
import { Image, Input } from '@rneui/base';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Duy
const roomSearchUrl = 'https://party-renting-platform-aa30573d1765.herokuapp.com/api/rooms/customer/search'
const roomUrl = 'https://party-renting-platform-aa30573d1765.herokuapp.com/api/rooms/customer'
interface Rooms {
  id: string,
  roomName: string,
  roomCapacity: number,
  price: number,
  address: string,
  imageURLs: any,
  length: number,
  map: FunctionComponent
};
function formatCurrency(value: number) {
  // Convert the value to a string
  const stringValue = value.toString();

  // Split the string into integer and decimal parts
  const [integerPart, decimalPart] = stringValue.split('.');

  // Add thousands separators to the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine the integer and decimal parts
  const formattedValue = decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;

  return formattedValue;
}
export default function RoomSearch() {
  const nav = useNavigation<any>();
  const styles = StyleSheet.create({
    header: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 15,
      height: 100,
      backgroundColor: 'rgb(74,67,236)',
      borderBottomStartRadius: 25,
      borderBottomEndRadius: 25,
    },
    inputBox: {
      width: '80%',
      borderRadius: 50,
      backgroundColor: 'lightgrey',
      borderWidth: 1,
      margin: 12,
      color: 'white',
    },
    button: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 25,
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: 16,
    },
    listItem: {
      borderWidth: 2,
      height: 180,
      flexDirection: 'row',
      backgroundColor: 'whitesmoke',
      margin: 8,
      borderRadius: 10,
      padding: '1%',

    },
    itemText: {
      textAlign: 'center',
      paddingHorizontal: '5%',
      color: 'black',
    },
    image: {
      borderRadius: 50,
      width: 150,
      height: '100%',
      resizeMode: 'stretch',
    },
    notFoundImg: {
      width: '100%',
      height: 200,
      resizeMode: 'stretch',
    },
    cardIcons: {
      fontSize: 25,
      marginRight: 15,
      color: 'green'
    }
  });
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [foundrooms, setFoundRooms] = useState<Rooms | null>(null);
  const search = async () => {
    try {
      if (searchTerm && searchTerm?.replace(/\s/g, "") == '') {
        setFoundRooms(null)
      } else
        if (searchTerm == null) {
          await axios.get(roomUrl)
            .then((data) => {
              setFoundRooms(data.data)
            });
        } else {
          await axios.get(`${roomSearchUrl}?roomName=${searchTerm || ''}`)
            .then((data) => {
              setFoundRooms(data.data)
            });
        }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <ScrollView>
      <View style={styles.header}>
        <SearchBar containerStyle={styles.inputBox}
          inputContainerStyle={{ backgroundColor: 'inherit' }}
          placeholder="Nhập tên phòng..."
          onChangeText={(e) => setSearchTerm(e || null)}
          showCancel={true}
          onCancel={() => setSearchTerm(null)}
          onClear={() => {
            search()
          }
          }
          onSubmitEditing={(e) => search()}
          value={searchTerm || ''}
        />
        <TouchableOpacity style={styles.button} onPress={() => { }}>
          <Text style={styles.text}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>
      {/* <FlatList
                data={filteredWatches}
                keyExtractor={(item, index) => index.toString()}
                style={menuStyles.innerContainer}
                renderItem={renderItem}
            /> */}
      {(foundrooms && foundrooms.length > 0) ? foundrooms.map((room: Rooms) => (
        <View key={room.id} style={styles.listItem}>
          {/* Left column */}
          <View>
            <TouchableOpacity onPress={() => nav.navigate('RoomDetailNav')} style={{ width: '100%' }}>
              <Image style={styles.image}
                source={{ uri: room?.imageURLs[0]?.imageUrl ? room?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg" }} />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: '5%', width: '50%', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '5%' }}>
            <Text style={styles.itemText}>{room.roomName}</Text>
            <Text style={{ fontSize: 15 }}><Icon name={'people-group'} style={styles.cardIcons} />{room?.roomCapacity}</Text>
            <Text style={{ fontSize: 15 }}><Icon name={'money-bill'} style={styles.cardIcons} />{formatCurrency(room?.price)}đ/giờ</Text>
            <Text style={{ fontSize: 15 }}><Icon name={'location-dot'} style={styles.cardIcons} />{room?.address}</Text>
          </View>
        </View>
      ))
        :
        <Image style={styles.notFoundImg}
          source={{ uri: 'https://www.cloudconsult.ca/public/no-search-found.png' }} />
      }
    </ScrollView>
  )
}