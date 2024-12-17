import React, { useEffect, useState } from "react";

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar notificaciones desde el backend
    const loadNotificaciones = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:3000/notificaciones", {
                credentials: "include",
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
        try {
            const response = await fetch(`http://localhost:3000/notificaciones/${id}`, {
                method: "DELETE",
                credentials: "include",
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
        try {
            const response = await fetch("http://localhost:3000/notificaciones", {
                method: "DELETE",
                credentials: "include",
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
                                        {new Date(notificacion.fecha).toLocaleString()}
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
