import { View, Text } from 'react-native';
import React from 'react';

function getApiUrl(id: string): string {
  return `https://party-renting-platform-aa30573d1765.herokuapp.com/api/bookings/customer/1${id}`;
}

export default function BookingDetails() {
  return (
    <View>
      <Text>BookingDetails</Text>
    </View>
  );
}
