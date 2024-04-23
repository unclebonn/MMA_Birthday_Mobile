import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('https://party-renting-platform-aa30573d1765.herokuapp.com/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const sortedTransactions = transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView 
   
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false} 
      style={styles.transactionContainer}>
          {sortedTransactions.map((transaction, index) => (
            <View key={index} style={styles.transactionWrapper}>
              <View style={styles.transactionItem}>
                {transaction.status === 'SUCCESS' && (
                  <View style={styles.transactionIcon}>
                    <Icon name="check-circle" size={24} color="green" />
                  </View>
                )}
                <View style={styles.transactionInfo}>
                  <Text>{`Mã giao dịch: ${transaction.transactionNo}`}</Text>
                  <Text>{`Số tiền: +${transaction.amount} đ`}</Text>
                  <Text>{`Thời gian: ${formatDate(transaction.createdAt)}`}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
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
  transactionContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  transactionWrapper: {
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {},
});

export default TransactionHistoryScreen;
