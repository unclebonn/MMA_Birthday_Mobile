import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Image, Alert, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios, { AxiosResponse } from 'axios'; // import axios
import { useNavigation } from '@react-navigation/native';
interface IRegisterData {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default function RegisterScreen() {
    const n = useNavigation<any>();
    const [registerData, setRegisterData] = useState<IRegisterData>({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

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
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        setUsernameError(null);
        setPasswordError(null);
        setEmailError(null);
        if (!registerData.login) {
            setUsernameError('Please enter your username.');
        }
        if (!registerData.password || registerData.password.length < 4) {
            setPasswordError('Password must be at least 4 characters.');
        }
        if (registerData.password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match!');
            return;
        }

        if (usernameError || passwordError) {
            return;
        }
        if (!emailRegex.test(registerData.email)) {
            setEmailError('Please enter a valid email.');
            return;
        }
        try {
            const response: AxiosResponse<IRegisterData> = await axios.post('https://party-renting-platform-aa30573d1765.herokuapp.com/api/register', registerData);

            // handle your response here
            console.log(response.data);

            // navigate back to the login screen
            n.navigate('Login');
        } catch (error: any) {
            // handle error
            if (error.response && error.response.status === 400) {
                setUsernameError('Username is invalid or already taken.');
            } else {
                Alert.alert('An error occurred!', error.message);
            }
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

        }, errorInput: {
            borderColor: 'red',
        },
        errorText: {
            color: 'red',
        },
    });

    return (
        <View style={styles.container}>
            <View style={[styles.input, usernameError ? styles.errorInput : null]}>
                <Icon name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('login', value)}
                    value={registerData.login}
                    placeholder="Username"
                />
            </View>
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            <View style={[styles.input, passwordError ? styles.errorInput : null]}>
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
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            <View style={[styles.input, confirmPasswordError ? styles.errorInput : null]}>
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
            {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
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
            <View style={[styles.input, emailError ? styles.errorInput : null]}>
                <Icon name="envelope" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => handleInputChange('email', value)}
                    value={registerData.email}
                    placeholder="Email"
                />
            </View>
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister} // call handleRegister when the button is pressed
            // onPress={() => console.log(handleRegister)}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <View>

                <Text style={styles.signUp}>Already have an account?
                    <Pressable onPress={() => n.navigate('Login')}>

                        <Text style={{ color: '#3D56F0' }
                        } > Login</Text>
                    </Pressable>
                </Text >
            </View>
        </View >
    );
}
