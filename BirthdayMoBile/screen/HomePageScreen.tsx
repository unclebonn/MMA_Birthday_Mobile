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
            color: "black"
        },
    });

    return (
        <ScrollView indicatorStyle='white' showsVerticalScrollIndicator={false}>
            <View>
                <Text style={styles.regularText}>Homepage screen</Text>
            </View>
        </ScrollView>
    )
}