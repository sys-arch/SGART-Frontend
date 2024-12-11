import PropTypes from 'prop-types';
import React, { useState } from 'react';

const AdminCreateForm = ({ admin = {}, onSave, onCancel }) => {
    const [name, setName] = useState(admin?.name || '');
    const [lastName, setLastName] = useState(admin?.lastName || '');
    const [email, setEmail] = useState(admin?.email || '');
    const [password, setPassword] = useState('');
    const [center, setCenter] = useState(admin?.center || '');
    
    const [errorName, setErrorName] = useState('');
    const [errorLastName, setErrorLastName] = useState('');
    const [errorCenter, setErrorCenter] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'center':
                setCenter(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSave = () => {
        let errorBool = false;
        setErrorName('');
        setErrorLastName('');
        setErrorCenter('');
        setErrorPassword('');
        setErrorEmail('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail('El formato del correo electrónico no es válido.');
            errorBool = true;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorPassword('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            errorBool = true;
        }

        if (name === '') {
            setErrorName('Campo vacío');
            errorBool = true;
        }
        if (lastName === '') {
            setErrorLastName('Campo vacío');
            errorBool = true;
        }
        if (email === '') {
            setErrorEmail('Campo vacío');
            errorBool = true;
        }
        if (center === '') {
            setErrorCenter('Campo vacío');
            errorBool = true;
        }
        if (password === '') {
            setErrorPassword('Campo vacío');
            errorBool = true;
        }

        if (errorBool) {
            return;
        }

        const updatedAdmin = {
            name,
            lastName,
            email,
            password,
            center,
        };
        onSave(updatedAdmin);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
                <h2>Crear administrador</h2>
                <div className={errorName === '' ? 'input-group' : 'input-group-error'}>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required />
                    <label htmlFor="name">Nombre*</label>
                </div>
                <label className="error">{errorName}</label>
                <div className={errorLastName === '' ? 'input-group' : 'input-group-error'}>
                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={handleChange} required />
                    <label htmlFor="lastName">Apellidos*</label>
                </div>
                <label className="error">{errorLastName}</label>
                <div className={errorEmail === '' ? 'input-group' : 'input-group-error'}>
                    <input type="text" id="email" name="email" value={email} onChange={handleChange} required />
                    <label htmlFor="email">Email*</label>
                </div>
                <label className="error">{errorEmail}</label>
                <div className={errorPassword === '' ? 'input-group' : 'input-group-error'}>
                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={handleChange} required />
                    <label htmlFor="password">Contraseña*</label>
                    <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <img
                            src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')}
                            alt="Mostrar Contraseña"
                        />
                    </button>
                </div>
                <label className="error">{errorPassword}</label>
                <div className={errorCenter === '' ? 'input-group' : 'input-group-error'}>
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
        email: PropTypes.string,
        password: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

AdminCreateForm.defaultProps = {
    admin: {
        name: '',
        lastName: '',
        center: '',
        email: '',
        password: '',
    },
};

export default AdminCreateForm;
