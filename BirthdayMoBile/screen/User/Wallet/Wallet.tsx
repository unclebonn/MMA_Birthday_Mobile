import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NavigationContainerRef } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Wallet = ({ navigation }: { navigation: NavigationContainerRef }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false); 

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
      setPaymentUrl(response.data);
      // console.log(paymentUrl);
      
      setShowPayment(false);
      setShowBalance(false);
      setDisableButtons(true); 
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

  const navigateToTransactionHistory = () => {
    navigation.navigate('TransactionHistoryScreenNav');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.transactionContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Text style={styles.balanceText}>Số dư của bạn :
                {showBalance ? formatBalance(balance) + ' đ' : '*********'}
                <Icon name={showBalance ? 'visibility-off' : 'visibility'} size={20} />
              </Text>
            </TouchableOpacity>
            {!showPayment && (
              <TouchableOpacity
                style={[styles.customButton, disableButtons && { opacity: 0.5 }]}
                onPress={() => setShowPayment(true)}
                disabled={disableButtons} 
              >
                <Text style={styles.buttonText}>Nạp tiền</Text>
              </TouchableOpacity>
            )}

            {!showPayment && (
              <TouchableOpacity
                onPress={navigateToTransactionHistory}
                style={[disableButtons && { display: 'none' }]} 
              >
                <Text style={{fontWeight:'bold'}}>Lịch sử giao dịch</Text>
              </TouchableOpacity>
            )}

            {showPayment && (
              <>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Nhập số tiền cần nạp"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={handlePayment}
                  disabled={paymentLoading || !amount}
                >
                  <Text style={styles.buttonText}>Nạp tiền qua ví VNPay</Text>
                </TouchableOpacity>
              </>
            )}

            {paymentUrl && (
              <ScrollView>
                <WebView
                  source={{ uri: paymentUrl }}
                  style={{ width: 350, height: 1200 }}
                />
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  balanceText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  transactionContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  customButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'blue',
  },

  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ccc'
  },
});

export default Wallet;
