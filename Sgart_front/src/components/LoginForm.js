import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import RecuperarPwdForm from './RecuperarPwdForm';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    // Estados de cada campo del formulario
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isNoPwd, setIsNoPwd] = useState(false);

    // Cambios en los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'contrasena':
                setContrasena(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const user = {
            email: email,
            password: contrasena,
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        fetch('http://localhost:9000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al loguear');
            }
            alert('Login exitoso. Pasando a la autetificación con doble factor...')
            navigate('/google-auth-login', { state: { email: email} }); //Navegamos a la ventana de google auth
            return response.json();
        })
        .then((data) => {
            setError(''); // Limpiar cualquier mensaje de error
        })
        .catch((error) => {
            console.error('Hubo un error:', error);
            setError('Error en el login');
        });
        // Enviar datos al backend...
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }; 

    const handleToggleForm = () => {
        setIsRegistering(true);
    };

    if (isRegistering) {
        return <RegisterForm />;
    }

    const handleToggleForm_2 = () => {
        setIsNoPwd(true);
    }

    if (isNoPwd) {
        return <RecuperarPwdForm />;
    }

    return (
        <div className="login-container">
        <div className="login-box">
            <h2>Iniciar Sesión</h2>
            <form action="#" method="post" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" id="email" name="email" value={email} onChange={handleChange} required/>
                    <label htmlFor="email">Usuario</label>
                </div>
                <div className="input-group">
                    <input type={showPassword ? "text" : "password"} id="contrasena" name="contrasena" value={contrasena} onChange={handleChange} required/>
                    <label htmlFor="contrasena">Contraseña</label>
                    <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                    <img src={require(showPassword?'../media/password_off.png':'../media/password_on.png')} alt='Mostrar Contraseña'/>
                    </button>
                </div>
                <button type="submit" className="login-btn">Entrar</button>
                <div className="login-options">
                    <a href="#" onClick={handleToggleForm_2}>¿Olvidaste tu contraseña?</a>
                    <a href="#" onClick={handleToggleForm}>Regístrate</a>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;