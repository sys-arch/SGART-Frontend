import React, { useState } from 'react';

const RegisterForm = () => {
    const [nombre_textbox, setNombre] = useState('');
    const [apellidos_textbox, setApellidos] = useState('');
    const [email_textbox, setEmail] = useState('');
    const [departamento_textbox, setDepartamento] = useState('');
    const [centro_textbox, setCentro] = useState('');
    const [fechaAlta_box, setFechaAlta] = useState('');
    const [perfil_desplegable, setPerfil] = useState('');
    const [contrasena_textbox, setContrasena] = useState('');
    const [repetirContrasena_textbox, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);


    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nombre_textbox':
                setNombre(value);
                break;
            case 'apellidos_textbox':
                setApellidos(value);
                break;
            case 'email_textbox':
                setEmail(value);
                break;
            case 'departamento_textbox':
                setDepartamento(value);
                break;
            case 'centro_textbox':
                setCentro(value);
                break;
            case 'fechaAlta_box':
                setFechaAlta(value);
                break;
            case 'perfil_desplegable':
                setPerfil(value);
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

        // ¿Contraseñas iguales?
        if (contrasena_textbox !== repetirContrasena_textbox) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // ¿Contraseña robusta?
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contrasena_textbox)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_textbox)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        // Validar fecha (no puede ser una fecha futura)
        const fechaSeleccionada = new Date(fechaAlta_box);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            setError('La fecha de alta no puede ser una fecha futura.');
            return;
        }
        // Enviar los datos al backend...
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

        fetch('http://localhost:9000/users/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en el registro del usuario');
            }
            return response.json();
        })
        .then((data) => {
            alert('Registro exitoso'); // Mostrar el mensaje de éxito
            setError(''); // Limpiar cualquier mensaje de error
        })
        .catch((error) => {
            console.error('Hubo un error:', error);
            setError('Error al registrar el usuario');
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }; 
    
    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    return (
        <div class="register-container">
        <div class="register-box">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <h2>Registro</h2>
                <p style={{ marginTop: "10px", fontSize: "12px", color: "#555"}}>
                    Los campos marcados con (*) son obligatorios.
                </p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div class="input-group-register">
                        <input type="text" name="nombre_textbox" value={nombre_textbox} onChange={handleChange} required/>
                        <label>Nombre*</label> 
                    </div>
                    <div class="input-group-register">
                        <input type="text" name="apellidos_textbox" value={apellidos_textbox} onChange={handleChange} required/>
                        <label for="username">Apellidos*</label>
                    </div>
                    <div class="input-group-register">
                        <input type="email" name="email_textbox" value={email_textbox} onChange={handleChange} required/>
                        <label for="username">Email*</label>
                    </div>
                    <div class="input-group-register">
                        <input type="text" name="departamento_textbox" value={departamento_textbox} onChange={handleChange} required/>
                        <label for="username">Departamento</label>
                    </div>
                    <div class="input-group-register">
                        <input type="text" name="centro_textbox" value={centro_textbox} onChange={handleChange} required/>
                        <label>Centro*</label>
                    </div>
                    <div class="input-group-register">
                    <input type="text" name="fechaAlta_box" value={fechaAlta_box} onFocus={(e) => (e.target.type = "date")} 
                        onBlur={(e) => (e.target.type = "text")} onChange={handleChange} placeholder="" required/>
                        <label>Fecha de Alta*</label>
                    </div>
                    <div className="input-group-register">
                        <select className="perfil-select" name="perfil_desplegable" value={perfil_desplegable} onChange={handleChange} required>
                            <option value="" disabled hidden></option>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <label>Perfil</label>
                        <button type="button" className="select-toggle-btn" value={perfil_desplegable}>
                            <img src={require('../media/flecha.png')} />
                        </button>
                    </div>
                    <div class="input-group-register">
                        <input type={showPassword ? "text" : "password"} name="contrasena_textbox" value={contrasena_textbox} onChange={handleChange} required/>
                        <label>Contraseña*</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <img src={require(showPassword?'../media/password_off.png':'../media/password_on.png')}/>
                        </button>
                    </div>
                    <div class="input-group-register">
                        <input type={showRepeatPassword ? "text" : "password"} name="repetirContrasena_textbox" value={repetirContrasena_textbox} onChange={handleChange} required/>
                        <label>Repetir Contraseña*</label>
                        <button type="button" onClick={toggleRepeatPasswordVisibility} className="repeatPassword-toggle-btn">
                        <img src={require(showRepeatPassword?'../media/password_off.png':'../media/password_on.png')}/>
                        </button>
                    </div>
                <button type="submit" className="register-btn">Registrarse</button>
                <div class="register-options">
                    <p style={{ marginTop: "10px", fontSize: "12px", color: "#555"}}>
                        ¿Ya estás registrado?
                    </p>
                    <a href="#">Iniciar sesión</a>
                </div>
            </form>
        </div>
        </div>
    );
};

export default RegisterForm;
