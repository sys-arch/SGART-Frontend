import React, { useState, useEffect } from 'react';
import UserEditForm from './UserEditForm';
import VentanaConfirm from './VentanaConfirm';
import AdminManagementForm from './AdminManagementForm';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';

const AdminPanel = () => {
    const navigate = useNavigate();
    // Estado que contiene los datos de la tabla
    const [datosAdmin, setDatosAdmin] = useState([]);

    useEffect(() => {
        actualizarAdministradores();
    }, []);

    const actualizarAdministradores = () => {

    }

    const validarAdmin = (email) => {
        /*
        fetch('admin/validar/'+email,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
          .then(response => {
            actualizarUsuarios();
          })
          .catch(error => {
            console.error('Error updating user: ',error);
          });
          setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.email === email ? { ...user, blocked: !user.blocked } : user
            )
        );*/
    }

    const invalidarAdmin = (email) => {
        // Filtramos el array de datos para eliminar el elemento con el id correspondiente
        /*fetch('admin/eliminar/email/'+email,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
          .then(response => {
            const nuevosDatos = datosValidar.filter((item) => item.email !== email);
            setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
          })
          .catch(error => {
            console.error('Error unvalidating user: ',error);
          });*/
    };

    const toggleUserStatus = (email) => {
        fetch('admin/cambiarHabilitacion/' + email, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {

            })
            .catch(error => {
                console.error('Error updating user: ', error);
            });
        setDatosAdmin((prevAdmin) =>
            prevAdmin.map((admin) =>
                admin.email === email ? { ...admin, blocked: !admin.blocked } : admin
            )
        );
    }

    // Crear administradores
    const [creatingAdmin, setCreatingAdmin] = useState(false);
    const defaultAdmin = {
        id: "1",
        email: "email@email.com",
        name: "name",
        lastName: "lastName",
        center: "center"
    };
    const handleCreateAdmin = () => {
        setCreatingAdmin(true);
    }

    // Modificar administradores
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [adminToSave, setAdminToSave] = useState(null);
    const [confirmationAction, setConfirmationAction] = useState('');

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin); // Establece el usuario que se está editando
    };

    const handleSaveAdmin = (updatedAdmin) => {
        setAdminToSave(updatedAdmin);
        setConfirmationAction('save'); // Establece la acción como guardar
        setShowConfirmation(true);
    };

    const handleConfirmSave = () => {
        datosAdmin.push(adminToSave)
        setEditingAdmin(null);
        setCreatingAdmin(false);
        setShowConfirmation(false);
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
    };

    const handleCancelEdit = () => {
        setEditingAdmin(null);
        setCreatingAdmin(false);
    };

    // Eliminar administradores
    const [adminToDelete, setAdminToDelete] = useState(null);

    const handleDeleteUser = (admin) => {
        setAdminToDelete(admin);
        setConfirmationAction('delete'); // Establece la acción como eliminar
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        eliminarAdmin(adminToDelete.email);
        setAdminToDelete(null);
        setShowConfirmation(false);
    };

    const eliminarAdmin = (email) => {
        fetch('admin/eliminar/email/' + email, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const nuevosDatos = datosAdmin.filter((item) => item.email !== email);
                setDatosAdmin(nuevosDatos); // Actualizamos el estado con los nuevos datos
            })
            .catch(error => {
                console.error('Error deleting user: ', error);
            });
    }

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <NavBar isAdmin={true} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="user-validation-container">
                    <div className="login-box">
                        <body>
                            <h2>Listado de Administradores</h2>
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
                                    {datosAdmin.map((fila) => (
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
                                                <button className="edit-btn" onClick={() => handleEditAdmin(fila)}>
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
                    </div>
                    <button className="create-admin-btn" onClick={() => handleCreateAdmin()}>
                        Crear admin
                    </button>
                    {editingAdmin && (
                        <div className="user-edit-container">
                            <AdminManagementForm admin={editingAdmin} creating={false} onSave={handleSaveAdmin} onCancel={handleCancelEdit} />
                        </div>
                    )}
                    {creatingAdmin && (
                        <div className="user-edit-container">
                            <AdminManagementForm admin={defaultAdmin} creating={true} onSave={handleSaveAdmin} onCancel={handleCancelEdit} />
                        </div>
                    )}
                    {showConfirmation && (
                        <VentanaConfirm
                            onConfirm={confirmationAction === 'save' ? handleConfirmSave : handleConfirmDelete}
                            onCancel={handleCancelSave}
                            action={confirmationAction}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default AdminPanel;