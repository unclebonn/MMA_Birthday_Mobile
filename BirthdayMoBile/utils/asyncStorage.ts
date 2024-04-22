// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('token', jsonValue)
    } catch (e) {
        // saving error
    }
}
export const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('token')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}