import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AdminManagementForm = ({ admin, creating, onSave, onCancel }) => {
    const [name, setName] = useState(admin.name || '');
    const [lastName, setLastName] = useState(admin.lastName || '');
    const [profile, setProfile] = useState(admin.profile || '');
    const [department, setDepartment] = useState(admin.department || '');
    const [hiringDate, setHiringDate] = useState(admin.hiringDate || '');
    const [center, setCenter] = useState(admin.center || '');

    const handleSave = () => {
        // Guardar los cambios realizados al usuario
        const updatedAdmin = {
            ...admin,
            name: name,
            lastName: lastName,
            center: center
        };

        /*fetch('/users/modificar', {
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
        });*/
        onSave(updatedAdmin);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
            <h2>{creating?'Crear administrador':'Modificar administrador'}</h2>
            <div className="input-group-register">
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Nombre:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label htmlFor="lastName">Apellidos:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="center" value={center} onChange={(e) => setCenter(e.target.value)} />
                <label htmlFor="center">Centro:</label>
            </div>
            <button className="guardar-btn" onClick={handleSave}>Guardar</button>
            <button className="cancelar-btn"onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
};
AdminManagementForm.propTypes = {
    admin: PropTypes.shape({
        name: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        center: PropTypes.string
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AdminManagementForm;