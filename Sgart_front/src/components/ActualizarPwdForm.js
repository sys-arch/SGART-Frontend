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
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Contraseña actualizada correctamente');
                navigate('/');
            } else {
                setErrorMessage(data.error || 'Error al actualizar la contraseña');
            }
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            setErrorMessage('Error de conexión. Por favor, intente nuevamente.');
        }
    };

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