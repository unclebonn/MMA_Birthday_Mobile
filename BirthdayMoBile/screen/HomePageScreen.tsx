import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

//Duy's
export default function HomePageScreen() {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "green"
        },
        regularText: {
            marginVertical: 8,
            fontSize: 24,
            padding: 20,
            textAlign: "center",
            color: "white"
        },
    });

    return (
        <ScrollView indicatorStyle='white' showsVerticalScrollIndicator={false}>
            <View>
                <Text style={styles.regularText}>Welcome to Birthday Party Booking App</Text>
                <Text style={styles.regularText}>Login to continue</Text>
            </View>
        </ScrollView>
    )
}