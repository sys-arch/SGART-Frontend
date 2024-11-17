import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import NavBar from './NavBar';

const UserEdit = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState(user.name);
    const [lastName, setLastName] = useState(user.lastName);
    const [profile, setProfile] = useState(user.profile);
    const [department, setDepartment] = useState(user.department);
    const [hiringDate, setHiringDate] = useState(user.hiringDate);
    const [center, setCenter] = useState(user.center);

    const handleSave = () => {
        // Guardar los cambios realizados al usuario
        const updatedUser = {
            ...user,
            name: name,
            lastName: lastName,
            profile: profile,
            department: department,
            hiringDate: hiringDate,
            center: center
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
            console.log('Datos modificados exitosamente:', data);
        })
        .catch(error => {
            console.error('Error al modificar datos:', error);
        });
        onSave(updatedUser);
    };

    return (
        <>
        <NavBar isAdmin={false} />
        <div className="user-edit-form main-content">
            <div className="user-content">
            <h2>Perfil Usuario</h2>
            <div className="input-group-register">
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Nombre:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label htmlFor="lastName">Apellidos:</label>
            </div>
            <div className="input-group-register">
                <select className="profile-select" id="profile" value={profile} onChange={(e) => setProfile(e.target.value)}>
                    <option value="" disabled hidden></option>
                    <option value="usuario">Desarrollador</option>
                    <option value="usuario">Tester</option>
                    <option value="usuario">Becario</option>
                    <option value="usuario">RRHH</option>
                    <option value="usuario">Contabilidad</option>
                </select>
                <label htmlFor="profile">Perfil:</label>
                <button type="button" className="select-toggle-btn" value={profile}>
                    <img src={require('../media/flecha.png')} alt="Desplegable"/>
                </button>
            </div>
            <div className="input-group-register">
                <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <label htmlFor="department">Departamento:</label>
            </div>
            <div className="input-group-register">
                <input type="date" id="fecha" value={hiringDate} onChange={(e) => setHiringDate(e.target.value)} />
                <label htmlFor="fecha">Fecha de Alta:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="center" value={center} onChange={(e) => setCenter(e.target.value)} />
                <label htmlFor="center">Centro:</label>
            </div>
            <button className="guardar-btn" onClick={handleSave}>Modificar</button>
            <button className="cancelar-btn"onClick={onCancel}>Cerrar</button>
            </div>
        </div>
        </>
    );
};
UserEdit.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        profile: PropTypes.string,
        department: PropTypes.string,
        hiringDate: PropTypes.string,
        center: PropTypes.string
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default UserEdit;
