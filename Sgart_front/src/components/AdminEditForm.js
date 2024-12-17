import PropTypes from 'prop-types';
import React, { useState } from 'react';


const InputField = ({ id, label, value, error, onChange }) => (
    <div className={error === '' ? "input-group" : "input-group-error"}>
        <input type="text" id={id} name={id} value={value} onChange={onChange} required />
        <label htmlFor={id}>{label}*</label>
        {error && <label className="error">{error}</label>}
    </div>
);

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const AdminCreateForm = ({ admin = {}, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: admin.name || '',
        lastName: admin.lastName || '',
        center: admin.center || '',
    });

    const [errors, setErrors] = useState({
        name: '',
        lastName: '',
        center: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Campo vacío';
        if (!formData.lastName) newErrors.lastName = 'Campo vacío';
        if (!formData.center) newErrors.center = 'Campo vacío';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const updatedAdmin = { ...admin, ...formData };
        onSave(updatedAdmin);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
                <h2>Modificar administrador</h2>
                <InputField
                    id="name"
                    label="Nombre"
                    value={formData.name}
                    error={errors.name}
                    onChange={handleChange}
                />
                <InputField
                    id="lastName"
                    label="Apellidos"
                    value={formData.lastName}
                    error={errors.lastName}
                    onChange={handleChange}
                />
                <InputField
                    id="center"
                    label="Centro"
                    value={formData.center}
                    error={errors.center}
                    onChange={handleChange}
                />
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
