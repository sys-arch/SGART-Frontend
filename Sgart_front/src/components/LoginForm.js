import React, { useState } from 'react';

const LoginForm = () => {

    // Estados de cada campo del formulario
    const [email_textbox, setEmail] = useState('');
    const [contrasena_textbox, setContrasena] = useState('');
    const [repetirContrasena_textbox, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');

    // Cambios en los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email_textbox':
                setEmail(value);
                break;
            case 'contrasena_textbox':
                setContrasena(value);
                break;
            case 'repetirContrasena_textbox':
                setRepetirContrasena(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // ¿Coinciden las contraseñas?
        if (contrasena_textbox !== repetirContrasena_textbox) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        //Verificar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_textbox)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        alert('Registro exitoso');
        setError('');
        // Enviar datos al backend...
    };

    return (
        <div class="login-container">
        <div class="login-box">
            <h2>Iniciar Sesión</h2>
            <form action="#" method="post">
                <div class="input-group">
                    <input type="text" id="username" required/>
                    <label for="username">Usuario</label>
                </div>
                <div class="input-group">
                    <input type="password" id="password" required/>
                    <label for="password">Contraseña</label>
                </div>
                <button type="submit" class="login-btn">Entrar</button>
                <div class="login-options">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                    <a href="#">Regístrate</a>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;