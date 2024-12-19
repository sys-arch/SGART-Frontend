import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import config from '../config';


const GoogleAuthLogin = ( { navigation } ) => {
    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email || '';
    const dataLogin = location.state?.data || '';

    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setInputCode(event.target.value); // Actualiza el código ingresado
    };
    const getToken = () => {
        return sessionStorage.getItem('authToken');
    };

    const handleButtonClick = () => {
        const request = {
            mail: email,
            code: inputCode,
        }

        fetch(`${config.BACKEND_URL}/auth/validate-totp-db`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al validar el código de doble factor');
            }
            return response.json();
        })
        .then((data) => {
            alert('Doble factor autenticado con éxito');
            setError(''); // Limpiar cualquier mensaje de error
            const token = getToken(); // Obtener el token de sesión
            const decodedToken = jwtDecode(token); // Decodificar el token
            const userRole = decodedToken.role;
            console.log('userRole:', userRole);
            console.log('Token:', token);
            if (userRole === 'admin') {
                setError('Usuario no válido'); // Si admin
            } else if (userRole === 'employee') {
                navigation.navigate('calendar'); // Si es empleado
            } else {
                setError('Rol de usuario no reconocido');
            }
        })
        .catch((error) => {
            console.error('Hubo un error:', error);
            setError('Error al validar el código de doble factor');
        });
};

    return (
        <View style={styles['login-container']}>
        <View style={styles['login-box']}>
            <Text style={styles['login-title']}>Bienvenido al Sistema</Text>
            <Text style={styles['login-text']}>Por favor, verifica tu identidad con Google Authenticator.</Text>
            <Text style={styles['login-text']}>Introduzca su código de seguridad:</Text>
            <TextInput
                style={styles['code-input']}
                placeholder="Introduce el código"
                value={inputCode}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                returnKeyType="done" // Añade el botón "Done" al teclado
                onSubmitEditing={Keyboard.dismiss} // Oculta el teclado al confirmar
            />
            <TouchableOpacity style={styles['login-btn']} onPress={handleButtonClick}>
                <Text style={styles['login-btn-text']}>Comprobar código</Text>
            </TouchableOpacity>
        </View>
    </View>
    );

};
GoogleAuthLogin.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};
export default GoogleAuthLogin;

const styles = StyleSheet.create({
    'login-container': {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
    },
    'login-box': {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    'login-title': {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    'login-text': {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
        textAlign: 'center',
    },
    'code-input': {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    'login-btn': {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    'login-btn-text': {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
