import React, { useState } from 'react';
import UserEditForm from './UserEditForm';
import VentanaConfirm from './VentanaConfirm';
import { useNavigate } from 'react-router-dom';

const UserValidationUI = () => {
    const navigate = useNavigate();
    // Estado que contiene los datos de la tabla
    const [datosUsuarios, setDatosUsuarios] = useState([
        { id: 1, Nombre: 'Juan', Apellidos: 'Pérez',Email: 'juan.perez@example.com', enabled: true},
        { id: 2, Nombre: 'María', Apellidos: 'López', Email: 'maria.lopez@example.com', enabled: true},
        { id: 3, Nombre: 'Carlos', Apellidos: 'García', Email: 'carlos.garcia@example.com', enabled: true},
    ]);

    const nextUserId=datosUsuarios.length;

    const [datosValidar, setDatosValidar] = useState([
        { id: 4, Nombre: 'Manuel', Apellidos: 'Perales',Email: 'manuel.perales@example.com', enabled: false},
    ]);

    const invalidarUsuario = (id) => {
        // Filtramos el array de datos para eliminar el elemento con el id correspondiente
        const nuevosDatos = datosValidar.filter((item) => item.id !== id);
        setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
    };

    const validarUsuario = (id) => {
        const usuario = datosValidar.filter((item) => item.id === id);
        const nuevosDatos = datosValidar.filter((item) => item.id !== id);
        setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
        setDatosUsuarios(datosUsuarios.concat(usuario)); // Actualizamos el estado con los nuevos datos
    }
    //Modificar usuarios
    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userToSave, setUserToSave] = useState(null);
    const [confirmationAction, setConfirmationAction] = useState('');
    
    const handleEditUser = (user) => {
        setEditingUser(user); // Establece el usuario que se está editando
    };
    
    const handleSaveUser = (updatedUser) => {
        setUserToSave(updatedUser);
        setConfirmationAction('save'); // Establece la acción como guardar
        setShowConfirmation(true);
    };

    const handleConfirmSave = () => {
        setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.id === userToSave.id ? userToSave : user
            )
        );
        setEditingUser(null);
        setShowConfirmation(false);
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    }; 

    //Eliminar usuarios
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setConfirmationAction('delete'); // Establece la acción como eliminar
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.filter((user) => user.id !== userToDelete.id)
        );
        setUserToDelete(null);
        setShowConfirmation(false);
    };

    const toggleUserStatus = (userId) => {
        setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.id === userId ? { ...user, enabled: !user.enabled } : user
            )
        );
    };

    return (
        <div className="user-validation-container">
        <div className="admin-buttons">
            <button className="admin-btn" onClick={() => navigate('/user-options')}>
                <img src={require('../media/user_management_btn.png')} width={60} alt="Mant. Usuarios" title="Mant. Usuarios"/>
            </button>
            <button className="admin-btn">
                <img src={require('../media/admin_management_btn.png')} width={60} alt="Mant. Administradores" title="Mant. Administradores"/>
            </button>
            <button className="admin-btn" onClick={() => navigate('/admin-working-hours')}>
                <img src={require('../media/calendar_management_btn.png')} width={60} alt="Mant. Calendario" title="Mant. Calendario"/>
            </button>
        </div>
        <div className="login-box">
        <body>
                <h2>Pendientes de validación</h2>
                <table className="user-table">
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
                                <button className="validate-btn" onClick={() => validarUsuario(fila.id)}>
                                    <img src={require('../media/garrapata.png')} width={25} alt="Validar Usuario" title="Validar Usuario"/>
                                </button>
                                <button className="delete-btn" onClick={() => invalidarUsuario(fila.id)}>
                                    <img src={require('../media/cancelar.png')} width={25} alt="Invalidar Usuario" title="Invalidar Usuario"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </body>
            <body>
                <h2>Listado de Usuarios</h2>
                <table className="user-table">
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
                        <tr key={fila.id} className={!fila.enabled ? 'disabled-user' : ''}>
                            <td>{fila.id}</td>
                            <td>{fila.Nombre}</td>
                            <td>{fila.Apellidos}</td>
                            <td>{fila.Email}</td>
                            <td>
                                <button className={fila.enabled ? 'deshabilitar-btn' : 'habilitar-btn'}
                                    onClick={() => toggleUserStatus(fila.id)}>
                                    <img 
                                        src={fila.enabled ? require('../media/deshabilitar-cursor.png') : require('../media/mano.png')} 
                                        alt={fila.enabled ? 'Deshabilitar' : 'Habilitar'}
                                        style={{ width: '25px', height: '25px' }} title={fila.enabled ? 'Deshabilitar' : 'Habilitar'}
                                    />
                                </button>
                                <button className="edit-btn" onClick={() => handleEditUser(fila)}>
                                    <img src={require('../media/editar-perfil.png')} width={25} alt="Editar Perfil" title="Editar Perfil"/>
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteUser(fila)}>
                                <img src={require('../media/bloquear.png')} width={25} alt="Eliminar Perfil" title="Eliminar Perfil"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </body>
            {editingUser && (
                <div className="user-edit-container">
                    <UserEditForm user={editingUser} onSave={handleSaveUser} onCancel={handleCancelEdit} />
                </div>
            )}
        </div>
        {showConfirmation && (
            <VentanaConfirm
                onConfirm={confirmationAction === 'save' ? handleConfirmSave : handleConfirmDelete}
                onCancel={handleCancelSave}
                action={confirmationAction}
            />
        )}
        </div>
    );
};

export default UserValidationUI;