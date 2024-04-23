import { Image } from '@rneui/base';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dialog, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'toastify-react-native';




// Anh Khôi + Zwee
const roomDetailUrl = 'https://party-renting-platform-aa30573d1765.herokuapp.com/api/rooms/customer/details/'
export type Services = {
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
export default function RoomDetails({ route, navigation }: any) {

    const { room } = route.params
    const roomid = room.id

    const [roomDetail, setRoomDetail] = useState<any>([]);

    const [quantityMap, setQuantityMap] = useState<{ [key: string]: number }>({});

    const [serviceList, setServiceList] = useState<any>()

    const [totalFees, setTotalFees] = useState<number>() // tổng tiền dịch vụ

    //date
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [startDate, setStartDate] = useState("")

    //time start
    const [showPickerTimeStart, setShowPickerTimeStart] = useState<boolean>(false)
    const [timeStart, setTimeStart] = useState(new Date())
    const [startTime1, setStartTime1] = useState("")


    //time end
    const [showPickerTimeEnd, setShowPickerTimeEnd] = useState<boolean>(false)
    const [timeEnd, setTimeEnd] = useState(new Date())
    const [endTime1, setEndTime1] = useState("")





    const totalDatePicker = () => {
        setShowPicker(!showPicker)
    }
    const toggleTimeStart = () => {
        setShowPickerTimeStart(!showPickerTimeStart)
    }
    const toggleTimeEnd = () => {
        setShowPickerTimeEnd(!showPickerTimeEnd)
    }


    const navigate = useNavigation()


    const handleIncrementQuantity = (serviceId: string | number) => {
        setQuantityMap((prevMap) => ({
            ...prevMap,
            [serviceId]: (prevMap[serviceId] || 0) + 1,
        }));
    };


    // Function to decrement quantity for a specific service
    const handleDecrementQuantity = (serviceId: string | number) => {
        setQuantityMap((prevMap) => ({
            ...prevMap,
            [serviceId]: Math.max((prevMap[serviceId] || 0) - 1, 0),
        }));
    };


    const selectedServicesArray = Object.keys(quantityMap).map(serviceId => ({
        serviceId: serviceId,
        serviceQuantity: quantityMap[serviceId],
    }));

    const [visible, setVisible] = useState(false);

    const getDetailRoom = async () => {
        await axios.get(`${roomDetailUrl}${roomid}`)
            .then((res) => {
                if (res.status === 200) {
                    setRoomDetail(res.data)
                    setServiceList(res.data.services)
                }
            })
    }

    const totalFee = () => {
        let totalFee = 0;
        selectedServicesArray.map((selectedService: any) => {
            let tmp = serviceList?.find((item: any) => item.id == parseInt(selectedService.serviceId))?.price;
            totalFee += tmp * selectedService.serviceQuantity;
        }

        )



        setTotalFees(totalFee)
    }


    const submitData = () => {
        const data = {
            bookingDetails: selectedServicesArray,
            startTime: `${startDate} ${timeStart.getHours()}:00:00`,
            endTime: `${startDate} ${timeEnd.getHours()}:00:00`,
            price: (totalFees! + (roomDetail.price * timeEnd.getHours() - timeStart.getHours())),
            bookTime: new Date(),
            status: "APPROVING",
            customerName: "baba2",
            roomId: String(roomid)
        }

        axios.post("https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/customer", data)
            .then((res) => {
                if (res.status === 201) {
                    Toast.success("Đặt phòng thành công")
                    navigation.navigate("Home")
                }

            })
            .catch((eror) => {
                Toast.error("Đặt phòng thất bại","top")
            })



    }


    const renderService = ({ item }: any) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text>{item.serviceName}</Text>
                    <Text>Giá tiền: {item.price}</Text>
                    <Text>Số lượng: {quantityMap[item.id] > 0 ? quantityMap[item.id] : 0}</Text>
                </View>
                <View>
                    <Ionicons onPress={() => handleIncrementQuantity(item.id)} name="add-circle-outline" size={25} />
                    <Ionicons onPress={() => handleDecrementQuantity(item.id)} name="remove-circle-outline" size={25} />

                </View>
            </View>
        )
    }

    const onChangeDateStart = ({ type }: any, selectedDate: any) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate)

            if (Platform.OS === "android") {
                totalDatePicker();
                setStartDate(formatDate(currentDate));
            }
        } else {
            totalDatePicker()
        }
    }
    const onChangeTimeStart = ({ type }: any, selectedTimeStart: any) => {
        console.log(selectedTimeStart);

        if (type == "set") {
            const currentTimeStart = selectedTimeStart;
            setTimeStart(currentTimeStart)

            if (Platform.OS === "android") {
                toggleTimeStart()
                setStartTime1(formatTime(currentTimeStart));
            }
        } else {
            toggleTimeStart()
        }
    }
    const onChangeTimeEnd = ({ type }: any, selectedTimeEnd: any) => {
        console.log(selectedTimeEnd);


        if (type == "set") {
            const currentTimeEnd = selectedTimeEnd;
            setTimeEnd(currentTimeEnd)

            if (Platform.OS === "android") {
                toggleTimeEnd()
                setEndTime1(formatTime(currentTimeEnd));
            }
        } else {
            toggleTimeEnd()
        }
    }

    const formatDate = (rawDate: string) => {
        let date = new Date(rawDate)

        let year = date.getFullYear();
        let month = date.getMonth() + 1
        let day = date.getDate();

        return `${year}-${month < 10 ? `0${month}` : month}-${day}`
    }
    const formatDateReverse = (rawDate: string) => {
        let date = new Date(rawDate)

        let year = date.getFullYear();
        let month = date.getMonth() + 1
        let day = date.getDate();

        return `${year}-${month}-${day}`
    }


    const formatTime = (rawDate: string) => {
        let date = new Date(rawDate)

        let hour = date.getHours();
        let minute = date.getMinutes()
        let time = date.getTime()

        return `${hour}:${minute < 10 ? `0${minute}` : minute}`
    }

    useEffect(() => {
        totalFee()
    }, [quantityMap])

    useEffect(() => {
        getDetailRoom()
    }, [])

    return (
        <>
            <Dialog
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
            >
                <Dialog.Title title="Dịch vụ đính kèm" />
                <FlatList
                    data={roomDetail.services as Services[]}
                    renderItem={renderService}
                >

                </FlatList>
            </Dialog>
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

                <View>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ width: "50%", margin: "auto" }}>
                            <Button title="Đặt dịch vụ" onPress={() => setVisible(!visible)} />
                        </View>

                    </View>

                    <Pressable
                        onPress={totalDatePicker}
                    >
                        <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-evenly", margin: 10 }}>
                            <Text style={{ paddingTop: 13 }}>Chọn ngày bắt đầu: </Text>
                            <TextInput
                                style={{ textAlign: "center", flex: 1, borderWidth: 2, borderColor: "grey", padding: 10, borderRadius: 10, color: "black" }}
                                placeholder='Sat Aug 21 2004'
                                editable={false}
                                value={startDate}
                                onChangeText={setStartDate}
                            >

                            </TextInput>
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => setShowPickerTimeStart(!showPickerTimeStart)}
                    >
                        <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-evenly", margin: 10 }}>
                            <Text style={{ paddingTop: 13 }}>Chọn giờ bắt đầu: </Text>
                            <TextInput
                                style={{ textAlign: "center", flex: 1, borderWidth: 2, borderColor: "grey", padding: 10, borderRadius: 10, color: "black" }}
                                placeholder='11:00Am'
                                editable={false}
                                value={startTime1}
                                onChangeText={setStartTime1}
                            >

                            </TextInput>
                        </View>
                    </Pressable>



                    <Pressable
                        onPress={() => setShowPickerTimeEnd(!showPickerTimeEnd)}
                    >
                        <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-evenly", margin: 10 }}>
                            <Text style={{ paddingTop: 13 }}>Chọn giờ kết thúc: </Text>
                            <TextInput
                                style={{ textAlign: "center", flex: 1, borderWidth: 2, borderColor: "grey", padding: 10, borderRadius: 10, color: "black" }}
                                placeholder='11:00Am'
                                editable={false}
                                value={endTime1}
                                onChangeText={setEndTime1}
                            >

                            </TextInput>
                        </View>
                    </Pressable>


                    {(startDate != "" && startTime1 != "" && endTime1 != "") ?

                        <View style={{ margin: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bảng giá chi tiết</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text>Giá phòng: </Text>
                                <Text style={{ color: "red" }}>{roomDetail.price.toLocaleString("vi-VN")}đ</Text>

                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text>Thời gian đặt phòng: </Text>
                                <Text style={{ color: "red" }}>{timeEnd.getHours() - timeStart.getHours()} tiếng</Text>

                            </View>
                            <View >
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Các dịch vụ đi kèm đã chọn</Text>
                                {selectedServicesArray.map((service) => {
                                    return (
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }} key={service.serviceId}>
                                            <Text>
                                                {serviceList.find((item: any) => item.id === parseInt(service.serviceId))?.serviceName}
                                            </Text>
                                            <Text key={service.serviceId}>
                                                Số lượng: {quantityMap[service.serviceId] > 0 ? quantityMap[service.serviceId] : 1}
                                            </Text>
                                        </View>
                                    )
                                })}
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontWeight: "bold" }}>Tổng tiền dịch vụ: </Text>
                                    <Text style={{ color: "red" }}>{totalFees?.toLocaleString("vi-VN")}đ</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Tổng tiền: </Text>
                                <Text style={{ fontSize: 17, fontWeight: "bold", color: "red" }}>{(totalFees! + (roomDetail.price * timeEnd.getHours() - timeStart.getHours())).toLocaleString("vi-VN")}đ</Text>
                            </View>
                        </View>

                        :
                        <></>
                    }

                    {
                        showPicker && (
                            <DateTimePicker
                                onChange={onChangeDateStart}
                                onTouchCancel={() => setShowPicker(false)}
                                value={date}
                                mode='date'
                                display='spinner'
                                minimumDate={new Date()}
                            />
                        )
                    }
                    {
                        showPickerTimeStart && (
                            <DateTimePicker
                                onChange={onChangeTimeStart}
                                onTouchCancel={() => setShowPickerTimeStart(false)}
                                value={timeStart}
                                mode='time'
                                display='spinner'

                            />
                        )
                    }
                    {
                        showPickerTimeEnd && (
                            <DateTimePicker
                                onChange={onChangeTimeEnd}
                                onTouchCancel={() => setShowPickerTimeEnd(false)}
                                value={timeEnd}
                                mode='time'
                                display='spinner'

                            />
                        )
                    }

                </View>
                <TouchableOpacity><Button onPress={() => submitData()} title='Đặt tiệc' /></TouchableOpacity>
            </ScrollView>
        </>
    )
}