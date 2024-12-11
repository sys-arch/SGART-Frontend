import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserCalendar from './components/UserCalendar';
import GoogleAuth from './components/GoogleAuth';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Define LoginScreen como la pantalla inicial */}
        <Stack.Screen 
          name="Login" 
          component={LoginForm} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterForm} />
        <Stack.Screen name="UserCalendar" component={UserCalendar} />
        <Stack.Screen name="GoogleAuth" component={GoogleAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
