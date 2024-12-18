import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CalendarComponent from './components/calendar';
import GoogleAuth from './components/GoogleAuth';
import GoogleAuthLogin from './components/GoogleAuthLogin';
import LoginForm from './components/LoginForm';
import NotificacionesComponent from './components/Notificaciones';
import RegisterForm from './components/RegisterForm';
import UserEdit from './components/UserEdit';

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
          name="GoogleAuthLogin"
          component={GoogleAuthLogin}
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