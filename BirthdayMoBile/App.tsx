import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomePageScreen from './screen/HomePageScreen';
import Profile from './screen/Profile/Profile';
import BookingDetails from './screen/User/BookingHistory/BookingDetails';
import BookingHistoryList from './screen/User/BookingHistory/BookingHistoryList';
import RoomSearch from './screen/RoomSearch';
import RoomDetails from './screen/User/RoomDetail/RoomDetails';
import axios from 'axios';
import React from 'react';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import { getData } from './utils/asyncStorage';
const navigationRef = createRef<NavigationContainerRef<string>>()
const nav = () => navigationRef.current

const onRequestSuccess = async (config: any) => {
  // const token = cookie.get("jwt-token");  // cho nay thay vao asyncStorage
  const data = await getData();
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsInVuaXF1ZV9uYW1lIjoidXNlci0yIiwiYXV0aCI6IlJPTEVfQURNSU4sUk9MRV9IT1NULFJPTEVfVVNFUiIsIm5iZiI6MTcxMzY5NTMzOSwiZXhwIjoxNzEzNzgxNzM5LCJpYXQiOjE3MTM2OTUzMzl9.WtW9WGT5eVxza4dpLlLKnp_MXi0ZLwm1veAGZyr-nNM';
  const token = data ? data.concac : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("BUBUBUBUHBUB exist (Comment khuc navifate nen co z fix lai)")
  }
  return config;
};
// Thêm interceptor cho các yêu cầu trước khi gửi
axios.interceptors.request.use(onRequestSuccess);

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

  //Every SINGLE page 
  const AuthNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        // headerShown: false,
      }}>
        <Stack.Screen name="Login" options={{
          headerShown: false,
        }} component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    )
  }
  const RegisterNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    )
  }
  const HomeNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={HomePageScreen} />
      </Stack.Navigator>
    )
  };
  const RoomSearchNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="RoomSearch" component={RoomSearch} />
      </Stack.Navigator>
    )
  };
  const RoomDetailNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="RoomDetails" component={RoomDetails} />
      </Stack.Navigator>
    )
  };
  const ProfileNav = () => {
    return (
      <Stack.Navigator screenOptions={{

        headerShown: false,
      }}>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    )
  };
  const BookingHistoryListNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="BookingHistoryList" component={BookingHistoryList} />
      </Stack.Navigator>
    )
  };
  const BookingDetailsNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
      </Stack.Navigator>
    )
  };

  //Every pages landed into the BottomTabs here in terms of StackNav, but only show what needed
  const TabNav = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>

        {/* <Tab.Screen name='RegisterNav' component={RegisterNav} /> */}
        <Tab.Screen name='HomeNav' component={HomeNav} />
        <Tab.Screen name='ProfileNav' component={ProfileNav} />
        <Tab.Screen name='RoomSearchNav' component={RoomSearchNav} options={{
          tabBarButton: () => <View style={{ width: 0 }} />,
          headerShown: false,
        }} />
        <Tab.Screen name='BookingHistoryListNav' component={BookingHistoryListNav} options={{
          tabBarButton: () => <View style={{ width: 0 }} />,
          headerShown: false,
        }} />
        <Tab.Screen name='BookingDetailsNav' component={BookingDetailsNav} options={{
          tabBarButton: () => <View style={{ width: 0 }} />,
          headerShown: false,
        }} />
        {/* <Tab.Screen name='RoomDetailNav' component={RoomDetailNav} options={{
          tabBarButton: () => <View style={{ width: 0 }} />,
          headerShown: false,
        }} /> */}
      </Tab.Navigator>
    )
  }

  //Main component
  const DrawerNav = () => {
    return (
      <Drawer.Navigator screenOptions={{
        headerTitle: () =>
          <>
            <Text style={{ color: 'whitesmoke' }}>Chao xìn, Nguyen Van A</Text>
            <Text style={{ color: 'whitesmoke' }}>Today is Friday in California</Text>
          </>
        ,
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'rgb(74,67,236)',
        },
      }} initialRouteName='TabNav'
        drawerContent={(props) => <CustomDrawerContent {...props} nav={nav} />}
      >
        <Drawer.Screen name='Home' component={TabNav} />
      </Drawer.Navigator>
    )
  }

  //The left Sidebar
  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView>
        <DrawerItem
          key='profile'
          label={() => (
            <Text>
              Profile
            </Text>
          )}
          onPress={() => {
            props.navigation.navigate('ProfileNav')
          }
          }
        />
        <DrawerItem
          key='booking-history'
          label={() => (
            <Text>
              Booking History
            </Text>
          )}
          onPress={() => props.navigation.navigate('BookingHistoryListNav')}
        />
      </DrawerContentScrollView>
    )
  }
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName='AuthNav'>
            <Stack.Screen name='AuthNav' component={AuthNav} options={{ headerShown: false }} />
            <Stack.Screen name='DrawerNav' component={DrawerNav} options={{ headerShown: false }} />
            <Stack.Screen name='RoomSearchNav' component={RoomSearchNav} />
            <Stack.Screen name='RoomDetailNav' component={RoomDetailNav} />
          </Stack.Navigator>
          {/* <DrawerNav nav={nav} /> */}
        </NavigationContainer>
      </View>
      <StatusBar style="auto" />

    </SafeAreaProvider>
  );
}



