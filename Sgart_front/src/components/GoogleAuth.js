import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import config from '../config';

const GoogleAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, esAdmin } = location.state; // Extraemos el usuario de la ubicación
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const getToken = () => sessionStorage.getItem('authToken');

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
            if (data.status === 'valid') {
                if (!esAdmin) {
                    await registrarUsuario(usuario.email);
                    setMessage("Autenticación exitosa. Redirigiendo...");
                    navigate('/');
                } else {
                    await registrarAdmin(usuario.email);
                    setMessage("Autenticación exitosa. Redirigiendo...");
                    navigate('/admin-panel');
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
                twoFactorAuthCode: secretKey,
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
                alert('Error al registrar el usuario');
                throw new Error(`Error al registrar el usuario: ${response.statusText}`);
            }
    
            let result;
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
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


    const registrarAdmin = async (email) => {
        try {
            const adminActualizado = {
                ...usuario,
                twoFactorAuthCode: secretKey,
            };

            const response = await fetch(`${config.BACKEND_URL}/admin/crearAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(adminActualizado),
            });

            if (!response.ok) {
                throw new Error('Error al registrar el admin');
            }

            const result = await response.json();
            console.log('Admin registrado:', result);
            setMessage("Admin registrado con éxito.");
        } catch (error) {
            setMessage("Error al registrar al admin.");
            console.error("Error en el registro:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido</h2>
                <p>Por favor escanea el código QR con tu dispositivo móvil para configurar Google Authenticator:</p>
                <div className="qr-container">
                    {qrCode ? (
                        <img src={`data:image/png;base64,${qrCode}`} alt="Código QR" />
                    ) : (
                        <div className='qr-placeholder'>
                            <p>Código QR no disponible</p>
                        </div>
                    )}
                </div>
                <br />
                <h3>Introduce tu código de Google Authenticator</h3>
                <input
                    type="text"
                    id="codeInput"
                    value={inputCode}
                    onChange={handleInputChange}
                    className="code-input"
                    placeholder="Introduce el código"
                />
                <br />
                <br />
                <div>
                    <button onClick={handleSubmit} className='login-btn'>Verificar</button>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default GoogleAuth;
