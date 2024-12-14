import PropTypes from 'prop-types';
import React, { useState } from 'react';

const AdminCreateForm = ({ admin = {}, onSave, onCancel }) => {
    const [name, setName] = useState(admin.name || '');
    const [lastName, setLastName] = useState(admin.lastName || '');
    const [center, setCenter] = useState(admin.center || '');

    const [errorName, setErrorName] = useState('');
    const [errorLastName, setErrorLastName] = useState('');
    const [errorCenter, setErrorCenter] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'center':
                setCenter(value);
                break;
            default:
                break;
        }
    };

    const validateForm = () => {
        let errorBool = false;
        setErrorName('');
        setErrorLastName('');
        setErrorCenter('');

        if (name === '') {
            setErrorName('Campo vacío');
            errorBool = true;
        }
        if (lastName === '') {
            setErrorLastName('Campo vacío');
            errorBool = true;
        }
        if (center === '') {
            setErrorCenter('Campo vacío');
            errorBool = true;
        }

        return !errorBool;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        const updatedAdmin = {
            ...admin,
            name: name,
            lastName: lastName,
            center: center,
        };

        onSave(updatedAdmin);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
                <h2>Modificar administrador</h2>
                <div className={errorName === '' ? "input-group" : "input-group-error"}>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required />
                    <label htmlFor="name">Nombre*</label>
                </div>
                <label className="error">{errorName}</label>
                <div className={errorLastName === '' ? "input-group" : "input-group-error"}>
                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={handleChange} required />
                    <label htmlFor="lastName">Apellidos*</label>
                </div>
                <label className="error">{errorLastName}</label>
                <div className={errorCenter === '' ? "input-group" : "input-group-error"}>
                    <input type="text" id="center" name="center" value={center} onChange={handleChange} required />
                    <label htmlFor="center">Centro*</label>
                </div>
                <label className="error">{errorCenter}</label>

                <button className="guardar-btn" onClick={handleSave}>
                    Guardar
                </button>
                <button className="cancelar-btn" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

AdminCreateForm.propTypes = {
    admin: PropTypes.shape({
        name: PropTypes.string,
        lastName: PropTypes.string,
        center: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AdminCreateForm;
