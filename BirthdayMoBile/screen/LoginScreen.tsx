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
  const [error, setError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const onChangeAccount = (value: string) => {
    setAccount(value);
  };
  const onChangePassword = (value: string) => {
    setPassword(value);
  };
  const handleLogin = async () => {
    // Reset errors
    setAccountError(null);
    setPasswordError(null);
    setError(null);

    // Check for empty fields and set corresponding errors
    if (!account && !password) {
      setError('Please enter your username and password.');
      return;
    }
    if (!account) {
      setAccountError('Please enter your username.');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      return;
    }

    try {
      const response: AxiosResponse<IResponseData> = await axios.post(
        'https://party-renting-platform-aa30573d1765.herokuapp.com/api/authenticate',
        {
          username: account,
          password: password,
          rememberMe: rememberMe,
        }
      );
      const token = response.data.id_token;
      await storeData({ token: token });
      console.log(token);
      // Get user roles
      const rolesResponse = await axios.get('https://party-renting-platform-aa30573d1765.herokuapp.com/api/account');

      // Check user roles
      if (rolesResponse.data.authorities.length !== 1 || rolesResponse.data.authorities[0] !== 'ROLE_USER') {
        // If user has more than one role or their role is not 'ROLE_USER', navigate to restriction screen
        n.navigate('Restrict');
      } else {
        // If user has only 'ROLE_USER' role, navigate to main app
        n.navigate('DrawerNav');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('User does not exist. Please check try again.');
      } else if (error.response && error.response.status === 401) {
        setError('Username or password is incorrect. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F5FCFF',
    },
    logo: {
      width: 400,
      height: 300,
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
      // borderRightWidth: 1,
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
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
    },
    signUp: {
      marginTop: 20,
      textAlign: 'center',
    },
    errorInput: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
    },
  });
  return (
    <View style={styles.container}>
      <Image style={styles.logo} resizeMode="stretch" source={require('../assets/partyRenting.png')} />
      <View style={[styles.input, accountError || error ? styles.errorInput : null]}>
        <Icon name="user" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.textInput} onChangeText={onChangeAccount} value={account} placeholder="Username" />
      </View>
      {accountError && <Text style={styles.errorText}>{accountError}</Text>}
      <View style={[styles.input, passwordError || error ? styles.errorInput : null]}>
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
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.switch}>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Switch
                        trackColor={{ true: "#3D56F0" }}
                        thumbColor={rememberMe ? "" : "#f4f3f4"}
                        onValueChange={setRememberMe}
                        value={rememberMe}
                    />
                    <Text>Remember me</Text>
                </View> */}
        <Text style={{ color: '#3D56F0' }}>Forgot password?</Text>
      </View>
      <Pressable onPress={() => n.navigate('Register')}>
        <Text style={styles.signUp}>
          Don't have an account?
          <Text style={{ color: '#3D56F0', padding: 0, margin: 0 }}> Register</Text>
        </Text>
      </Pressable>
    </View>
  );
}
