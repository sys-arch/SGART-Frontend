import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ActualizarPwdForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        console.log('Datos a enviar:', {
            token,
            newPassword
        });

        if (!token) {
            setErrorMessage('Token inválido o expirado');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('https://sgart-backend.onrender.com/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (response.ok) {
                    alert(data.message || 'Contraseña actualizada correctamente');
                    navigate('/');
                } else {
                    setErrorMessage(data.error || 'Error al actualizar la contraseña');
                }
            } else {
                const text = await response.text();
                console.log('Respuesta no JSON:', text);
                setErrorMessage('Error en el formato de respuesta del servidor');
            }
        } catch (error) {
            console.error('Error completo:', error);
            setErrorMessage(`Error de conexión: ${error.message}`);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            setErrorRepetirContrasena('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            errorBool = true;
        }
    

    // Para debug
    console.log('Token recibido:', token);

    return (
        <div className="login-container">
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <h2>Actualizar Contraseña</h2>

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <div className="input-group">
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            <img src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')} alt="Mostrar Contraseña" />
                        </button>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <button type="button" onClick={toggleRepeatPasswordVisibility} className="repeatPassword-toggle-btn">
                            <img src={require(showRepeatPassword ? '../media/password_off.png' : '../media/password_on.png')} alt="Mostrar Contraseña" />
                        </button>
                    </div>

                    <button type="submit" className="login-btn">
                        Actualizar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActualizarPwdForm;