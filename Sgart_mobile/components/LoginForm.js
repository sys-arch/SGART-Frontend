import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import config from '../config';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const storeData = async (token, userEmail) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userEmail', userEmail);
      console.log('Token y email almacenados correctamente.');
    } catch (error) {
      console.error('Error al guardar en AsyncStorage:', error);
    }
  };

  const handleLogin = async () => {
    let hasError = false;
    setErrorEmail('');
    setErrorPassword('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorEmail('El formato del correo electrónico no es válido.');
      hasError = true;
    }

    if (email === '') {
      setErrorEmail('Campo vacío');
      hasError = true;
    }

    if (password === '') {
      setErrorPassword('Campo vacío');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const user = { 
      email: email,
      password: password,
    };

    fetch(`${config.BACKEND_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'include',
    })
      .then((response) => {
    
        if (!response.ok) {
          // Si la respuesta es un error HTTP (ej: 401, 403, 500)
          return response.text().then((text) => {
            const errorMessage = text || 'Error desconocido del servidor.';
            throw new Error(`HTTP ${response.status}: ${errorMessage}`);
          });
        }
        return response.json();
      })
        .then(async (data) => {
          if (data.success) {
            console.log('Login exitoso:', data);
            // Guardar token y email usando AsyncStorage
            await storeData(data.token, email);
            navigation.navigate('Calendar', { state: { data: data, email: email } });
            //navigation.navigate('Calendar', { state: { data: data, email: email } });
          } else {
            throw new Error(data.message || 'Error al iniciar sesión.');
          }
        })
        .catch((error) => {
          console.error('Error en el login:', error.message);
          alert(error.message);
        })
        .finally(() => setIsLoading(false));
    };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../media/1206.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* Login Form */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginBox}>
          <Image
            source={require('../media/logo_sgart-sinfondo.png')}
            style={styles.loginLogo}
          />
          <Text style={styles.loginTitle}>Iniciar Sesión</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errorEmail ? styles.inputError : null]}
              placeholder="Usuario"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errorPassword ? styles.inputError : null]}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image
                source={showPassword ? require('../media/password_on.png') : require('../media/password_off.png')}
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>
          {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.loginOptions}>
            <TouchableOpacity>
              <Text style={styles.optionText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.optionText}>Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={styles.optionText}>Calendario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Condiciones</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Privacidad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loginBox: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  loginLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  passwordIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginOptions: {
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    gap: 15,
  },
  optionText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    zIndex: 3,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0.3,
    zIndex: -1,
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
    fontSize: 14,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    /* QUITAR LUEGO */
  passStrangisButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  passStrangisText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
LoginForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginForm;
