import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React, { CSSProperties } from 'react'

export default function Footer() {

    const FooterStyle: StyleProp<ViewStyle> = {
        // backgroundColor: "#F4CE14",
    }


    const TextStyle: StyleProp<TextStyle> = {
        fontSize: 18,
        color: "black",
        textAlign: "center"
    }

    return (
        <View style={FooterStyle}>
            <Text style={TextStyle}>All rights by Tao, 2024</Text>
        </View>
    )
}