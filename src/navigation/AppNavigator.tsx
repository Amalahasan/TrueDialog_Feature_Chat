import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/login';
import TowFactorScreen from '../screens/twoFactor';
import HomeScreen from '../screens/home';
import ChatDetailScreen from '../screens/ChatDetailPage';
import SplashScreen from '../screens/Splash';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const userAuth = useSelector(state => state?.userAuth);
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Splash'}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={options}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={options} />
        <Stack.Screen
          name="TowFactor"
          component={TowFactorScreen}
          options={options}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={options} />
        <Stack.Screen
          name="ChatDetails"
          component={ChatDetailScreen}
          options={options}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
