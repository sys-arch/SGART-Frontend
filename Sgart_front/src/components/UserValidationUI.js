import React, { useState, useEffect } from 'react';
import UserEditForm from './UserEditForm';
import VentanaConfirm from './VentanaConfirm';
import axios, { AxiosHeaders } from 'axios';


const UserValidationUI = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        
    }
    // Estado que contiene los datos de la tabla
    const [datosUsuarios, setDatosUsuarios] = useState([]);

    const [datosValidar, setDatosValidar] = useState([
        { name: 'Carlos', lastName: 'García', email: 'carlos.garcia@example.com', blocked: false},
    ]);

    useEffect(() => {
        fetch('admin/getUsuariosValidados')
          .then(async response => {
            const result=await response.json();
            const usersTable=result.map(user=>({
                email: user.email,
                name:user.name,
                lastName:user.lastName,
                blocked:user.blocked,
            }));
            setDatosUsuarios(usersTable);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);

    const invalidarUsuario = (email) => {
        // Filtramos el array de datos para eliminar el elemento con el email correspondiente
        const nuevosDatos = datosValidar.filter((item) => item.email !== email);
        setDatosValidar(nuevosDatos); // Actualizamos el estado con los nuevos datos
    };

    const validarUsuario = (email) => {
        var usuario = datosValidar.filter((item) => item.email === email);
        const nuevosDatos = datosValidar.filter((item) => item.email !== email);
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
                user.email === userToSave.email ? userToSave : user
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
            prevUsuarios.filter((user) => user.email !== userToDelete.email)
        );
        setUserToDelete(null);
        setShowConfirmation(false);
    };

    const toggleUserStatus = (email) => {
        fetch('admin/cambiarHabilitacion/'+email,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
          .then(response => {
            
          })
          .catch(error => {
            console.error('Error updating user: ',error);
          });
        setDatosUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.email === email ? { ...user, blocked: !user.blocked } : user
            )
        );
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
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {datosValidar.map((fila) => (
                        <tr key={fila.email}>
                            <td>{fila.email}</td>
                            <td>{fila.name}</td>
                            <td>{fila.lastName}</td>
                            <td>
                                <button class="validate-btn" onClick={() => validarUsuario(fila.email)}>
                                    <img src={require('../media/garrapata.png')} width={25}/>
                                </button>
                                <button class="delete-btn" onClick={() => invalidarUsuario(fila.email)}>
                                    <img src={require('../media/cancelar.png')} width={25}/>
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
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {datosUsuarios.map((fila) => (
                        <tr key={fila.email} className={!fila.blocked ? '' : 'disabled-user'}>
                            <td>{fila.email}</td>
                            <td>{fila.name}</td>
                            <td>{fila.last_name}</td>
                            <td>
                                <button className={fila.blocked ? 'habilitar-btn':'deshabilitar-btn'}
                                    onClick={() => toggleUserStatus(fila.email)}>
                                    <img 
                                        src={fila.blocked ? require('../media/mano.png'):require('../media/deshabilitar-cursor.png')} 
                                        alt={fila.blocked ? 'Habilitar':'Deshabilitar'}
                                        style={{ width: '25px', height: '25px' }} 
                                    />
                                </button>
                                <button class="edit-btn" onClick={() => handleEditUser(fila)}>
                                    <img src={require('../media/editar-perfil.png')} width={25}/>
                                </button>
                                <button class="delete-btn" onClick={() => handleDeleteUser(fila)}>
                                <img src={require('../media/bloquear.png')} width={25}/>
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