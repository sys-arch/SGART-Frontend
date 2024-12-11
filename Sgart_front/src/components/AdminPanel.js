import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config.js';
import AdminCreateForm from './AdminCreateForm';
import AdminEditForm from './AdminEditForm';
import NavBar from './NavBar';
import VentanaConfirm from './VentanaConfirm';


const AdminPanel = () => {
    const navigate = useNavigate();
    // Estado que contiene los datos de la tabla
    const [datosAdmin, setDatosAdmin] = useState([]);
    const getToken = () => sessionStorage.getItem('authToken');

    useEffect(() => {
        actualizarAdministradores();
    }, []);
    const actualizarAdministradores = () => {
        fetch(`${config.BACKEND_URL}/admin/getAdmins`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        })

            .then(async response => {
                const result = await response.json();
                const adminsTable = result.map(admin => ({
                    id: admin.id || '',
                    name: admin.name || '',
                    lastName: admin.lastName || '',
                    email: admin.email || '',
                    center: admin.center || '',
                    blocked: admin.blocked || false,
                }));
                setDatosAdmin(adminsTable);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const toggleUserStatus = (email) => {
        fetch(`${config.BACKEND_URL}/admin/cambiarHabilitacion/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
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
    const [adminToSave, setAdminToSave] = useState(null);
    const defaultAdmin = {
        name: '',
        lastName: '',
        email: '',
        password: '',
        center: '',
    };
    const handleCreateAdmin = () => {
        setCreatingAdmin(true);
    }

    const handleSaveAdmin = (updatedAdmin) => {
        setAdminToSave(updatedAdmin);
        setConfirmationAction('save'); // Establece la acción como guardar
        setShowConfirmation(true);
    };

    const handleConfirmSave = async () => {
        const response = await fetch(`${config.BACKEND_URL}/admin/verificarEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ email: adminToSave.email }),
        });
        if(response.ok){
            alert('Correo verificado. Pasando a la autenticación con doble factor...');
            console.log(JSON.stringify(adminToSave));
            navigate('/google-auth', { state: { usuario : adminToSave, esAdmin:true}});
        }else{
            alert('El correo ya está registrado');
        }
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
    };

    // Modificar administradores
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [confirmationAction, setConfirmationAction] = useState('');

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin); // Establece el usuario que se está editando
        setEditingAdmin(true);
    }
    
    const handleUpdateAdmin = (admin) => {
        setAdminToEdit(admin); // Guarda temporalmente el admin que se editará
        setConfirmationAction('edit'); // Establece la acción como 'edit'
        setShowConfirmation(true); // Muestra el modal
    };

    const handleConfirmUpdate = async () => {
        if (!adminToEdit) {
            console.error("adminToEdit es null o undefined antes de ejecutar fetch.");
            return;
        }
    
        try {
            console.log("Enviando adminToEdit al servidor:", adminToEdit);
    
            await fetch(`${config.BACKEND_URL}/admin/modificarAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(adminToEdit),
            });
    
            // Actualiza la tabla de administradores
            setDatosAdmin((prevAdmin) =>
                prevAdmin.map((admin) =>
                    admin.id === adminToEdit.id ? adminToEdit : admin
                )
            );
        } catch (error) {
            console.error("Error al actualizar admin:", error);
        } finally {
            // Mueve estas acciones al final
            setShowConfirmation(false); // Oculta la ventana de confirmación
            setEditingAdmin(false); // Cierra el modo de edición
        }
    };
    
    
    
    

    const handleCancelEdit = () => {
        setEditingAdmin(null);
        setCreatingAdmin(false);
    };



    // Eliminar administradores
    const [adminToDelete, setAdminToDelete] = useState(null);

    const handleDeleteAdmin = (admin) => {
        setAdminToDelete(admin);
        setConfirmationAction('delete'); // Establece la acción como eliminar
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        deleteAdmin(adminToDelete.email);
        setAdminToDelete(null);
        setShowConfirmation(false);
    };
    

    const handleConfirm = () => {
        switch(confirmationAction){
            case 'save':
                handleConfirmSave();
                break;
            case 'edit':
                handleConfirmUpdate();
                break;
            case 'delete':
                handleConfirmDelete();
                break;
            default:
                break;
        }
    }

    const deleteAdmin = (email) => {
        fetch(`${config.BACKEND_URL}/admin/eliminar/email/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
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
                        <tr key={fila.id} className={!fila.blocked ? '':'disabled-user'}>
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
                                    <img src={require('../media/editar-perfil.png')} width={25} alt="Editar Perfil" title="Editar Perfil"/>
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteAdmin(fila)}>
                                <img src={require('../media/bloquear.png')} width={25} alt="Eliminar Perfil" title="Eliminar Perfil"/>
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
                    <AdminEditForm admin={adminToEdit} onSave={handleUpdateAdmin} onCancel={handleCancelEdit} />
                </div>
            )}
        {creatingAdmin && (
                <div className="user-edit-container">
                    <AdminCreateForm admin={defaultAdmin} onSave={handleSaveAdmin} onCancel={handleCancelEdit} />
                </div>
            )}
        {showConfirmation && (
            <VentanaConfirm
                onConfirm={handleConfirm}
                onCancel={handleCancelSave}
                action={confirmationAction}
            />
        )}
        </div>
        </>
    );
};

export default AdminPanel;