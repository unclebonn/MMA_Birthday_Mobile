import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome6';
import HomePageScreen from './screen/HomePageScreen';
import LoginScreen from './screen/LoginScreen';
import Profile from './screen/Profile/Profile';
import RegisterScreen from './screen/RegisterScreen';
import RestrictionScreen from './screen/RestrictionScreen';
import RoomSearch from './screen/RoomSearch';
import BookingDetails from './screen/User/BookingHistory/BookingDetails';
import BookingHistoryList from './screen/User/BookingHistory/BookingHistoryList';
import RoomDetails from './screen/User/RoomDetail/RoomDetails';
import { getData, logout } from './utils/asyncStorage';
const navigationRef = createRef<NavigationContainerRef<string>>()
const nav = () => navigationRef.current

const onRequestSuccess = async (config: any) => {
  // const token = cookie.get("jwt-token");  // cho nay thay vao asyncStorage
  const data = await getData();
  const token = data ? data.token : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
// Thêm interceptor cho các yêu cầu trước khi gửi
axios.interceptors.request.use(onRequestSuccess);

export default function App() {
  const [initialRoute, setInitialRoute] = useState('AuthNav');

  useEffect(() => {
    const checkTokenExists = async () => {
      const data = await getData();
      const token = data ? data.token : null;
      if (token) {
        setInitialRoute('DrawerNav');
      }
    };
    checkTokenExists();
  }, []);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#333333"
    },
    footerContainer: {
      backgroundColor: "#EDEFEE"
    },
    icon: {
      fontSize: 20,
      color: 'grey',
      marginHorizontal: 10
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
        <Stack.Screen name="Restrict" options={{
          headerShown: false,
        }} component={RestrictionScreen} />
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
  // const RoomDetailNav = () => {
  //   return (
  //     <Stack.Navigator screenOptions={{
  //       headerShown: false,
  //     }}>
  //       <Stack.Screen name="RoomDetails" component={RoomDetails} />
  //     </Stack.Navigator>
  //   )
  // };
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
        <Tab.Screen name='HomeNav' component={HomeNav} options={{
          title: 'Trang chủ',
          tabBarIcon: () => <Icon name={'house'} style={styles.icon} />,
          tabBarActiveBackgroundColor: 'rgba(192, 187, 190, 0.8)'
        }} />
        <Tab.Screen name='ProfileNav' component={ProfileNav} options={{
          title: 'Hồ sơ của tôi',
          tabBarIcon: () => <Icon name={'user'} style={styles.icon} />,
          tabBarActiveBackgroundColor: 'rgba(192, 187, 190, 0.8)'
        }} />
        {/* <Tab.Screen name='RoomSearchNav' component={RoomSearchNav} options={{
          tabBarButton: () => <View style={{ width: 0 }} />,
          headerShown: false,
        }} /> */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'user'} style={styles.icon} />
              <Text style={{ fontSize: 20 }}>
                Hồ sơ của tôi
              </Text>
            </View>
          )}
          onPress={() => {
            props.navigation.navigate('ProfileNav')
          }
          }
        />
        <DrawerItem
          key='booking-history'
          label={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'clock-rotate-left'} style={styles.icon} />
              <Text style={{ fontSize: 20 }}>
                Lịch sử đặt tiệc
              </Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('BookingHistoryListNav')}
        />
        <DrawerItem
          key='logout'
          label={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'right-from-bracket'} style={styles.icon} />
              <Text style={{ fontSize: 20 }}>
                Đăng xuất
              </Text>
            </View>
          )}
          onPress={() => {
            logout();
            props.navigation.navigate('AuthNav')
          }}
        />
      </DrawerContentScrollView>
    )
  }
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name='AuthNav' component={AuthNav} options={{ headerShown: false }} />
            <Stack.Screen name='DrawerNav' component={DrawerNav} options={{ headerShown: false }} />
            <Stack.Screen name='RoomSearchNav' component={RoomSearchNav}
              options={{ title: 'Tìm phòng', headerStyle: { backgroundColor: 'rgb(74,67,236)' } }} />
            <Stack.Screen name='RoomDetailNav' component={RoomDetails}
              options={{ title: 'Chi tiết phòng', headerStyle: { backgroundColor: 'rgb(74,67,236)' } }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <StatusBar style="auto" />

    </SafeAreaProvider>
  );
}



