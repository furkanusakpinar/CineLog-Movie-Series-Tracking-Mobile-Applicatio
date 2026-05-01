import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/screens/HomeScreen';
import AddScreen from './app/screens/AddScreen';
import DetailScreen from './app/screens/DetailScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#09090B',
    card: '#18181B',
    text: '#FAFAFA',
    border: '#27272A',
    primary: '#6366F1',
  },
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#FFFFFF',
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Film & Dizi Notlarım' }} 
          />
          <Stack.Screen 
            name="Add" 
            component={AddScreen} 
            options={{ title: 'Yeni Ekle' }} 
          />
          <Stack.Screen 
            name="Detail" 
            component={DetailScreen} 
            options={{ title: 'Detaylar' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
