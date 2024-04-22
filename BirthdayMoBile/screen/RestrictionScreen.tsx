import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { logout } from "../utils/asyncStorage";

export default function RestrictionScreen() {
    const navigation = useNavigation<any>();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
           
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        button: {
            alignItems: 'center',
            backgroundColor: '#3D56F0',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
            width: '100%',
            top: '30%',
        },
        buttonText: {
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
        },
        errorText: {
            color: '#3D56F0',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            bottom: '30%',
        },
        image: {
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
        },
    });
    return (
        <ImageBackground source={require('../assets/heh.png')} style={styles.image}>
            <View style={styles.overlay} />
            <View style={styles.container}>
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
        </ImageBackground>
    );
}
