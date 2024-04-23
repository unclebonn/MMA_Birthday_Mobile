import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('https://party-renting-platform-aa30573d1765.herokuapp.com/api/profile/balance');
        setBalance(response.data);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const paymentData = {
        price: parseFloat(amount),
        returnUrl: "string"
      };

      const response = await axios.post('https://party-renting-platform-aa30573d1765.herokuapp.com/api/vnpay/payment', paymentData);
      console.log('Payment response 1 :', response.data);
  
        setPaymentUrl(response.data);
        console.log('Payment response 2:', paymentUrl);

     
    } catch (error) {
      console.error('Error making payment:', error);
      Alert.alert('Thông báo', 'Có lỗi xảy ra khi tạo yêu cầu thanh toán');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatBalance = (balance) => {
    if (!balance) return '';
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.balanceText}>Số dư của bạn: {formatBalance(balance)} đ</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Nhập số tiền cần nạp"
            keyboardType="numeric"
          />
          <Button title="Nạp tiền" onPress={handlePayment} disabled={paymentLoading || !amount} />
          {console.log("payment 3",paymentUrl)}
        
          {paymentUrl && (
            <WebView
              source={{ uri: paymentUrl }}
              style={{ flex: 1 }}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Wallet;
