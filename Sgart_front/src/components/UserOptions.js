import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const UserOptions = () => {
    const navigate = useNavigate();

    console.log("Renderizando UserOptions");

    return (
        <div className="user-options-container">
            <h2>Gestión de Usuarios</h2>
            <div className="user-options-buttons">
                <button className="option-btn" onClick={() => navigate('/admin-ausencias')}>
                    Gestionar Ausencias
                </button>
                <button className="option-btn" onClick={() => navigate('/user-validation')}>
                    Gestionar Usuarios
                </button>
            </div>
        </div>
    );
};

export default UserOptions;

