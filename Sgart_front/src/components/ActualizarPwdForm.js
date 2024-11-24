import React, { useState } from 'react';
import '../App.css';
import { useNavigate, useParams } from 'react-router-dom';

const ActualizarPwdForm = () => {
    const navigate = useNavigate();
    const { token } = useParams();  // Obtener el token de la URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si las contraseñas coinciden
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
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la contraseña.');
            }

            alert('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            setErrorMessage('No se pudo actualizar la contraseña. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className='reset-password-container'>
            <h2>Actualizar Contraseña</h2>
            <form onSubmit={handleSubmit} className='reset-password-form'>
                <div className='input-group'>
                    <input
                        type='password'
                        id='newPassword'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label htmlFor='newPassword'>Nueva Contraseña:</label>
                </div>
                <div className='input-group'>
                    <input
                        type='password'
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor='confirmPassword'>Repetir Nueva Contraseña:</label>
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <button type='submit' className='update-btn'>Actualizar Contraseña</button>
            </form>
        </div>
    );
};

export default ActualizarPwdForm;