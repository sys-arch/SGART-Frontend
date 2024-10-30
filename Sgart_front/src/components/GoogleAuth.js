import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const GoogleAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario } = location.state;
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(`http://localhost:9000/auth/generate-qr?email=${usuario.email}`);
                if (!response.ok) {
                    throw new Error('Error al generar el código QR');
                }
                const data = await response.json();
                setQrCode(data.qrCode);
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
            const response = await fetch('http://localhost:9000/auth/validate-totp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: usuario.email, code: inputCode }),
            });

            if (!response.ok) {
                throw new Error('Código de autenticación incorrecto');
            }

            const data = await response.json();
            if (data.status === 'valid') {
                setMessage("Autenticación exitosa. Redirigiendo...");
                navigate('/user-options');
            } else {
                setMessage("Código inválido. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            setMessage("Error al validar el código.");
            console.error("Error en la autenticación:", error);
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