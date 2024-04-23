import { useNavigation } from '@react-navigation/native';
import { Image } from '@rneui/base';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';
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
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'inherit',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 25,
    height: 80,
    backgroundColor: 'rgb(74,67,236)',
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  inputBox: {
    position: 'relative',
    width: '60%',
    height: 60,
    borderRadius: 50,
    backgroundColor: 'lightgrey',
    borderWidth: 1,
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
  innerContainer: {
    display: 'flex',
    paddingHorizontal: 10,
  },
  listItem: {
    borderWidth: 2,
    width: 350,
    height: 180,
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    margin: 10,
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
    width: 350,
    height: 200,
    resizeMode: 'stretch',
  },
  cardIcons: {
    fontSize: 25,
    marginRight: 15,
    color: 'green'
  },
  dropdown: {
    margin: 5,
    height: 50,
    width: 150,
    backgroundColor: 'whitesmoke',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 8,
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
});
const Item = ({ item }: any) => {
  const nav = useNavigation<any>();
  return (
    <View key={item.id} style={styles.listItem}>
      {/* Left column */}
      <View>
        <TouchableOpacity onPress={() => nav.navigate('RoomDetailNav', {
          room: item
        })} style={{ width: '100%' }}>
          <Image style={styles.image}
            source={{ uri: item?.imageURLs[0]?.imageUrl ? item?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg" }} />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: '5%', width: '50%', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '5%' }}>
        <Text style={styles.itemText}>{item.roomName}</Text>
        <Text style={{ fontSize: 15 }}><Icon name={'people-group'} style={styles.cardIcons} />{item?.roomCapacity}</Text>
        <Text style={{ fontSize: 15 }}><Icon name={'money-bill'} style={styles.cardIcons} />{formatCurrency(item?.price)}đ/giờ</Text>
        <Text style={{ fontSize: 15 }}><Icon name={'location-dot'} style={styles.cardIcons} />{item?.address}</Text>
      </View>
    </View>
  )
};
const SelectSection = ({ foundRooms, setFoundRooms }: any) => {
  const order = [
    {
      value: 'ascPrice',
      lable: 'Giá tăng',
    },
    {
      value: 'descPrice',
      lable: 'Giá giảm',
    },
    {
      value: 'ascCap',
      lable: 'Sức chứa tăng',
    },
    {
      value: 'descCap',
      lable: 'Sức chứa giảm',
    },
  ];
  const [sortOrder, setSortOrder] = useState('');

  const sortType: any = {
    ascPrice: (a: Rooms, b: Rooms) => a.price - b.price, // Sort in ascending order (Bad -> Good)
    descPrice: (a: Rooms, b: Rooms) => b.price - a.price, // Sort in descending order (Good -> Bad)
    ascCap: (a: Rooms, b: Rooms) => a.roomCapacity - b.roomCapacity, // Sort based on original order (Time based)
    descCap: (a: Rooms, b: Rooms) => b.roomCapacity - a.roomCapacity, // Sort based on original order (Time based)
  };

  // Call the reOrderFeedbacks function with the desired order
  const reOrderFeedbacks = () => {
    if (foundRooms && sortType[sortOrder]) {
      const sortedRooms = [...foundRooms].sort(sortType[sortOrder]);
      setFoundRooms(sortedRooms);
    }
  };
  useEffect(() => {
    reOrderFeedbacks();
  }, [sortOrder]);
  useEffect(() => {
    setFoundRooms(foundRooms);
  }, [foundRooms]);
  return (
    <SelectCountry
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      maxHeight={200}
      value={sortOrder}
      data={order}
      imageField=''
      placeholder='Sắp xếp theo'
      valueField="value"
      labelField="lable"
      onChange={e => {
        setSortOrder(e.value);
      }}
    />
  );
};
export default function RoomSearch() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [foundRooms, setFoundRooms] = useState<Rooms[]>([]);
  const search = async () => {
    try {
      if (searchTerm && searchTerm?.replace(/\s/g, "") == '') {
        setFoundRooms([])
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
  const renderItem = ({ item, index }: any) => {
    return <Item item={item} />;
  };
  return (
    <View style={styles.container}>
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
        {foundRooms && <SelectSection foundRooms={foundRooms} setFoundRooms={setFoundRooms} />}
      </View>
      <ScrollView horizontal={true}>
        <FlatList nestedScrollEnabled={true}
          data={foundRooms}
          keyExtractor={(item, index) => index.toString()}
          style={styles.innerContainer}
          ListEmptyComponent={<Image style={styles.notFoundImg}
            source={{ uri: 'https://www.cloudconsult.ca/public/no-search-found.png' }} />}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  )
}