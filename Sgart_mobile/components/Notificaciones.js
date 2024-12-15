import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import io from 'socket.io-client';

const Notificaciones = ({ isVisible, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    // Configurar WebSocket y obtener notificaciones iniciales
    useEffect(() => {
        const socketInstance = io('http://localhost:3000'); // Dirección del servidor WebSocket
        setSocket(socketInstance);

        // Escuchar notificaciones en tiempo real
        socketInstance.on('new-notification', (newNotification) => {
            console.log('Notificación recibida:', newNotification);
            setNotifications((prev) => [newNotification, ...prev]); // Añadir la nueva notificación al inicio
        });

        // Cargar notificaciones iniciales desde el servidor
        const loadInitialNotifications = async () => {
            try {
                const response = await fetch('http://localhost:3000/notifications');
                if (!response.ok) throw new Error('Error al cargar las notificaciones iniciales');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error al cargar notificaciones:', error);
            }
        };

        loadInitialNotifications();

        // Limpiar WebSocket al desmontar
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Notificaciones</Text>

                    {notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.notificationItem}>
                                    <Text style={styles.notificationText}>{item.message}</Text>
                                </View>
                            )}
                        />
                    ) : (
                        <Text style={styles.noNotifications}>No tienes notificaciones</Text>
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default Notificaciones;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    noNotifications: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
