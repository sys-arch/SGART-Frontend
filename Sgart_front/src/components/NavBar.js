import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const NavBar = ({ isAdmin }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleProfileClick = () => {
        setIsDropdownOpen((prevState) => !prevState); // Alternar entre abierto/cerrado
    };


    return (
        <div className="navbar-container">
            <div className="navbar-logo">
                <img src={require('../media/logo_sgart-sinfondo.png')} alt="Logo" />
            </div>

            <div className="navbar-actions">
                {/* Mostrar botones adicionales si es admin */}
                {isAdmin && (
                    <>
                        <button className="user-calendar-btn" onClick={() => navigate('/user-options')}>
                            <img src={require('../media/user_management_btn.png')} width={40} alt="Usuarios" title="Mantenimiento Usuarios" />
                        </button>
                        <button className="user-calendar-btn" onClick={() => navigate('/admin-working-hours')}>
                            <img src={require('../media/admin_management_btn.png')} width={40} alt="Administradores" title="Mantenimiento Administradores" />
                        </button>
                        <button className="user-calendar-btn" onClick={() => navigate('/admin-calendar-view')}>
                            <img src={require('../media/calendar_management_btn.png')} width={40} alt="Calendario" title="Calendario" />
                        </button>
                    </>
                )}

                {isAdmin === false && (
                <button className="user-calendar-btn" onClick={() => navigate('/user-calendar')}>
                    <img
                        src={require('../media/calendar_management_btn.png')}
                        width={40}
                        alt="Calendario"
                        title="Calendario"
                    />
                </button>
                )}
            </div>

            <div className={`navbar-profile ${isDropdownOpen ? 'active' : ''}`}>
                {/* Ícono del perfil que despliega el menú */}
                <div className="profile-icon" title="Perfil" onClick={handleProfileClick}>
                    <img src={require(isAdmin ? '../media/corona.png' : '../media/hombre.png')} alt="Perfil" />
                </div>

                {/* Menú desplegable */}
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => navigate('/user-profile')}>Mi Perfil</button>
                        <button onClick={() => console.log('Cerrar sesión')}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;