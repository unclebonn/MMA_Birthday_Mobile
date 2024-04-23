import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/base';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

//Duy's
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
            height: '80%',
            margin: '2%',
        },
        textHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '5%'
        },
        regularText: {
            fontSize: 20,
            color: "grey",
            fontStyle: "italic",
        },
        inputBox: {
            width: '100%',
            height: 60,
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
            marginRight: 15,
            color: 'green'
        },
        notFoundImg: {
            width: '100%',
            height: 200,
            resizeMode: 'stretch',
        },
    });


    const [rooms, setRooms] = useState<Rooms | null>(null);

    async function fetchRooms() {
        try {
            console.log('fetching');
            const res = await axios.get(roomUrl);
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
                <SearchBar containerStyle={styles.inputBox}
                    inputContainerStyle={{ backgroundColor: 'inherit' }}
                    placeholder="Nhập tên phòng..."
                    onFocus={() => nav.navigate('RoomSearchNav')}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.textHeader}>
                    <Text style={styles.regularText}>Các phòng hiện tại</Text>
                    <TouchableOpacity>
                        <Text style={styles.regularText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal style={{ height: 450, marginBottom: '5%' }}>
                    {(rooms && rooms.length > 0) ? rooms.map((room: Rooms) => (
                        <Card key={room?.id} containerStyle={styles.cardContainer}>
                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity onPress={() => nav.navigate('RoomDetailNav', {
                                    room: room
                                })} style={{ width: '100%' }}>
                                    <Image
                                        style={{ width: "100%", height: 150, marginVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'blue' }}
                                        resizeMode="stretch"
                                        source={{ uri: room?.imageURLs[0]?.imageUrl ? room?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg" }}
                                    />
                                </TouchableOpacity>
                                <Card.Title style={{ height: '15%', textAlign: 'center', fontSize: 15, fontStyle: 'italic' }} >{room?.roomName}</Card.Title>
                                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
                                    <Text><Icon name={'people-group'} style={styles.cardIcons} />{room?.roomCapacity}</Text>
                                    <Text ><Icon name={'money-bill'} style={styles.cardIcons} />{formatCurrency(room?.price)}đ/giờ</Text>
                                </View>
                                <Text style={{ width: '90%' }}><Icon name={'location-dot'} style={styles.cardIcons} />{room?.address}</Text>
                            </View>
                        </Card>
                    ))
                        : <Image style={styles.notFoundImg}
                            source={{ uri: 'https://www.cloudconsult.ca/public/no-search-found.png' }} />
                    }
                </ScrollView>
                <View style={{ display: 'flex', height: 200 }}>
                    <Image style={{ borderWidth: 2, borderColor: 'black', borderRadius: 50, width: '100%', height: '100%', resizeMode: 'stretch' }}
                        source={{ uri: 'https://th.bing.com/th/id/OIP.DS99NICY4syEu8BZ-83z9wHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7' }} />
                    <View style={{ width: '70%', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '25%', left: '15%', backgroundColor: 'rgba(138, 173, 143, 0.8)', transform: [{ rotateX: '40deg' }, { rotateZ: '20deg' }] }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', color: 'yellow' }}>Ở đâu có tiệc</Text>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', color: 'yellow' }}>Ở đó có chúng tui</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}