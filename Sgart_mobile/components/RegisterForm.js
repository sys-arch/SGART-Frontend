import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const RegisterForm = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [centro, setCentro] = useState('');
  const [fechaAlta, setFechaAlta] = useState('');
  const [perfil, setPerfil] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!nombre || !apellidos || !email || !centro || !fechaAlta || !contrasena || !repetirContrasena) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (contrasena !== repetirContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    // Simular una llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
      navigation.navigate('Login'); // Navegar a la pantalla de inicio de sesión
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre*"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos*"
        value={apellidos}
        onChangeText={setApellidos}
      />
      <TextInput
        style={styles.input}
        placeholder="Email*"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Departamento"
        value={departamento}
        onChangeText={setDepartamento}
      />
      <TextInput
        style={styles.input}
        placeholder="Centro*"
        value={centro}
        onChangeText={setCentro}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Alta* (YYYY-MM-DD)"
        value={fechaAlta}
        onChangeText={setFechaAlta}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña*"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir Contraseña*"
        value={repetirContrasena}
        onChangeText={setRepetirContrasena}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterForm;
