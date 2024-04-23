import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, Text, View } from 'react-native';

// Anh Khôi

export default function BookingHistoryList() {
  const nav = useNavigation<any>();
  return (
    <View>
      <Button title={'To detail page'} onPress={() => nav.navigate('BookingDetailsNav')}></Button>
      <Text>Booking History List</Text>
    </View>
  )
}