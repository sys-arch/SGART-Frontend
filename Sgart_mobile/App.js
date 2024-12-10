import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Calendar from './components/calendar';
import MeetingCreator from './components/MeetingCreator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginForm} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterForm} 
          options={{ title: 'Registrarse' }}
        />
        <Stack.Screen 
          name="calendar" 
          component={Calendar} 
          options={{ title: 'Calendario' }}
        />
        <Stack.Screen 
          name="MeetingCreator" 
          component={MeetingCreator} 
          options={{ title: 'MeetingCreator' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
