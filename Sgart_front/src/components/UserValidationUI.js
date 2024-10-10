import React, { useState } from 'react';

const UserValidationUI = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        
    }
    // Estado que contiene los datos de la tabla
    const [datosUsuarios, setDatosUsuarios] = useState([
        { id: 1, Nombre: 'Juan', Apellidos: 'Pérez',Email: 'juan.perez@example.com'},
        { id: 2, Nombre: 'María', Apellidos: 'López', Email: 'maria.lopez@example.com'},
        { id: 3, Nombre: 'Carlos', Apellidos: 'García', Email: 'carlos.garcia@example.com'},
    ]);

    var nextUserId=datosUsuarios.length;

    const [datosValidar, setDatosValidar] = useState([
        { id: 1, Nombre: 'Manuel', Apellidos: 'Perales',Email: 'manuel.perales@example.com'},
    ]);

    const invalidarUsuario = (id) => {
        // Filtramos el array de datos para eliminar el elemento con el id correspondiente
        const nuevosDatos = datosValidar.filter((item) => item.id !== id);
        setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
    };

    const validarUsuario = (id) => {
        var usuario = datosValidar.filter((item) => item.id === id);
        const nuevosDatos = datosValidar.filter((item) => item.id !== id);
        setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
        setDatosUsuarios(datosUsuarios.concat(usuario)); // Actualizamos el estado con los nuevos datos
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
                            <th>id</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {datosValidar.map((fila) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.Nombre}</td>
                            <td>{fila.Apellidos}</td>
                            <td>{fila.Email}</td>
                            <td>
                                <button class="validate-btn" onClick={() => validarUsuario(fila.id)}>Validar</button>
                                <button class="delete-btn" onClick={() => invalidarUsuario(fila.id)}>Invalidar</button>
                            </td>
                        </tr>
                    ))}
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
                    {datosUsuarios.map((fila) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.Nombre}</td>
                            <td>{fila.Apellidos}</td>
                            <td>{fila.Email}</td>
                            <td>
                                <button class="validate-btn">Habilitar</button>
                                <button class="edit-btn">Modificar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </body>
        </div>
        </div>
    );
};

export default UserValidationUI;