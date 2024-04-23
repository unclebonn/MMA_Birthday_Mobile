import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { logout } from "../utils/asyncStorage";

export default function RestrictionScreen() {
    const navigation = useNavigation<any>();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        button: {
            alignItems: 'center',
            backgroundColor: '#3D56F0',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
            width: '100%',
        },
        buttonText: {
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
        },
        errorText: {
            color: 'red',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10
        },
        image: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            opacity: 0.5,
        },
    });
    return (
        <View style={styles.container}>
            <Image source={require('../assets/eventHub.png')} style={styles.image} />
            <Text style={styles.errorText}>🚫 ACCESS DENIED! 🚫{"\n"}You do not have the necessary permissions to access this app.</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    logout();
                    navigation.navigate('Login');
                }}
            >
                <Text style={styles.buttonText}>Logout and Return to Login</Text>
            </TouchableOpacity>
        </View>
    );
}
