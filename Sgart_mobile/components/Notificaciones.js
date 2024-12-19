import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config";

const NotificacionesComponent = ({ onUnreadStatusChange }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Obtener el ID del usuario desde el backend
    const getUserId = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${config.BACKEND_URL}/users/current/userId`, {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener el ID del usuario.");
            }

            const data = await response.json();
            console.log("ID de usuario obtenido:", data.userId);
            return data.userId;
        } catch (error) {
            console.error("Error al obtener el ID del usuario:", error);
            return null;
        }
    };

    // Cargar notificaciones desde el backend
    const loadNotificaciones = async () => {
        try {
            setIsLoading(true);

            const userId = await getUserId();
            if (!userId) {
                console.error("No se pudo obtener el ID del usuario.");
                return;
            }

            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${config.BACKEND_URL}/notificaciones?usuarioId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar las notificaciones.");
            }

            const data = await response.json();
            setNotificaciones(data);

            // Notificar al componente padre sobre el estado de notificaciones no leídas
            if (onUnreadStatusChange) {
                const hasUnread = data.some((notif) => !notif.leida);
                onUnreadStatusChange(hasUnread);
            }
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar una notificación individual
    const deleteNotificacion = async (id) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${config.BACKEND_URL}/notificaciones/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la notificación.");
            }

            setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
        } catch (error) {
            console.error(`Error al eliminar la notificación ${id}:`, error);
        }
    };

    // Eliminar todas las notificaciones
    const deleteAllNotificaciones = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                console.error("No se pudo obtener el ID del usuario.");
                return;
            }

            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${config.BACKEND_URL}/notificaciones?usuarioId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar todas las notificaciones.");
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
        <View style={styles.container}>
            <Text style={styles.header}>Notificaciones</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1e3a8a" />
            ) : notificaciones.length > 0 ? (
                <>
                    <TouchableOpacity 
                        style={styles.deleteAllButton} 
                        onPress={deleteAllNotificaciones}
                    >
                        <Text style={styles.deleteAllText}>Eliminar todas</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={notificaciones}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.notificacion,
                                    item.leida ? styles.leida : styles.noLeida,
                                ]}
                            >
                                <Text style={styles.title}>{item.titulo}</Text>
                                <Text>{item.mensaje}</Text>
                                <Text style={styles.fecha}>
                                    {new Date(item.fechaCreacion).toLocaleString()}
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => deleteNotificacion(item.id)}>
                                        <Text style={styles.deleteButton}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </>
            ) : (
                <Text style={styles.empty}>No tienes notificaciones pendientes.</Text>
            )}
        </View>
    );
};

export default NotificacionesComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#1e3a8a",
    },
    notificacion: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
    },
    noLeida: {
        borderLeftWidth: 4,
        borderLeftColor: "#ff0000",
    },
    leida: {
        borderLeftWidth: 4,
        borderLeftColor: "#28a745",
    },
    title: {
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    fecha: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    deleteButton: {
        color: "red",
        fontWeight: "bold",
    },
    deleteAllButton: {
        backgroundColor: "#ff0000",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    deleteAllText: {
        color: "#fff",
        fontWeight: "bold",
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#888",
    },
});
