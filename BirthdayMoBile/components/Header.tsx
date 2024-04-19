import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {

    const insets = useSafeAreaInsets();

    const HeaderViewStyle: StyleProp<ViewStyle> = {
        paddingTop: insets.top,
        backgroundColor: "#EDEFEE"
    }

    const TextViewStyle: StyleProp<TextStyle> = {
        fontSize: 30,
        color: "black",
        textAlign:"center"
    }

    return (
        <View style={HeaderViewStyle}>
            <Text style={TextViewStyle}>
                Welcome to Little Lemon
            </Text>
        </View>
    )
}