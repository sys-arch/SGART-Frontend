import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
            Nombre: nombre,
            Apellidos: apellidos,
            Perfil: perfil,
            Departamento: departamento,
            FechaAlta: fechaAlta,
            Centro: centro
        };
        onSave(updatedUser);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
            <h2>Modificar Usuario</h2>
            <div className="input-group-register">
                <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label htmlFor="nombre">Nombre:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                <label htmlFor="apellidos">Apellidos:</label>
            </div>
            <div className="input-group-register">
                <select className="perfil-select" id="perfil" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                    <option value="" disabled hidden></option>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <label htmlFor="perfil">Perfil:</label>
                <button type="button" className="select-toggle-btn" value={perfil}>
                    <img src={require('../media/flecha.png')} alt="Desplegable"/>
                </button>
            </div>
            <div className="input-group-register">
                <input type="text" id="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                <label htmlFor="departamento">Departamento:</label>
            </div>
            <div className="input-group-register">
                <input type="date" id="fecha" value={fechaAlta} onChange={(e) => setFechaAlta(e.target.value)} />
                <label htmlFor="fecha">Fecha de Alta:</label>
            </div>
            <div className="input-group-register">
                <input type="text" id="centro" value={centro} onChange={(e) => setCentro(e.target.value)} />
                <label htmlFor="centro">Centro:</label>
            </div>
            <button className="guardar-btn" onClick={handleSave}>Guardar</button>
            <button className="cancelar-btn"onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
};
UserEditForm.propTypes = {
    user: PropTypes.shape({
        Nombre: PropTypes.string.isRequired,
        Apellidos: PropTypes.string.isRequired,
        Perfil: PropTypes.string,
        Departamento: PropTypes.string,
        FechaAlta: PropTypes.string,
        Centro: PropTypes.string
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
export default UserEditForm;
