import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/base';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

//Duy's
const roomUrl = 'https://party-renting-platform-aa30573d1765.herokuapp.com/api/rooms/customer'
interface Rooms {
    id: string,
    roomName: string,
    roomCapacity: number,
    price: number,
    address: string,
    imageURLs: ArrayBuffer,
    length: number,
    map: FunctionComponent
};

export default function HomePageScreen() {
    const nav = useNavigation<any>();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "whitesmoke"
        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 15,
            height: 100,
            backgroundColor: 'rgb(74,67,236)',
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
        },
        content: {
            margin: '5%',
        },
        textHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
        },
        regularText: {
            fontSize: 20,
            color: "grey",
            fontStyle: "italic",
        },
        inputBox: {
            width: '80%',
            margin: 12,
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            fontSize: 16,
            borderColor: '#EDEFEE',
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
        cardContainer: {
            width: 250,
            height: '90%',
            backgroundColor: 'lightyellow',
            borderRadius: 25,
            borderWidth: 2,
            borderColor: 'grey'
        },
        cardIcons: {
            fontSize: 25,
            color: 'green'
        }
    });


    const [rooms, setRooms] = useState<Rooms | null>(null);

    async function fetchRooms() {
        try {
            console.log('fetching');
            const res = await axios.get(roomUrl);
            console.log(res.data);
            setRooms(res.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchRooms()
    }, [])
    return (
        <ScrollView indicatorStyle='white' showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    keyboardType='email-address'
                    inputMode='text'
                    onFocus={() => nav.navigate('RoomSearchNav')}
                    style={styles.inputBox}
                    // value={user.email}
                    // onChangeText={(e) => setUser({ ...user, email: e })}
                    placeholder={'Search...'}
                    clearButtonMode='always'
                />
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                    <Text style={styles.text}>Bộ lọc</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.textHeader}>
                    <Text style={styles.regularText}>Các phòng hiện tại</Text>
                    <TouchableOpacity>
                        <Text style={styles.regularText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal>
                    {(rooms && rooms.length > 0) ? rooms.map(room => (
                        <Card key={room?.id} containerStyle={styles.cardContainer}>
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    style={{ width: "100%", height: 150, marginVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'blue' }}
                                    resizeMode="stretch"
                                    source={{ uri: room?.imageURLs[0]?.imageUrl ? room?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg" }}
                                />
                                <Card.Title style={{ height: '15%', textAlign: 'center', fontSize: 15, fontStyle: 'italic' }} >{room?.roomName}</Card.Title>
                                <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
                                    <Text><Icon name={'people-group'} style={styles.cardIcons} />{room?.roomCapacity}</Text>
                                    <Text ><Icon name={'money-bill'} style={styles.cardIcons} />{room?.price}</Text>
                                </View>
                                <Text style={{ width: '80%' }}><Icon name={'location-dot'} style={styles.cardIcons} />{room?.address}</Text>
                            </View>
                        </Card>
                    ))
                        : <Text>Chưa tìm thấy phòng</Text>
                    }
                </ScrollView>
            </View>
            <Card>
                <Card.Title>Hello Mother Father</Card.Title>
            </Card>
        </ScrollView>
    )
}