import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MeetingCreator = ({ navigation }) => {
    const [eventName, setEventName] = useState('');
    const [popupSelectedDate, setPopupSelectedDate] = useState('');
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupEndingHour, setPopupEndingHour] = useState('');
    const [popupDescription, setPopupDescription] = useState('');
    const [errorEvent, setErrorEvent] = useState('');

    // Cargar usuarios disponibles desde el backend
    const loadUsers = async () => {
        try {
        const response = await fetch('http://localhost:3000/api/meetings/available-users');
        if (!response.ok) throw new Error('Error al cargar los usuarios disponibles');
        const users = await response.json();
        setAvailableUsers(users);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSaveMeeting = async () => {
        if (!eventName || !popupSelectedDate || !popupStartingHour || !popupEndingHour) {
            setErrorEvent('Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        const newEvent = {
            meetingTitle: eventName,
            meetingDate: popupSelectedDate,
            meetingStartTime: `${popupStartingHour}:00`,
            meetingEndTime: `${popupEndingHour}:00`,
            meetingObservations: popupDescription,
        };
        
        try {
            // Crear la reunión en el backend
            const response = await fetch('http://localhost:3000/api/meetings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newEvent),
            });
        
            if (!response.ok) throw new Error('Error al guardar el evento');
        
            const meetingData = await response.json();
            const meetingId = meetingData.meetingId;
        
            // Enviar invitaciones a los usuarios seleccionados
            const userIds = selectedUsers.map(user => user.id);
            const inviteResponse = await fetch(`http://localhost:3000/invitations/${meetingId}/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userIds),
            });
        
            if (!inviteResponse.ok) throw new Error('Error al enviar las invitaciones');
        
            Alert.alert('Éxito', 'Se ha creado el evento y enviado las invitaciones.');
            navigation.goBack(); // Regresar al calendario
            } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al crear la reunión.');
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Crear Nueva Reunión</Text>
        {errorEvent ? <Text style={styles.errorText}>{errorEvent}</Text> : null}

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la Reunión*</Text>
            <TextInput
            style={styles.input}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Escribe un nombre"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha*</Text>
            <TextInput
            style={styles.input}
            value={popupSelectedDate}
            onChangeText={setPopupSelectedDate}
            placeholder="YYYY-MM-DD"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Hora de Inicio*</Text>
            <TextInput
            style={styles.input}
            value={popupStartingHour}
            onChangeText={setPopupStartingHour}
            placeholder="HH:MM"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Hora de Fin*</Text>
            <TextInput
            style={styles.input}
            value={popupEndingHour}
            onChangeText={setPopupEndingHour}
            placeholder="HH:MM"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            value={popupDescription}
            onChangeText={setPopupDescription}
            placeholder="Descripción opcional"
            multiline
            />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeeting}>
            <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#ff0000',
        marginBottom: 10,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default MeetingCreator;

