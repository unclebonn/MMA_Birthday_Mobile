import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { createRef } from 'react';
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
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsInVuaXF1ZV9uYW1lIjoidXNlci0yIiwiYXV0aCI6IlJPTEVfQURNSU4sUk9MRV9IT1NULFJPTEVfVVNFUiIsIm5iZiI6MTcxMzY5NTMzOSwiZXhwIjoxNzEzNzgxNzM5LCJpYXQiOjE3MTM2OTUzMzl9.WtW9WGT5eVxza4dpLlLKnp_MXi0ZLwm1veAGZyr-nNM';
  const token = data ? data.token : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
        <Stack.Screen name="Restrict" options={{
          headerShown: false,
        }} component={RestrictionScreen} />
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
        <Tab.Screen name='HomeNav' component={HomeNav} options={{ title: 'Trang chủ' }} />
        <Tab.Screen name='ProfileNav' component={ProfileNav} options={{ title: 'Hồ sơ của tôi' }} />
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
            <View style={{ flexDirection: 'row' }}>
              <Icon name={'user'} style={{ marginRight: 10 }} size={30} />
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
            <View style={{ flexDirection: 'row' }}>
              <Icon name={'clock-rotate-left'} style={{ marginRight: 10 }} size={30} />
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
            <View style={{ flexDirection: 'row' }}>
              <Icon name={'right-from-bracket'} style={{ marginRight: 10 }} size={30} />
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
          <Stack.Navigator initialRouteName='AuthNav'>
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



