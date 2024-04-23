import { Image } from '@rneui/base';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Anh Khôi + Zwee
const serviceUrl = 'https://party-renting-platform-aa30573d1765.herokuapp.com/api/services'
type Services = {
    id: number,
    serviceName: string,
    price: number,
    description: string
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardIcons: {
        fontSize: 25,
        marginLeft: 15,
        color: 'green'
    },
})
export default function RoomDetails({ route }: any) {
    const { room } = route.params;
    console.log(room)
    const [services, setServices] = useState<Services[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedServices, setSelectedServices] = useState<Services[]>([]);

    const handleServiceSelect = (service: Services) => {
        if (selectedServices.some((selectedService) => selectedService.id === service.id)) {
            setSelectedServices((prevSelectedServices) =>
                prevSelectedServices.filter((selectedService) => selectedService.id !== service.id)
            );
            setServices((prevSelectedServices) => [...prevSelectedServices, service]);
        } else {
            setSelectedServices((prevSelectedServices) => [...prevSelectedServices, service]);
            setServices(services.filter((existedService) => existedService.id !== service.id))
        }
    };
    const renderServiceItem = ({ item }: { item: Services }) => (
        <View style={{ marginVertical: '5%' }}>
            <TouchableOpacity
                style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
                onPress={() => handleServiceSelect(item)}
            >
                <Text>{item.serviceName}</Text>
                <Text>Price: ${item.price}</Text>
            </TouchableOpacity>
        </View>
    );
    async function fetchServices() {
        try {
            const res = await axios.get(serviceUrl);
            setServices(res.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchServices()
    }, [])
    return (
        <ScrollView style={styles.container}>
            <View style={{ margin: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    style={{ width: 350, height: 250, borderRadius: 20, borderWidth: 1, borderColor: 'blue' }}
                    resizeMode="stretch"
                    source={{ uri: room?.imageURLs[0]?.imageUrl ? room?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg" }}
                />
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{room.roomName}</Text>
                <Text><Icon name={'location-dot'} style={styles.cardIcons} />{room.address}</Text>
                <Text><Icon name={'info'} style={styles.cardIcons} />{room.description}</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Đặt dịch vụ" onPress={() => setModalVisible(true)} />

                <Modal visible={modalVisible} animationType="slide" >
                    <View style={{ height: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                            Danh sách các dịch vụ
                        </Text>
                        <FlatList
                            data={services}
                            renderItem={renderServiceItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <Button title="Hoàn tất chọn" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>

                {/* Render selected services */}
                <View style={{ marginVertical: 20 }}>
                    {(selectedServices && selectedServices.length > 0) &&
                        <>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Các dịch vụ đã chọn:</Text>
                            {selectedServices.map((service) => (
                                <View key={service.id} style={{ flexDirection: 'row', backgroundColor: 'green', padding: '5%', margin: 5, borderRadius: 50 }}>
                                    <Text key={service.id}>{service.serviceName}</Text>
                                    <TouchableOpacity onPress={() => handleServiceSelect(service)}><Text>X</Text></TouchableOpacity>
                                </View>
                            ))}
                        </>
                    }
                </View>
            </View>
            <TouchableOpacity onPress={() => { }}><Button title='Đặt tiệc' /></TouchableOpacity>
        </ScrollView>
    )
}