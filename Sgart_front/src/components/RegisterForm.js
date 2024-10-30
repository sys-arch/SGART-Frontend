import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            passwordConfirm: repetirContrasena
        };

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
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" name="nombre" value={nombre} onChange={handleChange} required />
                        <label htmlFor="nombre">Nombre</label>
                    </div>
                    <div className="input-group">
                        <input type="text" name="apellidos" value={apellidos} onChange={handleChange} required />
                        <label htmlFor="apellidos">Apellidos</label>
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" value={email} onChange={handleChange} required />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-group">
                        <input type="text" name="departamento" value={departamento} onChange={handleChange} required />
                        <label htmlFor="departamento">Departamento</label>
                    </div>
                    <div className="input-group">
                        <input type="text" name="centro" value={centro} onChange={handleChange} required />
                        <label htmlFor="centro">Centro</label>
                    </div>
                    <div className="input-group">
                        <input type="date" name="fechaAlta" value={fechaAlta} onChange={handleChange} required />
                        <label htmlFor="fechaAlta">Fecha de Alta</label>
                    </div>
                    <div className="input-group">
                        <select name="perfil_desplegable" value={perfil_desplegable} onChange={handleChange} required>
                            <option value="">Selecciona un perfil</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <label htmlFor="perfil_desplegable">Perfil</label>
                    </div>
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} name="contrasena" value={contrasena} onChange={handleChange} required />
                        <label htmlFor="contrasena">Contraseña</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            <img src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')} alt='Mostrar Contraseña' />
                        </button>
                    </div>
                    <div className="input-group">
                        <input type={showRepeatPassword ? "text" : "password"} name="repetirContrasena" value={repetirContrasena} onChange={handleChange} required />
                        <label htmlFor="repetirContrasena">Repetir Contraseña</label>
                        <button type="button" onClick={toggleRepeatPasswordVisibility} className="password-toggle-btn">
                            <img src={require(showRepeatPassword ? '../media/password_off.png' : '../media/password_on.png')} alt='Mostrar Contraseña' />
                        </button>
                    </div>
                    <button type="submit" className="register-btn">Registrar</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default RegisterForm;