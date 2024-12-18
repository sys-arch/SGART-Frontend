import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import config from '../config';

const GoogleAuthLogin = ({ navigation, route }) => {
  const { data, email } = route.params.state;

  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (value) => {
    setInputCode(value);
  };

  const handleButtonClick = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }
  
      // Validar que email no sea null o vacío
      if (!email) {
        throw new Error('Email no proporcionado. Por favor, intenta nuevamente.');
      }
  
      const request = {
        mail: email,
        code: inputCode,
      };
  
      const response = await fetch(`${config.BACKEND_URL}/auth/validate-totp-db`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error al validar el código.');
      }
  
      const validation = await response.json();
  
      if (validation.status === 'valid') {
        setMessage('Autenticación exitosa. Redirigiendo...');
        navigation.navigate('Calendar', { state: { data, email } });
      } else {
        setMessage('Código inválido. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      Alert.alert('Error', error.message || 'Error al validar el código.');
      setMessage('Error al validar el código.');
    }
  };
  

  return (
<View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido al Sistema</Text>
        <Text style={styles.subtitle}>
          Por favor, verifica tu identidad con Google Authenticator.
        </Text>
        <Text style={styles.label}>Introduzca su código de seguridad:</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduce el código"
          placeholderTextColor="#aaa"
          value={inputCode}
          onChangeText={handleInputChange}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Comprobar código</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

GoogleAuthLogin.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      state: PropTypes.shape({
        data: PropTypes.object.isRequired,
        email: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default GoogleAuthLogin;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6', // Fondo azul
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    color: '#ff3333',
    textAlign: 'center',
  },
});
