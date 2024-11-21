import React, { useState, useCallback } from 'react';
import RegisterForm from './RegisterForm';
import RecuperarPwdForm from './RecuperarPwdForm';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    // Estados de cada campo del formulario
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isNoPwd, setIsNoPwd] = useState(false);

    const [error, setError] =useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

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

    const toogleError = useCallback(() => {
        setError(true);
    });

    const handleLogin = () => {
        setError(false);
        setErrorEmail('');
        setErrorPassword('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail('El formato del correo electrónico no es válido.');
            toogleError();
        }

        if (email===''){
            setErrorEmail('Campo vacío');
            toogleError();
        }
        if (contrasena===''){
            setErrorPassword('Campo vacío');
            toogleError();
        }

        if (error) {
            return;
        } else {
            const user = {
                email: email,
                password: contrasena,
            };
        
            fetch('http://localhost:9000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => { throw new Error(data.message || 'Error al iniciar sesión. Correo y/o contraseña incorrectos') });
                }
                return response.json();
            })
            .then((data) => {
                if (data.user && data.user.blocked) {
                    alert('Tu cuenta está bloqueada. Por favor, contacta al soporte.');
                    return;
                }
        
                alert('Login exitoso. Pasando a la autentificación con doble factor...');
                navigate('/google-auth-login', { state: { data: data, email: email } });
            })
            .catch((error) => {
                alert(error.message);
            });
        }
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
            <h2 className="login-title">Iniciar Sesión</h2>
                <div className={errorEmail===''?"input-group":"input-group-error"}>
                    <input type="text" id="email" name="email" value={email} onChange={handleChange} required/>
                    <label htmlFor="email">Usuario</label>
                </div>
                <label className="error">{errorEmail}</label>
                <div className={errorPassword===''?"input-group":"input-group-error"}>
                    <input type={showPassword ? "text" : "password"} id="contrasena" name="contrasena" value={contrasena} onChange={handleChange} required/>
                    <label htmlFor="contrasena">Contraseña</label>
                    <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                    <img src={require(showPassword?'../media/password_off.png':'../media/password_on.png')} alt='Mostrar Contraseña'/>
                    </button>
                </div>
                <label className="error">{errorPassword}</label>
                <button onClick={handleLogin} className="login-btn">Entrar</button>
                <div className="login-options">
                    <a href="#" onClick={handleToggleForm_2}>¿Olvidaste tu contraseña?</a>
                    <a href="#" onClick={handleToggleForm}>Regístrate</a>
                </div>
        </div>
        </div>
    );
};

export default LoginForm;