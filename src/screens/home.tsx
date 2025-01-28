import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatPage from './Chat';
import ContactsPage from './Contact';
import SettingsPage from './Settings';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const HomePage = ({ route }) => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        headerShown: false,
        tabBarActiveTintColor: '#5664d2',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Chat"
        component={ChatPage}
        options={{
          tabBarIcon: ({ focused }) => <Icon color={focused ? '#5664d2' : '#ccc'} name="comment" size={24} />,
          tabBarLabel: 'Chats',
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsPage}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ focused }) => (
            <Icon color={focused ? '#5664d2' : '#ccc'} name="address-book" size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => <Icon color={focused ? '#5664d2' : '#ccc'} name="bars" size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
