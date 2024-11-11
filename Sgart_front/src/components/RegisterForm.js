import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const RegisterForm = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [centro, setCentro] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [perfil_desplegable, setPerfil_desplegable] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [repetirContrasena, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isLoged, setIsLoged] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellidos':
                setApellidos(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'departamento':
                setDepartamento(value);
                break;
            case 'centro':
                setCentro(value);
                break;
            case 'fechaAlta':
                setFechaAlta(value);
                break;
            case 'perfil_desplegable':
                setPerfil_desplegable(value);
                break;
            case 'contrasena':
                setContrasena(value);
                break;
            case 'repetirContrasena':
                setRepetirContrasena(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (contrasena !== repetirContrasena) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        const fechaSeleccionada = new Date(fechaAlta);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            setError('La fecha de alta no puede ser una fecha futura.');
            return;
        }

        const usuario = {
            name: nombre,
            lastName: apellidos,
            email: email,
            department: departamento,
            center: centro,
            hiringDate: fechaAlta,
            profile: perfil_desplegable,
            password: contrasena,
            passwordConfirm: repetirContrasena,
            blocked: false,
            verified: false,
            twoFactorAuthCode:'',
        };
        /*
        try {
            // Verificar si el correo electrónico ya existe en la base de datos
            const emailCheckResponse = await fetch(`http://localhost:9000/users/verificar-email`);
            if (!emailCheckResponse.ok) {
                throw new Error('Error al verificar el correo electrónico');
            }
            const emailCheckData = await emailCheckResponse.json();
            if (emailCheckData.exists) {
                setError('El correo electrónico ya está registrado.');
                return;
            }

            // Navegar a la ventana de autenticación de doble factor
            alert('Correo verificado. Pasando a la autenticación con doble factor...');
            navigate('/google-auth', { state: { usuario } });
        } catch (error) {
            console.error('Hubo un error:', error);
            setError('Error en la verificación del correo electrónico');
        }
        */

        fetch('http://localhost:9000/users/verificar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
        .then(response => response.text())
        .then((data) => {
            alert('Correo verificado. Pasando a la autenticación con doble factor...');
            console.log(JSON.stringify(usuario));
            navigate('/google-auth', { state: { usuario : usuario} });
        })
        .catch(error => {
            console.error('Error al verificar el correo electrónico.', error);
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    const handleToggleForm = () => {
        setIsLoged(true);
    };

    if (isLoged) {
        return <LoginForm />;
    }

    return (
        <div className="register-container">
        <div className="register-box">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <h2>Registro</h2>
                <p style={{ marginTop: "10px", fontSize: "12px", color: "#555"}}>
                    Los campos marcados con (*) son obligatorios.
                </p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-group-register">
                        <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChange} required/>
                        <label htmlFor="nombre">Nombre*</label>
                    </div>
                    <div className="input-group-register">
                        <input type="text" id="apellidos" name="apellidos" value={apellidos} onChange={handleChange} required/>
                        <label htmlFor="apellidos">Apellidos*</label>
                    </div>
                    <div className="input-group-register">
                        <input type="email" id="email" name="email" value={email} onChange={handleChange} required/>
                        <label htmlFor="email">Email*</label>
                    </div>
                    <div className="input-group-register">
                        <input type="text" id="departamento" name="departamento" value={departamento} onChange={handleChange} required/>
                        <label htmlFor="departamento">Departamento</label>
                    </div>
                    <div className="input-group-register">
                        <input type="text" id="centro" name="centro" value={centro} onChange={handleChange} required/>
                        <label htmlFor="centro">Centro*</label>
                    </div>
                    <div className="input-group-register">
                    <input type={fechaAlta ? "date" : "text"} id="fechaAlta" name="fechaAlta" value={fechaAlta} onFocus={(e) => (e.target.type = "date")} 
                        onBlur={(e) => {
                            if (!fechaAlta) {
                                e.target.type = "text";
                            }
                        }} onChange={handleChange} placeholder="" required/>
                        <label htmlFor="fechaAlta">Fecha de Alta*</label>
                    </div>
                    <div className="input-group-register">
                        <select className="perfil-select" id="perfil_desplegable" name="perfil_desplegable" value={perfil_desplegable} onChange={handleChange} required>
                            <option value="" disabled hidden></option>
                            <option value="usuario">Desarrollador</option>
                            <option value="usuario">Tester</option>
                            <option value="usuario">Becario</option>
                            <option value="usuario">RRHH</option>
                            <option value="usuario">Contabilidad</option>
                        </select>
                        <label htmlFor="perfil_desplegable">Perfil</label>
                        <button type="button" className="select-toggle-btn" value={perfil_desplegable}>
                            <img src={require('../media/flecha.png')} alt="Desplegable"/>
                        </button>
                    </div>
                    <div className="input-group-register">
                        <input type={showPassword ? "text" : "password"} id="contrasena" name="contrasena" value={contrasena} onChange={handleChange} required/>
                        <label htmlFor="contrasena">Contraseña*</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <img src={require(showPassword?'../media/password_off.png':'../media/password_on.png')} alt="Mostrar Contraseña"/>
                        </button>
                    </div>
                    <div className="input-group-register">
                        <input type={showRepeatPassword ? "text" : "password"} id="repetirContrasena" name="repetirContrasena" value={repetirContrasena} onChange={handleChange} required/>
                        <label htmlFor="repetirContrasena">Repetir Contraseña*</label>
                        <button type="button" onClick={toggleRepeatPasswordVisibility} className="repeatPassword-toggle-btn">
                        <img src={require(showRepeatPassword?'../media/password_off.png':'../media/password_on.png')} alt="Mostrar Contraseña"/>
                        </button>
                    </div>
                <button type="submit" className="register-btn">Registrarse</button>
                <div className="register-options">
                    <p style={{ marginTop: "10px", fontSize: "12px", color: "#555"}}>
                        ¿Ya estás registrado?
                    </p>
                    <a href="#" onClick={handleToggleForm}>Iniciar sesión</a>
                </div>
            </form>
        </div>
        </div>
    );
};

export default RegisterForm;