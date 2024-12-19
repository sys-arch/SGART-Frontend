import PropTypes from 'prop-types';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VentanaConfirm = ({ onConfirm, onCancel, action }) => {
    const getTitle = () => {
        switch (action) {
            case 'save':
                return 'Confirmar Cambios';
            case 'edit':
                return 'Confirmar Cambios';
            case 'delete':
                return 'Confirmar Eliminación';
            case 'add':
                return 'Confirmar Ausencia';
            case 'logout':
                return 'Cerrar Sesión';
            case 'accept':
                return 'Confirmar Asistencia';
            case 'reject':
                return 'Rechazar Reunión';
            default:
                return '';
        }
    };

    const getMessage = () => {
        switch (action) {
            case 'save':
                return '¿Está seguro de que desea guardar los cambios?';
            case 'edit':
                return '¿Está seguro de que desea guardar los cambios?';
            case 'delete':
                return '¿Está seguro de que desea eliminar este usuario?';
            case 'add':
                return '¿Está seguro de que desea añadir esta ausencia?';
            case 'accept':
                return '¿Está seguro de que desea asistir?';
            case 'reject':
                return '¿Está seguro de que desea rechazar esta reunión?';
            case 'logout':
                return '¿Está seguro de que desea cerrar sesión?';
            default:
                return '';
        }
    };

    return (
        <Modal
            transparent={true}
            visible={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <Text style={styles.message}>{getMessage()}</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

VentanaConfirm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
};

export default VentanaConfirm;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});