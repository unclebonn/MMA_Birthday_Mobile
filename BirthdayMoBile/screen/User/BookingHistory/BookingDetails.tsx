import { View, Text, BackHandler, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { handleBookingDetailsId } from '../../../utils/zuestand';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import StepIndicator from 'react-native-step-indicator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from '@rneui/base';
import { Skeleton } from '@rneui/themed';

const firstIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  separatorFinishedColor: '#4aae4f',
  separatorUnFinishedColor: '#a4d4a5',
  stepIndicatorFinishedColor: '#4aae4f',
  stepIndicatorUnFinishedColor: '#a4d4a5',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 12,
  currentStepLabelColor: '#4aae4f',
};

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

function getApiUrl(id: number): string {
  return `https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/customer/${id}`;
}

function getApiCancelUrl(id: number): string {
  return `https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/${id}/cancel`;
}

function getApiConfirmUrl(id: number): string {
  return `https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/${id}/confirm`;
}

function calculateServicePrice(startDateStr: string, endDateStr: string, pricePerHour: number) {
  // Chuyển đổi ngày bắt đầu và kết thúc từ chuỗi sang đối tượng Date
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Tính số mili giây giữa hai ngày
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Tính số giờ (làm tròn lên)
  const hours = Math.ceil(timeDifference / (1000 * 3600));

  // Tính giá dịch vụ
  const totalPrice = hours * pricePerHour;

  return { totalPrice, hours };
}

function getCurrentStepIndex(status: 'APPROVING' | 'ACCEPTED' | 'SUCCESS' | 'CANCEL' | 'REJECTED') {
  switch (status) {
    case 'APPROVING':
      return 0;
    case 'ACCEPTED':
      return 2;
    case 'SUCCESS':
      return 3;
    case 'CANCEL':
      return 3;
    case 'REJECTED':
      return 3;
    default:
      return 2;
  }
}

function BookingDetailsSkelecton() {
  return (
    <View style={{ alignItems: 'center', gap: 20 }}>
      <Skeleton width={380} height={35} />
      <Skeleton width={320} height={30} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton circle width={32} height={32} />
        <Skeleton width={73} height={5} />
        <Skeleton circle width={32} height={32} />
        <Skeleton width={73} height={5} />
        <Skeleton circle width={32} height={32} />
        <Skeleton width={73} height={5} />
        <Skeleton circle width={32} height={32} />
      </View>
      <Skeleton width={380} height={500}></Skeleton>
    </View>
  );
}

function isCurrentTimeGreaterOrEqual(dateString: string) {
  // Tạo đối tượng Date từ chuỗi thời gian
  const dateTime = new Date(dateString);

  // Tạo đối tượng Date cho thời gian hiện tại
  const currentTime = new Date();

  // So sánh thời gian
  if (currentTime >= dateTime) {
    return true; // Thời gian hiện tại lớn hơn hoặc bằng thời gian trong chuỗi
  } else {
    return false; // Thời gian hiện tại nhỏ hơn thời gian trong chuỗi
  }
}

export default function BookingDetails() {
  const navigation = useNavigation<any>();
  const bookingId = handleBookingDetailsId((state) => state.bookingId);

  const [data, setData] = useState<any>(null);
  const isApproving = data?.status === 'APPROVING';
  const isSuccess = data?.status === 'SUCCESS';
  const isRejected = data?.status === 'REJECTED';
  const isCancel = data?.status === 'CANCEL';
  const isAccepted = data?.status === 'ACCEPTED';
  const stepLabels = isCancel
    ? ['Waiting', 'Accepted', 'Serving', 'Cancel']
    : ['Waiting', 'Accepted', 'Serving', 'Payment'];

  const { totalPrice: priceRoom, hours } = data
    ? calculateServicePrice(data.startTime, data.endTime, data.room.price)
    : { totalPrice: 0, hours: 0 };
  const servicePrice = data
    ? data.bookingDetails.reduce((sum: number, item: any) => sum + item.service.price * item.serviceQuantity, 0)
    : 0;

  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setData(null);
      };
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('BookingHistoryListNav');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    (async () => {
      setLoading(true);
      if (bookingId) {
        try {
          const response = await axios.get(getApiUrl(bookingId));
          setData(response.data);
          setCurrentPosition(getCurrentStepIndex(response.data.status));
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => backHandler.remove();
  }, [bookingId]);

  const handleCancel = async () => {
    try {
      if (bookingId) {
        await axios.put(getApiCancelUrl(bookingId));
        const response = await axios.get(getApiUrl(bookingId));
        setData(response.data);
        setCurrentPosition(getCurrentStepIndex(response.data.status));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleConfirm = async () => {
    try {
      if (bookingId) {
        await axios.put(getApiConfirmUrl(bookingId));
        const response = await axios.get(getApiUrl(bookingId));
        setData(response.data);
        setCurrentPosition(getCurrentStepIndex(response.data.status));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return <Text style={position === currentPosition ? styles.stepLabelSelected : styles.stepLabel}>{label}</Text>;
  };

  const showCancelAlert = async () => {
    Alert.alert('Xác nhận hủy', 'Bạn có chắc bạn muốn hủy??', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: handleCancel,
        style: 'default',
      },
    ]);
  };

  const showConfirmAlert = async () => {
    Alert.alert('Xác nhận thanh toán', 'Trước khi thanh toán, bạn vui lòng kiểm tra thông tin. Xin cảm ơn!', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: handleConfirm,
        style: 'default',
      },
    ]);
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.navigate('BookingHistoryListNav')}>
          <Ionicons name="arrow-back-outline" size={40} />
        </Pressable>
        <Text style={styles.headerTitle}>Booking Tracking</Text>
      </View>
      <ScrollView>
        {loading ? (
          <BookingDetailsSkelecton />
        ) : (
          <View style={{ backgroundColor: '#F8F4FA', marginBottom: 20, gap: 20, minHeight: 650 }}>
            {data && (
              <>
                <View style={styles.nameAndAddress}>
                  <Text style={styles.roomName}>{data.room.roomName}</Text>
                  <Text style={styles.address}>{data.room.address}</Text>
                </View>
                <View style={styles.stepIndicator}>
                  {!isRejected ? (
                    <StepIndicator
                      stepCount={4}
                      customStyles={firstIndicatorStyles}
                      currentPosition={currentPosition}
                      labels={stepLabels}
                      renderLabel={renderLabel}
                    />
                  ) : (
                    <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: 'red' }}>
                      REJECTED!
                    </Text>
                  )}
                  <View style={styles.confirmOrCancelBtnWrapper}>
                    {isApproving && (
                      <TouchableOpacity style={styles.confirmOrCancelBtn} onPress={showCancelAlert}>
                        <Text style={styles.confirmOrCancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                    {isAccepted && (
                      <TouchableOpacity style={styles.confirmOrCancelBtn} onPress={showConfirmAlert}>
                        <Text style={styles.confirmOrCancelBtnText}>Confirm</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Card containerStyle={{ marginTop: 0 }}>
                  <View style={styles.infoCtn}>
                    <Text style={styles.cardTitle}>Service</Text>
                    {data.bookingDetails.map((item: any, index: any) => {
                      return (
                        <View style={styles.inforWrapper} key={index}>
                          <Text style={styles.infoContent}>
                            {item.service.serviceName} × {item.serviceQuantity}
                          </Text>
                          <Text style={styles.infoData}>
                            {formatVNPrice(parseInt(item.service.price) * parseInt(item.serviceQuantity))}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={[styles.infoCtn, { marginTop: 20 }]}>
                    <Text style={styles.cardTitle}>Check-in information</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.infoContent}>Customer name: </Text>
                      <Text style={styles.infoData}>{data.customerName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.infoContent}>Start time: </Text>
                      <Text style={styles.infoData}>{formatVNDate(data.startTime)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.infoContent}>End time: </Text>
                      <Text style={styles.infoData}>{formatVNDate(data.endTime)}</Text>
                    </View>
                  </View>
                  <View style={[styles.infoCtn, { marginTop: 20 }]}>
                    <Text style={styles.cardTitle}>Check-in information</Text>
                    <View style={styles.inforWrapper}>
                      <Text style={styles.infoContent}>
                        {formatVNPrice(data.room.price)} × {hours} hour(s)
                      </Text>
                      <Text style={styles.infoData}>{formatVNPrice(priceRoom)}</Text>
                    </View>
                    <View style={styles.inforWrapper}>
                      <Text style={styles.infoContent}>Service fee</Text>
                      <Text style={styles.infoData}>{formatVNPrice(servicePrice)}</Text>
                    </View>
                  </View>
                  <View style={styles.dashLine}></View>
                  <View style={styles.inforWrapper}>
                    <Text style={[styles.infoContent, { fontSize: 27 }]}>Total</Text>
                    <Text style={{ fontSize: 27 }}>{formatVNPrice(data.totalPrice)}</Text>
                  </View>
                </Card>
              </>
            )}
          </View>
        )}
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
  nameAndAddress: {
    paddingTop: 20,
    width: '100%',
    gap: 10,
  },
  roomName: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
  },
  stepIndicator: {
    gap: 15,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
  confirmOrCancelBtnWrapper: {
    alignItems: 'center',
  },
  confirmOrCancelBtn: {
    backgroundColor: 'rgb(221, 16, 98)',
    minWidth: 100,
    padding: 10,
    borderRadius: 10,
  },
  confirmOrCancelBtnText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 6,
    color: '#708090',
    fontWeight: '600',
  },
  infoCtn: {
    gap: 5,
  },
  inforWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContent: {
    fontSize: 16,
    color: '#4090FE',
  },
  infoData: {
    fontSize: 16,
  },
  dashLine: {
    borderWidth: 1.5,
    borderColor: '#36454F',
    borderRadius: 10,
    backgroundColor: '#36454F',
    marginVertical: 20,
  },
});
