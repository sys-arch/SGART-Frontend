import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleAuthLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtén email y dataLogin de la ubicación
    const email = location.state?.email || '';
    const dataLogin = location.state?.data || {};

    // Estados locales
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');

    // Maneja los cambios en el input del código
    const handleInputChange = (event) => {
        setInputCode(event.target.value);
    };

    // Maneja la validación del código
    const handleButtonClick = () => {
        const request = {
            mail: email,
            code: inputCode,
        };

        fetch('http://localhost:9000/auth/validate-totp-db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                setError(''); // Limpiar mensaje de error

                // Redirige según el tipo de usuario
                switch (dataLogin.type) {
                    case 'admin':
                        navigate('/admin-working-hours');
                        break;
                    case 'user':
                        navigate('/user-calendar');
                        break;
                    default:
                        navigate('/under-construction');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('Error al validar el código de doble factor');
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido al Sistema</h2>
                <p>Por favor, verifica tu identidad con Google Authenticator.</p>
                <p>Introduzca su código de seguridad:</p>
                <input
                    type="text"
                    id="codeInput"
                    value={inputCode}
                    onChange={handleInputChange}
                    className="code-input"
                    placeholder="Introduce el código"
                />
                <button className="login-btn" onClick={handleButtonClick}>
                    Comprobar código
                </button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default GoogleAuthLogin;
