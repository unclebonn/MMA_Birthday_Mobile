import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios, { AxiosResponse } from 'axios'; // import axios

interface IRegisterData {
    id: string;
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    activated: boolean;
    langKey: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    authorities: string[];
    password: string;
}

export default function RegisterScreen() {
    const [registerData, setRegisterData] = useState<IRegisterData>({
        id: '',
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        imageUrl: '',
        activated: true,
        langKey: '',
        createdBy: '',
        createdDate: '',
        lastModifiedBy: '',
        lastModifiedDate: '',
        authorities: [],
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const handleInputChange = (field: keyof IRegisterData, value: string) => {
        setRegisterData({
            ...registerData,
            [field]: value,
        });
    };
    const handleRegister = async () => {
        if (registerData.password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }

        try {
            const response: AxiosResponse<IRegisterData> = await axios.post('https://party-renting-platform-aa30573d1765.herokuapp.com/api/register', registerData);

            // handle your response here
            console.log(response.data);
        } catch (error: any) {
            // handle error
            Alert.alert('An error occurred!', error.message);
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
            <View style={styles.input}>
                <Icon name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('login', value)}
                    value={registerData.login}
                    placeholder="Username"
                />
            </View>
            <View style={styles.input}>
                <Icon name="lock" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('password', value)}
                    value={registerData.password}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.input}>
                <Icon name="lock" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.input}>
                <Icon name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    value={registerData.firstName}
                    placeholder="First Name"
                />
            </View>
            <View style={styles.input}>
                <Icon name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    value={registerData.lastName}
                    placeholder="Last Name"
                />
            </View>
            <View style={styles.input}>
                <Icon name="envelope" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('email', value)}
                    value={registerData.email}
                    placeholder="Email"
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                // onPress={handleRegister} // call handleRegister when the button is pressed
                onPress={() => console.log(handleRegister)}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.signUp}>Already have an account? <Text style={{ color: '#3D56F0' }}>Login</Text></Text>
        </View>
    );
}
