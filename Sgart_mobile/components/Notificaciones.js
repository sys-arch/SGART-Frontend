import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

const NotificacionesComponent = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar notificaciones desde el backend
    const loadNotificaciones = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/notificaciones?usuarioId=1"); // Ajusta usuarioId dinámico
            const data = await response.json();
            setNotificaciones(data);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar una notificación
    const deleteNotificacion = async (id) => {
        try {
            await fetch(`http://localhost:3000/notificaciones/${id}`, {
                method: "DELETE",
            });
            setNotificaciones((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
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
                <ActivityIndicator size="large" color="#0000ff" />
            ) : notificaciones.length > 0 ? (
                <FlatList
                    data={notificaciones}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.notificacion}>
                            <Text style={styles.title}>{item.titulo}</Text>
                            <Text>{item.mensaje}</Text>
                            <TouchableOpacity onPress={() => deleteNotificacion(item.id)}>
                                <Text style={styles.deleteButton}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.empty}>No tienes notificaciones.</Text>
            )}
        </View>
    );
};

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
    },
    notificacion: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    deleteButton: {
        color: "red",
        marginTop: 5,
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#888",
    },
});

export default NotificacionesComponent;
