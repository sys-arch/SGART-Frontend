import React, { useState } from 'react';

const RegisterForm = () => {

    // Estados de cada campo del formulario
    const [nombre_textbox, setNombre] = useState('');
    const [apellidos_textbox, setApellidos] = useState('');
    const [email_textbox, setEmail] = useState('');
    const [departamento_textbox, setDepartamento] = useState('');
    const [centro_textbox, setCentro] = useState('');
    const [fechaAlta_box, setFechaAlta] = useState('');
    const [perfil_desplegable, setPerfil] = useState('usuario');
    const [contrasena_textbox, setContrasena] = useState('');
    const [repetirContrasena_textbox, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');

    // Cambios en los campos del formulario
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

        // Validación de fecha (no puede ser una fecha futura)
        const fechaSeleccionada = new Date(fechaAlta_box);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            setError('La fecha de alta no puede ser una fecha futura.');
            return;
        }

        alert('Registro exitoso');
        setError('');
        // Enviar datos al backend...
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Nombre*</label>
                <input type="text" name="nombre_textbox" required/>
            </div>
            <div>
                <label>Apellidos*</label>
                <input type="text" name="apellidos_textbox" required/>
            </div>
            <div>
                <label>Email*</label>
                <input type="email" name="email_textbox" required/>
            </div>
            <div>
                <label>Departamento</label>
                <input type="text" name="departamento_textbox" />
            </div>
            <div>
                <label>Centro*</label>
                <input type="text" name="centro_textbox" required />
            </div>
            <div>
                <label>Fecha de Alta*</label>
                <input type="date" name="fechaAlta_box" required />
            </div>
            <div>
                <label>Perfil</label>
                <select name="perfil_desplegable">
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div>
                <label>Contraseña*</label>
                <input type="password" name="contrasena_textbox" value={contrasena_textbox} onChange={handleChange} required />
            </div>
            <div>
                <label>Repetir Contraseña*</label>
                <input type="password" name="repetirContrasena_textbox" value={repetirContrasena_textbox} onChange={handleChange} required />
            </div>

            <button type="submit">Registrarse</button>
        </form>
    );
};

export default RegisterForm;