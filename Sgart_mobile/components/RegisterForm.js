import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const RegisterForm = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [centro, setCentro] = useState('');
  const [fechaAlta, setFechaAlta] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [contrasena, setContrasena] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('El email debe tener un formato válido (ejemplo@example).');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_*\/=&!])[A-Za-z\d\-_*\/=&!]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      setContrasenaError(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (-, _, *, /, =, &, !).'
      );
      return false;
    }
    setContrasenaError('');
    return true;
  };


  const handleRegister = async () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }
  
    if (!nombre || !apellidos || !email || !centro || !fechaAlta || !contrasena || !repetirContrasena) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    if (contrasena !== repetirContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    const usuario = {
      name: nombre,
      lastName: apellidos,
      email: email,
      department: departamento,
      center: centro,
      hiringDate: fechaAlta,
      password: contrasena,
      passwordConfirm: repetirContrasena,
    };
  
    try {
      setIsLoading(true);
  
      const response = await fetch('https://sgart-backend.onrender.com/users/verificar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro.');
      }
  
      const data = await response.json();
  
      Alert.alert(
        'Registro exitoso',
        'Correo verificado. Pasando a la autenticación con doble factor...',
        [{ text: 'OK', onPress: () => navigation.navigate('GoogleAuth', { data }) }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Hubo un error durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFechaAlta(formattedDate);
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Registro de usuario</Text>
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
          onChangeText={(value) => {
            setEmail(value);
            setEmailError('');
          }}
          onBlur={validateEmail}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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

        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text style={{ color: fechaAlta ? '#000' : '#aaa' }}>
            {fechaAlta ? `Fecha de Alta: ${fechaAlta}` : 'Selecciona la Fecha de Alta*'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          display="default"
          minimumDate={new Date(2000, 0, 1)}
          maximumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Contraseña */}
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña*"
            value={contrasena}
            onChangeText={(value) => {
              setContrasena(value);
              setContrasenaError('');
            }}
            onBlur={validatePassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            <Image
              source={
                showPassword
                  ? require('../media/password_on.png')
                  : require('../media/password_off.png')
              }
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
        {contrasenaError ? <Text style={styles.errorText}>{contrasenaError}</Text> : null}

        {/* Repetir contraseña */}
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Repetir Contraseña*"
            value={repetirContrasena}
            onChangeText={setRepetirContrasena}
            secureTextEntry={!showRepeatPassword}
          />
          <TouchableOpacity onPress={toggleRepeatPasswordVisibility} style={styles.iconContainer}>
            <Image
              source={
                showRepeatPassword
                  ? require('../media/password_on.png')
                  : require('../media/password_off.png')
              }
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  inputPassword: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  passwordIcon: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterForm;
