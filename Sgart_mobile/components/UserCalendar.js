import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Modal, TextInput } from 'react-native';

const UserCalendar =  ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [regularEvents, setRegularEvents] = useState([]);
  const [pendingMeetingsEvents, setPendingMeetingsEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [eventName, setEventName] = useState('');
  const [popupDescription, setPopupDescription] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [popupStartingHour, setPopupStartingHour] = useState('');
  const [popupEndingHour, setPopupEndingHour] = useState('');

  // Fetch functions
  const loadMeetings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/administrador/calendarios/loadMeetings');
      if (!response.ok) throw new Error('Error al cargar reuniones');
      const backendMeetings = await response.json();

      // Transform meetings
      const acceptedMeetings = backendMeetings.filter((meeting) => meeting.status === 'Aceptada');
      const pendingMeetings = backendMeetings.filter((meeting) => meeting.status === 'Pendiente');
      const organized = backendMeetings.filter((meeting) => meeting.isOrganizer);

      setRegularEvents(acceptedMeetings);
      setPendingMeetingsEvents(pendingMeetings);
      setOrganizedEvents(organized);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLocations = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/meetings/locations');
      if (!response.ok) throw new Error('Error al cargar ubicaciones');
      const backendLocations = await response.json();
      setLocations(backendLocations);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    loadMeetings();
    loadLocations();
  }, [loadMeetings, loadLocations]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>

        {/* Botones Crear reunión y Mi perfil */}
      <View style={styles.buttonsContainer}>
          <TouchableOpacity
              style={styles.createButton}
              //onPress={() => Alert.alert('Crear reunión', 'Funcionalidad aún no implementada')}
            >
            <Text style={styles.buttonCrearReunion}>Crear reunión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            //onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonVisitarPerfil}>Mi perfil</Text>
          </TouchableOpacity>
        </View>

          <Calendar
            markedDates={{
              ...regularEvents.reduce((acc, event) => {
                acc[event.date] = { marked: true, dotColor: 'green' };
                return acc;
              }, {}),
              [selectedDate]: { selected: true, selectedColor: '#00adf5' },
            }}
            onDayPress={handleDayPress}
          />

          <ScrollView style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>Reuniones Aceptadas</Text>
            {regularEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventSelect(event)}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text>{event.date}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Reuniones Pendientes</Text>
            {pendingMeetingsEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, styles.pendingEvent]}
                onPress={() => handleEventSelect(event)}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text>{event.date}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Reuniones Organizadas</Text>
            {organizedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, styles.organizedEvent]}
                onPress={() => handleEventSelect(event)}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text>{event.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Modal visible={isPopupOpen} animationType="slide">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles de la Reunión</Text>
              <Text>Título: {selectedEvent?.title}</Text>
              <Text>Fecha: {selectedEvent?.date}</Text>
              <Text>Ubicación: {selectedEvent?.locationName}</Text>
              <Text>Descripción: {selectedEvent?.description}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsPopupOpen(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  eventsContainer: {
    marginTop: 16,
  },
  eventCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  pendingEvent: {
    backgroundColor: '#ffc107',
  },
  organizedEvent: {
    backgroundColor: '#d1c4e9',
  },
  modalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonCrearReunion: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonVisitarPerfil: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserCalendar;
