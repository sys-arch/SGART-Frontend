import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import VentanaConfirm from './VentanaConfirm';
import Notificaciones from './Notificaciones'; // Importar el componente Notificaciones

const NavBar = ({ isAdmin }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showNotificaciones, setShowNotificaciones] = useState(false);
    const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(false); // Estado para nuevas notificaciones

    const handleProfileClick = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        setShowConfirmation(true);
    };

    const confirmLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/');
        setShowConfirmation(false);
    };

    // Comprobar notificaciones no leídas
    const checkNotificaciones = async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) return;

            const response = await fetch("http://localhost:9000/notificaciones", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar notificaciones");

            const data = await response.json();
            // Verificar si hay notificaciones no leídas
            const hayNoLeidas = data.some((notificacion) => !notificacion.leida);
            setNotificacionesNoLeidas(hayNoLeidas);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        }
    };

    useEffect(() => {
        checkNotificaciones();
    }, []);

    // Abrir/cerrar popup de notificaciones y marcar como leídas
    const toggleNotificaciones = async () => {
        setShowNotificaciones((prevState) => !prevState);

        if (!showNotificaciones) {
            try {
                const token = sessionStorage.getItem('authToken');
                const response = await fetch("http://localhost:9000/notificaciones/marcar-leidas", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setNotificacionesNoLeidas(false); // Quitar el punto rojo
                }
            } catch (error) {
                console.error("Error al marcar notificaciones como leídas:", error);
            }
        }
    };

    return (
        <>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={require('../media/logo_sgart-sinfondo.png')} alt="Logo" />
                </div>

                <div className="navbar-actions">
                    {isAdmin && (
                        <>
                            <button className="user-calendar-btn" onClick={() => navigate('/user-options')}>
                                <img src={require('../media/user_management_btn.png')} width={40} alt="Usuarios" title="Mantenimiento Usuarios" />
                            </button>
                            <button className="user-calendar-btn" onClick={() => navigate('/admin-management')}>
                                <img src={require('../media/admin_management_btn.png')} width={40} alt="Administradores" title="Mantenimiento Administradores" />
                            </button>
                            <button className="user-calendar-btn" onClick={() => navigate('/admin-working-hours')}>
                                <img src={require('../media/schedule_management_btn.png')} width={40} alt="Horarios" title="Horarios de Trabajo" />
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

                    {/* Botón de notificaciones */}
                    <button className="notification-icon" onClick={toggleNotificaciones} title="Notificaciones">
                        <img src={require('../media/notification_icon.png')} width={40} alt="Notificaciones" />
                        {notificacionesNoLeidas && <span className="notification-badge"></span>}
                    </button>
                </div>

                <div className={`navbar-profile ${isDropdownOpen ? 'active' : ''}`}>
                    <div className="profile-icon" title="Perfil" onClick={handleProfileClick}>
                        <img src={require(isAdmin ? '../media/corona.png' : '../media/hombre.png')} alt="Perfil" />
                    </div>

                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {isAdmin === false && (
                                <button onClick={() => navigate('/user-profile')}>Mi Perfil</button>
                            )}
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>

                {showConfirmation && (
                    <VentanaConfirm
                        onConfirm={confirmLogout}
                        onCancel={() => setShowConfirmation(false)}
                        action={'logout'}
                    />
                )}
            </div>

            {/* Pop-up de Notificaciones */}
            {showNotificaciones && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <Notificaciones />
                        <button className="close-button" onClick={toggleNotificaciones}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;
