import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Button } from 'react-native'
import React, { useState } from 'react'

export default function LoginScreen() {

    const [account, setAccount] = useState("")
    const [password, setPassword] = useState("")
    const [showMenu, setShowMenu] = useState(false)


    const onChangeAccount = (value: string) => {
        setAccount(value)
    }

    const onChangePassword = (value: string) => {
        setPassword(value)
    }

    // const onChangeMenu = () => {
    //     setShowMenu(!showMenu)
    // }


    console.log(showMenu);

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
        inputBox: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            fontSize: 16,
            borderColor: "#EDEFEE",
            backgroundColor: "#EDEFEE"
        },
        btnLogin: {
            borderRadius: 50,
            width: 150,
            textAlign: "center",
            backgroundColor: "#EE9972"
        }
    });

    return (
        <ScrollView indicatorStyle='white' showsVerticalScrollIndicator={false}>
            <View>
                <Text style={styles.regularText}>Welcome to Little Lemon</Text>
                <Text style={styles.regularText}>Login to continue</Text>
                <TextInput
                    keyboardType='email-address'
                    value={account}
                    placeholder='First Name'
                    style={styles.inputBox}
                    onChangeText={onChangeAccount}
                >
                </TextInput>
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    placeholder='Password'
                    style={styles.inputBox}
                    onChangeText={onChangePassword}
                />



            </View>
            <View style={{ "alignItems": "center" }}>
                <Pressable style={styles.btnLogin}>
                    <Button onPress={() => setShowMenu(!showMenu)} title={showMenu ? "Home" : "View Menu"} color={"#EE9972"}></Button>
                </Pressable>

            </View>

        </ScrollView>
    )
}