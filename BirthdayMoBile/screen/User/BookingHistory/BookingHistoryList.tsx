import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios, { AxiosResponse } from 'axios';
import { Card } from '@rneui/base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Skeleton } from '@rneui/themed';
import { handleBookingDetailsId } from '../../../utils/zuestand';

function formatVNPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function formatVNDate(rawDate: string): string {
  const date = new Date(rawDate);
  const formattedDate = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${formattedDate}, ${formattedTime}`;
}

const bookingStatusColor = {
  ACCEPTED: { background: 'rgba(32, 137, 220, 0.15)', text: 'rgba(32, 137, 220, 1)' },
  APPROVING: { background: 'rgba(3, 148, 135, 0.15)', text: 'rgba(3, 148, 135, 1)' },
  REJECTED: { background: 'rgba(255, 25, 12, 0.15)', text: 'rgba(255, 25, 12, 1)' },
  SUCCESS: { background: 'rgba(100, 215, 83, 0.15)', text: 'rgba(100, 215, 83, 1)' },
  CANCEL: { background: 'rgba(250, 173, 20, 0.15)', text: 'rgba(250, 173, 20, 1)' },
};

type BookingStatusType = {
  status: keyof typeof bookingStatusColor;
};

function BookingStatus({ status }: BookingStatusType) {
  const styles = StyleSheet.create({
    statusWrapper: {
      width: '30%',
      alignItems: 'center',
      padding: 10,
      backgroundColor: bookingStatusColor[status].background,
    },
    statusInfo: {
      color: bookingStatusColor[status].text,
      fontWeight: 'bold',
    },
  });
  return (
    <View style={styles.statusWrapper}>
      <Text style={styles.statusInfo}>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Text>
    </View>
  );
}

function BookingSkelection() {
  return (
    <Card>
      <Skeleton width={300} height={24} />
      <View style={{ marginTop: 10, marginBottom: 10, gap: 5 }}>
        <Skeleton width={200} height={22} />
        <Skeleton width={125} height={22} />
        <Skeleton width={200} height={22} />
      </View>
      <Skeleton width={110} height={36} />
    </Card>
  );
}

let prePage = 0;
function getApiUrl(page: number): string {
  prePage = page;
  return `https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/customer?page=${page}&size=4&sort=startTime,desc`;
}

function BookingHistoryList() {
  const [state, setState] = useState('initial');
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const setBookingId = handleBookingDetailsId((state) => state.setBookingId);

  useFocusEffect(
    useCallback(() => {
      setState('mounted');
      return () => {
        setState('initial');
      };
    }, [])
  );

  useEffect(() => {
    if (state == 'initial') {
      prePage = 0;
      setPage(0);
      setData([]);
      setLoading(false);
    } else {
      (async () => {
        setLoading(() => true);
        await handlegetBookingData();
      })();
    }
  }, [state]);

  const handlegetBookingData = async () => {
    try {
      const response: AxiosResponse = await axios.get(getApiUrl(page));
      if (response.data && response.data.length > 0) {
        // console.log('//////////////////Fetch bookings at page: ' + page + '//////////////////');
        const newData = [...data, ...response.data] as any;
        setData(newData);
        setPage((prePage) => prePage + 1);
      } else {
        // console.log('///////////////End call bookings api at page: ' + page + '///////////////');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(() => false);
    }
  };

  const loadData = async () => {
    if (prePage != page) {
      setLoading(() => true);
    }
    await handlegetBookingData();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom && !loading) {
      loadData();
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={40} />
        </Pressable>
        <Text style={styles.headerTitle}>Booking History List</Text>
      </View>
      <ScrollView onScroll={handleScroll}>
        <View style={{ backgroundColor: '#F8F4FA', marginBottom: 20 }}>
          {loading && data.length == 0 ? (
            <View>
              <BookingSkelection />
              <BookingSkelection />
              <BookingSkelection />
            </View>
          ) : (
            <>
              {data.map((item: any) => {
                return (
                  <Swipeable
                    key={item.id}
                    renderRightActions={() => {
                      return (
                        <View style={styles.detailBtnWrapper}>
                          <TouchableOpacity
                            onPress={() => {
                              setBookingId(item.id);
                              navigation.navigate('BookingDetailsNav');
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <Ionicons name="arrow-forward" size={32} />
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Detail</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  >
                    <Card>
                      <View style={styles.roomNameWrapper}>
                        <Text style={styles.roomName}>{item.room.roomName}</Text>
                      </View>
                      <View style={styles.infoWrapper}>
                        <View style={styles.infoItem}>
                          <Text style={[styles.textInfoItem, { fontWeight: 'bold' }]}>Tên khách hàng: </Text>
                          <Text style={styles.textInfoItem}>{item.customerName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={[styles.textInfoItem, { fontWeight: 'bold' }]}>Giá: </Text>
                          <Text style={styles.textInfoItem}>{formatVNPrice(item.totalPrice)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Text style={[styles.textInfoItem, { fontWeight: 'bold' }]}>Ngày đặt: </Text>
                          <Text style={styles.textInfoItem}>{formatVNDate(item.startTime)}</Text>
                        </View>
                      </View>
                      <View>
                        <BookingStatus status={item.status} />
                      </View>
                    </Card>
                  </Swipeable>
                );
              })}
              {loading && <BookingSkelection />}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#F8F8FA',
  },
  backBtn: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
  },
  roomNameWrapper: {
    width: '100%',
  },
  roomName: {
    fontSize: 17,
    color: '#5669FF',
    fontWeight: 'bold',
  },
  infoWrapper: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    gap: 5,
  },
  infoItem: {
    flexDirection: 'row',
  },
  textInfoItem: {
    fontSize: 16,
    fontFamily: '',
  },
  detailBtnWrapper: {
    width: '30%',
    marginTop: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
});

export default BookingHistoryList;
