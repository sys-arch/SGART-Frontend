import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import NavBar from './NavBar';
import UserEditForm from './UserEditForm';
import VentanaConfirm from './VentanaConfirm';

const UserValidationUI = () => {
    const navigate = useNavigate();
    const [datosUsuarios, setDatosUsuarios] = useState([]);
    const [datosValidar, setDatosValidar] = useState([]);

    const getToken = () => sessionStorage.getItem('authToken');

    useEffect(() => {
        actualizarUsuarios();
    }, []);

    const actualizarUsuarios = () => {
        fetch(`${config.BACKEND_URL}/admin/getUsuariosSinValidar`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .then(async response => {
                const result = await response.json();
                const usersTable = result.map(user => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    department: user.department,
                    center: user.center,
                    hiringDate: user.hiringDate,
                    profile: user.profile,
                    blocked: user.blocked,
                }));
                setDatosValidar(usersTable);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        fetch(`${config.BACKEND_URL}/admin/getUsuariosValidados`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .then(async response => {
                const result = await response.json();
                const usersTable = result.map(user => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    department: user.department,
                    center: user.center,
                    hiringDate: user.hiringDate,
                    profile: user.profile,
                    blocked: user.blocked,
                }));
                setDatosUsuarios(usersTable);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const invalidarUsuario = (email) => {
        fetch(`${config.BACKEND_URL}/admin/eliminar/email/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .then(response => {
                const nuevosDatos = datosValidar.filter((item) => item.email !== email);
                setDatosValidar(nuevosDatos);
            })
            .catch(error => {
                console.error('Error unvalidating user: ', error);
            });
    };

    const validarUsuario = (email) => {
        fetch(`${config.BACKEND_URL}/admin/validar/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .then(() => {
                actualizarUsuarios();
            })
            .catch(error => {
                console.error('Error validating user: ', error);
            });
    };

    const toggleUserStatus = (email) => {
        fetch(`${config.BACKEND_URL}/admin/cambiarHabilitacion/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .catch(error => {
                console.error('Error toggling user status: ', error);
            });

        setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.email === email ? { ...user, blocked: !user.blocked } : user
            )
        );
    };

    const [editingUser, setEditingUser] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userToSave, setUserToSave] = useState(null);
    const [confirmationAction, setConfirmationAction] = useState('');

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleSaveUser = (updatedUser) => {
        setUserToSave(updatedUser);
        setConfirmationAction('save');
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

    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setConfirmationAction('delete');
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        eliminarUsuario(userToDelete.email);
        setUserToDelete(null);
        setShowConfirmation(false);
    };

    const eliminarUsuario = (email) => {
        fetch(`${config.BACKEND_URL}/admin/eliminar/email/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        })
            .then(response => {
                const nuevosDatos = datosUsuarios.filter((item) => item.email !== email);
                setDatosUsuarios(nuevosDatos);
            })
            .catch(error => {
                console.error('Error deleting user: ', error);
            });
    };

    return (
        <>
            <NavBar isAdmin={true} />
            <div className="user-validation-container">
                <div className="login-box">
                    <body>
                        <h2>Pendientes de validación</h2>
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
                                {datosValidar.map((fila) => (
                                    <tr key={fila.id}>
                                        <td>{fila.id}</td>
                                        <td>{fila.name}</td>
                                        <td>{fila.lastName}</td>
                                        <td>{fila.email}</td>
                                        <td>
                                            <button className="validate-btn" onClick={() => validarUsuario(fila.email)}>
                                                <img src={require('../media/garrapata.png')} width={25} alt="Validar Usuario" title="Validar Usuario" />
                                            </button>
                                            <button className="delete-btn" onClick={() => invalidarUsuario(fila.email)}>
                                                <img src={require('../media/cancelar.png')} width={25} alt="Invalidar Usuario" title="Invalidar Usuario" />
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
                                    <tr key={fila.id} className={!fila.blocked ? '' : 'disabled-user'}>
                                        <td>{fila.id}</td>
                                        <td>{fila.name}</td>
                                        <td>{fila.lastName}</td>
                                        <td>{fila.email}</td>
                                        <td>
                                            <button className={fila.blocked ? 'habilitar-btn' : 'deshabilitar-btn'}
                                                onClick={() => toggleUserStatus(fila.email)}>
                                                <img
                                                    src={fila.blocked ? require('../media/mano.png') : require('../media/deshabilitar-cursor.png')}
                                                    alt={fila.blocked ? 'Habilitar' : 'Deshabilitar'}
                                                    style={{ width: '25px', height: '25px' }} title={fila.blocked ? 'Habilitar' : 'Deshabilitar'}
                                                />
                                            </button>
                                            <button className="edit-btn" onClick={() => handleEditUser(fila)}>
                                                <img src={require('../media/editar-perfil.png')} width={25} alt="Editar Perfil" title="Editar Perfil" />
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDeleteUser(fila)}>
                                                <img src={require('../media/bloquear.png')} width={25} alt="Eliminar Perfil" title="Eliminar Perfil" />
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
        </>
    );
};

export default UserValidationUI;
