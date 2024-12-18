import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Obtener usuarioId del token JWT
    const getUsuarioIdFromToken = () => {
        const token = sessionStorage.getItem("authToken");

        if (token) {
            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);
            return decodedToken.userId;
        }
        return null;
    };

    // Obtener el token del sessionStorage
    const getAuthToken = () => {
        return sessionStorage.getItem("authToken");
    };

    // Cargar notificaciones desde el backend
    const loadNotificaciones = async () => {
        const userId = getUsuarioIdFromToken();
        const token = getAuthToken();

        if (!userId || !token) {
            console.error("Token JWT o usuarioId no encontrado.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${CONFIG.BACKEND_URL}/notificaciones?usuarioId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar las notificaciones");
            }

            const data = await response.json();
            setNotificaciones(data);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar una notificación individual
    const deleteNotificacion = async (id) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${CONFIG.BACKEND_URL}/notificaciones/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la notificación");
            }

            setNotificaciones((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error(`Error al eliminar la notificación ${id}:`, error);
        }
    };

    // Eliminar todas las notificaciones
    const deleteAllNotificaciones = async () => {
        const userId = getUsuarioIdFromToken();
        const token = getAuthToken();

        if (!userId || !token) return;

        try {
            const response = await fetch(`${CONFIG.BACKEND_URL}/notificaciones?usuarioId=${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar todas las notificaciones");
            }

            setNotificaciones([]);
        } catch (error) {
            console.error("Error al eliminar todas las notificaciones:", error);
        }
    };

    // Cargar notificaciones al montar el componente
    useEffect(() => {
        loadNotificaciones();
    }, []);

    return (
        <div className="notificaciones-container">
            <h2>Notificaciones</h2>
            {isLoading ? (
                <p>Cargando notificaciones...</p>
            ) : notificaciones.length > 0 ? (
                <>
                    <div className="notificaciones-header">
                        <button className="btn delete-all" onClick={deleteAllNotificaciones}>
                            Eliminar todas
                        </button>
                    </div>
                    <ul className="notificaciones-lista">
                        {notificaciones.map((notificacion) => (
                            <li key={notificacion.id} className="notificacion-item">
                                <div className="notificacion-info">
                                    <h3>{notificacion.titulo}</h3>
                                    <p>{notificacion.mensaje}</p>
                                    <p className="notificacion-fecha">
                                        {new Date(notificacion.fechaCreacion).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    className="btn delete"
                                    onClick={() => deleteNotificacion(notificacion.id)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>No tienes notificaciones pendientes.</p>
            )}
        </div>
    );
};

export default Notificaciones;
