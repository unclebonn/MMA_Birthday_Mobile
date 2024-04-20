import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomePageScreen from './screen/HomePageScreen';
import LoginScreen from './screen/LoginScreen';
import Profile from './screen/Profile/Profile';
import BookingHistoryList from './screen/User/BookingHistory/BookingHistoryList';
import BookingDetails from './screen/User/BookingHistory/BookingDetails';



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

  const HomeNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={HomePageScreen} />
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
  const BookingHistoryNav = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="BookingHistoryList" component={BookingHistoryList} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
      </Stack.Navigator>
    )
  };

  const TabNav = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name='HomeNav' component={HomeNav} />
        <Tab.Screen name='ProfileNav' component={ProfileNav} />
      </Tab.Navigator>
    )
  }

  // const DrawerNav = () => {
  //   return (
  //     <Drawer.Navigator screenOptions={{ headerTitle: "" }} initialRouteName='TabNav'>
  //       <Drawer.Screen name='Home' component={TabNav} />
  //       <Drawer.Screen name='BookingHistoryNav' component={BookingHistoryNav} />
  //     </Drawer.Navigator>
  //   )
  // }
  const CustomDrawerContent = () => {
    const nav = useNavigation();
    return (
      <DrawerContentScrollView>
        <DrawerItem
          key='a'
          label={() => (
            <Text>
              Test1
            </Text>
          )}
          onPress={() => {
            console.log('clicked');
            // nav.navigate('HomeNav')
          }
          }
        />
        <DrawerItem
          key='b'
          label={() => (
            <Text>
              Test2
            </Text>
          )}
          onPress={() => console.log('clicked')}
        />
      </DrawerContentScrollView>
    )
  }
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          {/* <Stack.Navigator screenOptions={{ headerTitle: "Birthday Party Booking App" }} >
            <Stack.Screen name='Drawer' component={DrawerNav} />
          </Stack.Navigator> */}
          <Drawer.Navigator screenOptions={{ headerTitle: "" }} initialRouteName='TabNav'
            drawerContent={CustomDrawerContent}>
            <Drawer.Screen name='Home' component={TabNav} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>

      <StatusBar style="auto" />

    </SafeAreaProvider>
  );
}



