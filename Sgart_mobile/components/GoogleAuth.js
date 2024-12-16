import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import config from '../config';

const GoogleAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, esAdmin } = location.state; // Extraemos el usuario de la ubicación
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(
                    `${config.BACKEND_URL}/auth/generate-qr?email=${usuario.email}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${getToken()}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al generar el código QR');
                }
                const data = await response.json();
                setQrCode(data.qrCode);
                setSecretKey(data.secretKey);
            } catch (error) {
                setMessage('Error al generar el código QR');
                console.error('Error al generar el código QR:', error);
            }
        };

        fetchQRCode();
    }, [usuario.email]);

    const handleInputChange = (event) => {
        setInputCode(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${config.BACKEND_URL}/auth/validate-totp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ mail: usuario.email, code: inputCode }),
            });

            if (!response.ok) {
                throw new Error('Código de autenticación incorrecto');
            }

            const data = await response.json();
            if (data.status === 'valid' ) {
                if(!esAdmin){
                    // Registro del usuario después de la validación exitosa
                    await registrarUsuario(usuario.email); // Llama a la función para registrar al usuario
                    setMessage("Autenticación exitosa. Redirigiendo...");
                    navigate('/user-calendar');
                }else{
                    // Si es admin, no puede usar la aplicación.
                    setMessage("Usuario no válido.");
                }
            } else {
                setMessage("Código inválido. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            setMessage("Error al validar el código.");
            console.error("Error en la autenticación:", error);
        }
    };

    const registrarUsuario = async (email) => {
        try {
            const usuarioActualizado = {
                ...usuario,
                twoFactorAuthCode: secretKey
            };

            const response = await fetch(`${config.BACKEND_URL}/users/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(usuarioActualizado),
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            let result;
            const contentType = response.headers.get('Content-Type');
            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text(); // Maneja texto plano
            }

            console.log('Usuario registrado:', result);
            setMessage("Usuario registrado con éxito.");
        } catch (error) {
            setMessage("Error al registrar al usuario.");
            console.error("Error en el registro:", error);
        }
    };

    return (
        <View style={styles['login-container']}>
            <View style={styles['login-box']}>
                <Text style={styles['login-title']}>Bienvenido</Text>
                <Text style={styles['login-text']}>
                    Por favor escanea el código QR con tu dispositivo móvil para configurar Google Authenticator:
                </Text>
                <View style={styles['qr-container']}>
                    {qrCode ? (
                        <Image
                            source={{ uri: `data:image/png;base64,${qrCode}` }}
                            style={styles['qr-image']}
                        />
                    ) : (
                        <View style={styles['qr-placeholder']}>
                            <Text style={styles['qr-placeholder-text']}>Código QR no disponible</Text>
                        </View>
                    )}
                </View>
                <Text style={styles['login-subtitle']}>Introduce tu código de Google Authenticator</Text>
                <TextInput
                    style={styles['code-input']}
                    placeholder="Introduce el código"
                    value={inputCode}
                    onChangeText={handleInputChange}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles['login-btn']} onPress={handleSubmit}>
                    <Text style={styles['login-btn-text']}>Verificar</Text>
                </TouchableOpacity>
                {message && <Text style={styles['login-message']}>{message}</Text>}
            </View>
        </View>
    );
};

export default GoogleAuth;

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
    'qr-container': {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    'qr-image': {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    'qr-placeholder': {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ececec',
        borderRadius: 8,
    },
    'qr-placeholder-text': {
        color: '#888',
        textAlign: 'center',
    },
    'login-subtitle': {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    'code-input': {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
    },
    'login-btn': {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    'login-btn-text': {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    'login-message': {
        fontSize: 14,
        color: '#ff3333',
        textAlign: 'center',
        marginTop: 10,
    },
});