import React, { useState } from 'react';

const UserValidationUI = () => {

    // Estados de cada campo del formulario
    const [email_textbox, setEmail] = useState('');
    const [contrasena_textbox, setContrasena] = useState('');
    const [repetirContrasena_textbox, setRepetirContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        
    }
    return (
        <div class="user-validation-container">
        <div class="admin-buttons">
            <button class="admin-btn">
                <img src={require('../media/user_management_btn.png')} width={60}/>
            </button>
            <button class="admin-btn">
                <img src={require('../media/admin_management_btn.png')} width={60}/>
            </button>
            <button class="admin-btn">
                <img src={require('../media/calendar_management_btn.png')} width={60}/>
            </button>
        </div>
        <div class="login-box">
        <body>
                <h2>Pendientes de validación</h2>
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Manuel</td>
                            <td>Perales</td>
                            <td>manuel.perales@example.com</td>
                            <td>
                                <button class="validate-btn">Validar</button>
                                <button class="delete-btn">Invalidar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            <body>
                <h2>Listado de Usuarios</h2>
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Juan</td>
                            <td>Pérez</td>
                            <td>juan.perez@example.com</td>
                            <td>
                                <button class="validate-btn">Habilitar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>María</td>
                            <td>López</td>
                            <td>maria.lopez@example.com</td>
                            <td>
                                <button class="validate-btn">Habilitar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Carlos</td>
                            <td>García</td>
                            <td>carlos.garcia@example.com</td>
                            <td>
                                <button class="validate-btn">Habilitar</button>
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