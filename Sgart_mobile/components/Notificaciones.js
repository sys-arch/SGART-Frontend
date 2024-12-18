import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import config from "../config";

const NotificacionesComponent = ({ onUnreadStatusChange }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar notificaciones desde el backend
    const loadNotificaciones = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${config.BACKEND_URL}/notificaciones`, {
                headers: {
                    "Authorization": `Bearer ${await AsyncStorage.getItem("authToken")}`
                },
            });
            if (!response.ok) {
                throw new Error("Error al cargar las notificaciones");
            }
            const data = await response.json();

            // Actualizar notificaciones y verificar si hay no leídas
            setNotificaciones(data);
            const hasUnread = data.some((notificacion) => !notificacion.leida);
            onUnreadStatusChange(hasUnread);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Marcar una notificación como leída
    const markAsRead = async (id) => {
        try {
            await fetch(`${config.BACKEND_URL}/notificaciones/${id}/marcarLeida`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await AsyncStorage.getItem("authToken")}`
                },
            });

            // Actualizar localmente la notificación
            setNotificaciones((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
            );

            // Verificar si todavía hay no leídas
            const hasUnread = notificaciones.some((n) => n.id !== id && !n.leida);
            onUnreadStatusChange(hasUnread);
        } catch (error) {
            console.error("Error al marcar la notificación como leída:", error);
        }
    };

    // Eliminar una notificación
    const deleteNotificacion = async (id) => {
        try {
            await fetch(`${config.BACKEND_URL}/notificaciones/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${await AsyncStorage.getItem("authToken")}`
                },
            });
            setNotificaciones((prev) => prev.filter((n) => n.id !== id));

            // Verificar si todavía hay no leídas
            const hasUnread = notificaciones.some((n) => n.id !== id && !n.leida);
            onUnreadStatusChange(hasUnread);
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
        }
    };

    useEffect(() => {
        loadNotificaciones();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notificaciones</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#1e3a8a" />
            ) : notificaciones.length > 0 ? (
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

                            <View style={styles.buttonContainer}>
                                {!item.leida && (
                                    <TouchableOpacity
                                        onPress={() => markAsRead(item.id)}
                                    >
                                        <Text style={styles.markAsRead}>
                                            Marcar como leída
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => deleteNotificacion(item.id)}
                                >
                                    <Text style={styles.deleteButton}>
                                        Eliminar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.empty}>No tienes notificaciones.</Text>
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    markAsRead: {
        color: "#007bff",
        fontWeight: "bold",
    },
    deleteButton: {
        color: "red",
        fontWeight: "bold",
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#888",
    },
});