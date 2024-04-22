import React, { useState } from 'react';
import { View, StyleSheet, Switch, TextInput, TouchableOpacity, Text, Image, Alert, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios, { AxiosResponse } from 'axios'; // import axios
import { storeData } from '../utils/asyncStorage';
import { useNavigation } from '@react-navigation/native';

interface IResponseData {
    id_token: string;
}
export default function LoginScreen() {
    const n = useNavigation<any>();

    const [account, setAccount] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const onChangeAccount = (value: string) => {
        setAccount(value);
    }
    const onChangePassword = (value: string) => {
        setPassword(value);
    }

    const handleLogin = async () => {
        try {
            const response: AxiosResponse<IResponseData> = await axios.post('https://party-renting-platform-aa30573d1765.herokuapp.com/api/authenticate', {
                username: account,
                password: password,
                rememberMe: rememberMe
            });
            const token = response.data.id_token;
            // console.log(token); // log the token

            // Store the token in AsyncStorage
            await storeData({ concac: token });
            console.log(token)
            n.navigate('DrawerNav');
        } catch (error: any) {
            Alert.alert('Fuck you motha fucka', error.message);
        }
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#F5FCFF',
        },
        logo: {
            width: 200,
            alignSelf: 'center',
            padding: 0,
            margin: 0,
        },
        title: {
            fontSize: 24,
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
            paddingLeft: 10,
            marginBottom: 20,
        },
        textInput: {
            flex: 1,
            padding: 10,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: 'gray',
        },
        icon: {
            padding: 10,
        },
        button: {
            alignItems: 'center',
            backgroundColor: '#3D56F0',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
        },
        buttonText: {
            fontSize: 18,
            color: 'white',
        },
        switch: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        signUp: {
            marginTop: 20,
            textAlign: 'center',
        },
    });
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode='contain'
                source={require('../assets/eventHub.png')}
            />
            {/* <Text style={styles.title}>Welcome to MyApp!</Text> */}
            <View style={styles.input}>
                <Icon name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeAccount}
                    value={account}
                    placeholder="Username"
                />
            </View>
            <View style={styles.input}>
                <Icon name="lock" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.switch}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Switch
                        trackColor={{ true: "#3D56F0" }}
                        thumbColor={rememberMe ? "" : "#f4f3f4"}
                        onValueChange={setRememberMe}
                        value={rememberMe}
                    />
                    <Text>Remember me</Text>
                </View>
                <Text style={{ color: '#3D56F0' }}>Forgot password?</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                // onPress={() => console.log(handleLogin)}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.signUp}>Don't have an account? <Pressable onPress={() => n.navigate('Register')}>
                <Text style={{ color: '#3D56F0' }}>Sign up</Text>
            </Pressable>
            </Text>
        </View >
    );
}
