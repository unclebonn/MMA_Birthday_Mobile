import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import { SafeAreaProvider } from "react-native-safe-area-context"
import WelcomeScreen from './screen/WelcomeScreen';
import MenuItems from './components/MenuItems';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screen/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

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

  const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();


  const WelcomeScreenTest = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name='LoginScreen2' component={LoginScreen} />
        <Tab.Screen name='WelcomeScreen2' component={WelcomeScreen} />
      </Tab.Navigator>
    )
  }


  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Header />
        <NavigationContainer>
          <Drawer.Navigator screenOptions={{headerTitle:""}} initialRouteName='WelcomeScreen1'>
            {/* <Drawer.Screen name='LoginScreen' component={WelcomeScreenTest} /> */}
            <Drawer.Screen name='LoginScreen1' component={WelcomeScreenTest} />
            <Drawer.Screen name='WelcomeScreen1' component={WelcomeScreenTest} />
          </Drawer.Navigator>

        </NavigationContainer>
        {/* <NavigationContainer>
         
        </NavigationContainer> */}
        {/* <WelcomeScreen /> */}
      </View>


      <View style={styles.footerContainer}>
        <Footer />
      </View>
      <StatusBar style="auto" />

    </SafeAreaProvider>
  );
}



