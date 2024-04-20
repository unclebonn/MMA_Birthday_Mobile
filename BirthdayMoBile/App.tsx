import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomePageScreen from './screen/HomePageScreen';
import LoginScreen from './screen/LoginScreen';
import Profile from './screen/Profile/Profile';
import BookingHistoryList from './screen/User/BookingHistory/BookingHistoryList';

export default function App() {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#333333"
    },
    footerContainer: {
      backgroundColor: "#EDEFEE"
    }
  })

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  const Tab = createBottomTabNavigator();


  const TabNav = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name='LoginScreen2' component={LoginScreen} />
        <Tab.Screen name='WelcomeScreen2' component={HomePageScreen} />
      </Tab.Navigator>
    )
  }

  const DrawerNav = () => {
    return (
      <Drawer.Navigator screenOptions={{ headerTitle: "" }} initialRouteName='TabNav'>
        <Drawer.Screen name='TabNav' component={TabNav} />
        <Drawer.Screen name='Profile' component={Profile} />
        <Drawer.Screen name='Booking History' component={BookingHistoryList} />
      </Drawer.Navigator>
    )
  }
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerTitle: "Birthday Party Booking App" }} >
            <Stack.Screen name='Drawer' component={DrawerNav} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>

      <StatusBar style="auto" />

    </SafeAreaProvider>
  );
}



