import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegisterForm = () => {
    const navigation = useNavigation();
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [centro, setCentro] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [perfil_desplegable, setPerfil_desplegable] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [repetirContrasena, setRepetirContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isLoged, setIsLoged] = useState(false);
    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellidos, setErrorApellidos] = useState('');
    const [errorDepartamento, setErrorDepartamento] = useState('');
    const [errorCentro, setErrorCentro] = useState('');
    const [errorFechaAlta, setErrorFechaAlta] = useState('');
    const [errorPerfil, setErrorPerfil] = useState('');
    const [errorContrasena, setErrorContrasena] = useState('');
    const [errorRepetirContrasena, setErrorRepetirContrasena] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const getToken = () => {
        return sessionStorage.getItem('authToken');
    };

    const handleChange = (name, value) => {
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellidos':
                setApellidos(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'departamento':
                setDepartamento(value);
                break;
            case 'centro':
                setCentro(value);
                break;
            case 'fechaAlta':
                setFechaAlta(value);
                break;
            case 'perfil_desplegable':
                setPerfil_desplegable(value);
                break;
            case 'contrasena':
                setContrasena(value);
                break;
            case 'repetirContrasena':
                setRepetirContrasena(value);
                break;
            default:
                break;
        }
    };

    const handleRegister = async () => {
        let errorBool = false;
      
        setErrorNombre('');
        setErrorApellidos('');
        setErrorDepartamento('');
        setErrorCentro('');
        setErrorPerfil('');
        setErrorRepetirContrasena('');
        setErrorContrasena('');
        setErrorFechaAlta('');
        setErrorEmail('');
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail('El formato del correo electrónico no es válido.');
            errorBool = true;
        }
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        
        if (!passwordRegex.test(contrasena)) {
            setErrorContrasena('La contraseña debe cumplir con los requisitos.');
            errorBool = true;
        }
    
        if (nombre === '') {
            setErrorNombre('Campo vacío');
            errorBool = true;
        }
        if (apellidos === '') {
            setErrorApellidos('Campo vacío');
            errorBool = true;
        }
        if (email === '') {
            setErrorEmail('Campo vacío');
            errorBool = true;
        }
        if (centro === '') {
            setErrorCentro('Campo vacío');
            errorBool = true;
        }
        if (fechaAlta === '') {
            setErrorFechaAlta('Campo vacío');
            errorBool = true;
        }
        if (contrasena === '') {
            setErrorContrasena('Campo vacío');
            errorBool = true;
        }
        if (repetirContrasena === '') {
            setErrorRepetirContrasena('Campo vacío');
            errorBool = true;
        }
        if (contrasena !== repetirContrasena) {
            setErrorRepetirContrasena('Las contraseñas no coinciden.');
            errorBool = true;
        }
    
        const fechaSeleccionada = new Date(fechaAlta);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            setErrorFechaAlta('La fecha de alta no puede ser una fecha futura.');
            errorBool = true;
        }
    
        if (errorBool) {
            return;
        }
    
        const usuario = {
            name: nombre,
            lastName: apellidos,
            email: email,
            department: departamento,
            center: centro,
            hiringDate: fechaAlta,
            profile: perfil_desplegable,
            password: contrasena,
            passwordConfirm: repetirContrasena,
            blocked: false,
            verified: false,
            twoFactorAuthCode: '',
        };
    
        if (usuario) { // Verifica que usuario no sea null o undefined
          navigation.navigate('GoogleAuth', {
              state: { usuario }
          });
        } else {
            console.error("Error: El objeto usuario no está definido.");
        }

    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    const handleToggleForm = () => {
        setIsLoged(true);
    };

    return (
        <>
            {isLoading ? (
                {/* <LoadingSpinner /> */}
            ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles['register-container']}>
                <View style={styles['register-box']}>
                  <Image
                    source={require('../media/1206.png')}
                    style={styles['background-image']}
                    resizeMode="cover"
                  />
                  <Text style={styles['title']}>Registro</Text>
                  <Text style={[styles['title'], { marginTop: 10, fontSize: 12, color: '#555' }]}>
                    Los campos marcados con (*) son obligatorios.
                  </Text>
          
                  {/* Nombre */}
                  <View style={errorNombre === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Nombre*"
                      value={nombre}
                      onChangeText={(value) => handleChange('nombre', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorNombre}</Text>
          
                  {/* Apellidos */}
                  <View style={errorApellidos === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Apellidos*"
                      value={apellidos}
                      onChangeText={(value) => handleChange('apellidos', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorApellidos}</Text>
          
                  {/* Email */}
                  <View style={errorEmail === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Email*"
                      value={email}
                      onChangeText={(value) => handleChange('email', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorEmail}</Text>
          
                  {/* Departamento */}
                  <View style={errorDepartamento === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Departamento"
                      value={departamento}
                      onChangeText={(value) => handleChange('departamento', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorDepartamento}</Text>
          
                  {/* Centro */}
                  <View style={errorCentro === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Centro*"
                      value={centro}
                      onChangeText={(value) => handleChange('centro', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorCentro}</Text>
          
                  {/* Fecha de Alta */}
                  <View style={errorFechaAlta === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Fecha de Alta*"
                      value={fechaAlta}
                      onFocus={(e) => handleChange('fechaAlta', '')}
                      onChangeText={(value) => handleChange('fechaAlta', value)}
                    />
                  </View>
                  <Text style={styles['error']}>{errorFechaAlta}</Text>
          
                  {/* Perfil */}
                  <View style={errorPerfil === '' ? styles['input-group'] : styles['input-group-error']}>
                    <Picker
                      selectedValue={perfil_desplegable}
                      onValueChange={(value) => handleChange('perfil_desplegable', value)}
                      style={styles['text-input']}
                    >
                      <Picker.Item label="Seleccione..." value="" />
                      <Picker.Item label="Desarrollador" value="Desarrollador" />
                      <Picker.Item label="Tester" value="Tester" />
                      <Picker.Item label="Becario" value="Becario" />
                      <Picker.Item label="RRHH" value="RRHH" />
                      <Picker.Item label="Contabilidad" value="Contabilidad" />
                    </Picker>
                  </View>
                  <Text style={styles['error']}>{errorPerfil}</Text>
          
                  {/* Contraseña */}
                  <View style={errorContrasena === '' ? styles['input-group'] : styles['input-group-error']}>
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Contraseña*"
                      secureTextEntry={!showPassword}
                      value={contrasena}
                      onChangeText={(value) => handleChange('contrasena', value)}
                    />
                    <TouchableOpacity
                      style={styles['password-toggle-btn']}
                      onPress={togglePasswordVisibility}
                    >
                      <Image
                        source={
                          showPassword
                            ? require('../media/password_off.png')
                            : require('../media/password_on.png')
                        }
                        style={styles['icon']}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles['error']}>{errorContrasena}</Text>
          
                  {/* Repetir Contraseña */}
                  <View
                    style={
                      errorRepetirContrasena === '' ? styles['input-group'] : styles['input-group-error']
                    }
                  >
                    <TextInput
                      style={styles['text-input']}
                      placeholder="Repetir Contraseña*"
                      secureTextEntry={!showRepeatPassword}
                      value={repetirContrasena}
                      onChangeText={(value) => handleChange('repetirContrasena', value)}
                    />
                    <TouchableOpacity
                      style={styles['repeatPassword-toggle-btn']}
                      onPress={toggleRepeatPasswordVisibility}
                    >
                      <Image
                        source={
                          showRepeatPassword
                            ? require('../media/password_off.png')
                            : require('../media/password_on.png')
                        }
                        style={styles['icon']}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles['error']}>{errorRepetirContrasena}</Text>
          
                  {/* Botón Registrarse */}
                  <TouchableOpacity style={styles['register-btn']} onPress={handleRegister}>
                    <Text style={styles['register-btn-text']}>Registrarse</Text>
                  </TouchableOpacity>
          
                  {/* Opciones de Registro */}
                  <View style={styles['register-options']}>
                    <Text style={styles['title-text']}>¿Ya estás registrado?</Text>
                    <TouchableOpacity onPress={handleToggleForm}>
                      <Text style={styles['link']}>Iniciar sesión</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
            )}
        </>
    );
};

export default RegisterForm;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  'background-image': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 60,
    right: -30,
    opacity: 0.3,
    zIndex: -1,
  },
  'title': {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  'register-container': {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      position: 'fixed',
      borderRadius: 8,
  },
  'register-box': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      borderRadius: 8,
      padding: 20,
      width: '90%',
      maxWidth: 400,
  },
  'title-text': {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
    width: '100%',
  },
  'input-group': {
    marginBottom: 15,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  'input-group-error': {
      marginBottom: 15,
      position: 'relative',
      borderColor: '#dc3545',
  },
  'text-input': {
    flex: 1,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  'error': {
      fontSize: 12,
      color: '#dc3545',
      marginTop: 5,
  },
  'perfil-select': {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      fontSize: 14,
      backgroundColor: '#fff',
  },
  'password-toggle-btn':{
    position: 'absolute',
    right: 10,
    height: 30,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  'repeatPassword-toggle-btn': {
    position: 'absolute',
    right: 10,
    height: 30,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  'icon': {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: '#555',
  },
  'register-btn': {
      backgroundColor: '#007bff',
      borderRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  'register-btn-text': {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  'register-options': {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  'link': {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});