import React, { useState } from 'react';

const UserValidationUI = () => {

    // Estados de cada campo del formulario
    const [email_textbox, setEmail] = useState('');
    const [contrasena_textbox, setContrasena] = useState('');
    const [repetirContrasena_textbox, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }; 

    return (
        <div class="user-validation-container">
        <div class="login-box">
            <body>
                <h2>Listado de Usuarios</h2>
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Juan Pérez</td>
                            <td>juan.perez@example.com</td>
                            <td>
                                <button class="validate-btn">Validar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>María López</td>
                            <td>maria.lopez@example.com</td>
                            <td>
                                <button class="validate-btn">Validar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Carlos García</td>
                            <td>carlos.garcia@example.com</td>
                            <td>
                                <button class="validate-btn">Validar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </div>
        </div>
    );
};

export default UserValidationUI;