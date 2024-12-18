import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import CalendarComponent from './components/calendar';
import UserEdit from './components/UserEdit';
import GoogleAuth from './components/GoogleAuth';
import NotificacionesComponent from './components/Notificaciones';

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
          name="GoogleAuth"
          component={GoogleAuth}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Calendar" 
          component={CalendarComponent} 
          options={{ title: 'Calendario' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={UserEdit} 
          options={{ title: 'Perfil' }}
        />
        <Stack.Screen 
          name="Notificaciones" 
          component={NotificacionesComponent} 
          options={{ title: 'Notificaciones' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}