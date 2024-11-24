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
        const updatedUser = {
            ...user,
            name,
            lastName,
            profile,
            department,
            hiringDate,
            center,
        };

        // Realizar la solicitud al backend
        fetch('users/modificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al modificar los datos del usuario');
                }
                return response.json();
            })
            .then(data => {
                console.log('Usuario actualizado exitosamente:', data);
                alert('Usuario modificado exitosamente');
                onSave(data); // Notificar al componente padre los datos actualizados
            })
            .catch(error => {
                console.error('Error al guardar usuario:', error);
                alert('Hubo un problema al modificar los datos del usuario.');
            });
    };

    const handleCancel = () => {
        console.log('Edición cancelada');
        alert('Edición cancelada');
        onCancel();
    };

    return (
        <>
            <NavBar isAdmin={false} />
            <div className="user-edit-form">
                <div className="user-content">
                    <h2>Perfil Usuario</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="name">Nombre:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="lastName">Apellidos:</label>
                    </div>
                    <div className="input-group">
                        <select
                            className="perfil-select"
                            id="perfil_desplegable"
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        >
                            <option value="" disabled hidden></option>
                            <option value="Desarrollador">Desarrollador</option>
                            <option value="Tester">Tester</option>
                            <option value="Becario">Becario</option>
                            <option value="RRHH">RRHH</option>
                            <option value="Contabilidad">Contabilidad</option>
                        </select>
                        <label className='slct-label' htmlFor="perfil_desplegable">Perfil:</label>
                        <button type="button" className="select-toggle-btn">
                            <img src={require('../media/flecha.png')} alt="Desplegable" />
                        </button>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                        <label htmlFor="department">Departamento:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            id="fecha"
                            value={hiringDate}
                            onChange={(e) => setHiringDate(e.target.value)}
                        />
                        <label htmlFor="fecha">Fecha de Alta:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="center"
                            value={center}
                            onChange={(e) => setCenter(e.target.value)}
                        />
                        <label htmlFor="center">Centro:</label>
                    </div>
                    <button className="guardar-btn" onClick={handleSave}>
                        Modificar
                    </button>
                    <button className="cancelar-btn" onClick={handleCancel}>
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};

UserEdit.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        lastName: PropTypes.string,
        profile: PropTypes.string,
        department: PropTypes.string,
        hiringDate: PropTypes.string,
        center: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default UserEdit;
