import React, { useState } from 'react';

const UserEditForm = ({ user, onSave, onCancel }) => {
    const [nombre, setNombre] = useState(user.Nombre);
    const [apellidos, setApellidos] = useState(user.Apellidos);
    const [perfil, setPerfil] = useState(user.Perfil || '');
    const [departamento, setDepartamento] = useState(user.Departamento || '');
    const [fechaAlta, setFechaAlta] = useState(user.FechaAlta || '');
    const [centro, setCentro] = useState(user.Centro || '');

    const handleSave = () => {
        // Guardar los cambios realizados al usuario
        const updatedUser = {
            ...user,
            name: nombre,
            lastName: apellidos,
            profile: perfil,
            department: departamento,
            hiringDate: fechaAlta,
            center: centro
        };

        fetch('/users/modificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario editado exitosamente:', data);
        })
        .catch(error => {
            console.error('Error al guardar usuario:', error);
        });
        onSave(updatedUser);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
            <h2>Modificar Usuario</h2>
            <div className="input-group-register">
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label>Nombre:</label>
            </div>
            <div className="input-group-register">
                <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                <label>Apellidos:</label>
            </div>
            <div className="input-group-register">
                <select className="perfil-select" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                    <option value="" disabled hidden></option>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <label>Perfil:</label>
                <button type="button" className="select-toggle-btn" value={perfil}>
                    <img src={require('../media/flecha.png')} />
                </button>
            </div>
            <div className="input-group-register">
                <input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                <label>Departamento:</label>
            </div>
            <div className="input-group-register">
                <input type="date" value={fechaAlta} onChange={(e) => setFechaAlta(e.target.value)} />
                <label>Fecha de Alta:</label>
            </div>
            <div className="input-group-register">
                <input type="text" value={centro} onChange={(e) => setCentro(e.target.value)} />
                <label>Centro:</label>
            </div>
            <button className="guardar-btn" onClick={handleSave}>Guardar</button>
            <button className="cancelar-btn"onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
};

export default UserEditForm;