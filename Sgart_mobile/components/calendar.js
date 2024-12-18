import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, Switch, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarComponent = () => {
    // Estados esenciales para reuniones
    const [isLoading, setIsLoading] = useState(false);
    const [regularEvents, setRegularEvents] = useState([]);
    const [pendingMeetingsEvents, setPendingMeetingsEvents] = useState([]);
    const [reunionesPendientes, setReunionesPendientes] = useState([]);
    const [reunionesAceptadas, setReunionesAceptadas] = useState([]);

    // Estados para pop-ups y eventos seleccionados
    const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState('');
    const [invitees, setInvitees] = useState([]);

    // Añadir estos estados adicionales cerca de los otros estados
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [eventName, setEventName] = useState('');
    const [popupSelectedDate, setPopupSelectedDate] = useState('');
    const [eventFrequency, setEventFrequency] = useState('Una vez');
    const [isAllDay, setIsAllDay] = useState(false);
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupStartingMinutes, setPopupStartingMinutes] = useState('');
    const [popupEndingHour, setPopupEndingHour] = useState('');
    const [popupEndingMinutes, setPopupEndingMinutes] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [popupDescription, setPopupDescription] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [errorEvent, setErrorEvent] = useState('');


    // Añadir nuevo estado para reuniones organizadas
    const [organizedEvents, setOrganizedEvents] = useState([]);
    const [reunionesOrganizadas, setReunionesOrganizadas] = useState([]);

    // Ausencias de los usuarios
    const [ausencias, setAusencias] = useState([]);

    // Localizaciones
    const [locations, setLocations] = useState([]);

    // Estados desplegable reuniones 
    const [isPendingOpen, setIsPendingOpen] = useState(false);
    const [isAcceptedOpen, setIsAcceptedOpen] = useState(false);
    const [isOrganizedOpen, setIsOrganizedOpen] = useState(false);

    const [activeContent, setActiveContent] = useState('calendar');

    const navigation = useNavigation();

    const [selectedEvents, setSelectedEvents] = useState([]); // Estado para almacenar eventos del día
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const [selectedDay, setSelectedDay] = useState('');


    // ! CARGAR INVITADOS	
    const loadInvitees = useCallback(async (meetingId) => {
        try {
            console.log(`Cargando invitados para la reunión ID: ${meetingId}`);
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/administrador/calendarios/invitados`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ meetingId }),
            });

            if (!response.ok) {
                throw new Error(`Error al cargar los invitados: ${response.statusText}`);
            }

            const backendInvitees = await response.json();
            console.log("Lista de invitados cargada:", backendInvitees);
            return backendInvitees;

        } catch (error) {
            console.error("Error al cargar los invitados:", error);
            return [];
        }
    }, []);

    // ! OBTENER USER ID ACTUAL	
    const getUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/users/current/userId`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('No se pudo obtener el ID del usuario');
            }
            const data = await response.json();
            console.log("ID de usuario obtenido:", data.userId);
            return data.userId;
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            return null;
        }
    };

    // ! CARGAR REUNIONES
    const loadMeetings = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log("Iniciando carga de meetings...");

            // Obtener el userId del backend
            const currentUserId = await getUserId();
            console.log("ID del usuario actual:", currentUserId, "Tipo:", typeof currentUserId);

            if (!currentUserId) {
                throw new Error('No se pudo obtener el ID del usuario');
            }

            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/administrador/calendarios/loadMeetings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const backendMeetings = await response.json();
            console.log("Total de reuniones recibidas:", backendMeetings.length);

            const acceptedMeetings = [];
            const pendingMeetings = [];

            // Procesar cada reunión y sus invitados
            for (const meeting of backendMeetings) {
                console.log(`\n--- Procesando reunión ID: ${meeting.meetingId} ---`);

                // Cargar invitados para esta reunión
                const invitados = await loadInvitees(meeting.meetingId);
                console.log(`Invitados recibidos para reunión ${meeting.meetingId}:`, invitados);

                // Imprimir cada invitado y su estado
                invitados.forEach(invitee => {
                    console.log(`Invitado ID: ${invitee.userId} (${typeof invitee.userId}), Estado: "${invitee.status}"`);
                });

                const transformedMeeting = {
                    id: meeting.meetingId,
                    title: meeting.title || "Título no especificado",
                    start: `${meeting.meetingDate}T${meeting.startTime}`,
                    end: `${meeting.meetingDate}T${meeting.endTime}`,
                    allDay: meeting.allDay,
                    extendedProps: {
                        locationName: meeting.locationName,
                        observations: meeting.observations,
                        organizerName: meeting.organizerName,
                        invitees: invitados
                    }
                };

                // Buscar la invitación del usuario actual por userId
                const currentUserInvitation = invitados.find(invitee => {
                    console.log(`Comparando: invitado.userId=${invitee.userId} con currentUserId=${currentUserId}`);
                    return invitee.userId.toString() === currentUserId.toString(); // Convertir ambos a string para comparar
                });

                if (currentUserInvitation) {
                    console.log(`Estado de invitación encontrado: "${currentUserInvitation.status}"`);
                    if (currentUserInvitation.status.trim() === 'Aceptada') {
                        console.log(`Reunión ${meeting.meetingId} clasificada como ACEPTADA`);
                        acceptedMeetings.push(transformedMeeting);
                    } else if (currentUserInvitation.status.trim() === 'Pendiente') {
                        console.log(`Reunión ${meeting.meetingId} clasificada como PENDIENTE`);
                        pendingMeetings.push(transformedMeeting);
                    }
                } else {
                    console.log(`No se encontró invitación para el usuario actual (${currentUserId}) en la reunión ${meeting.meetingId}`);
                }
            }

            console.log("\n=== RESUMEN FINAL ===");
            console.log("Total reuniones aceptadas:", acceptedMeetings.length);
            console.log("Total reuniones pendientes:", pendingMeetings.length);

            // Actualizar estados
            setRegularEvents(acceptedMeetings);
            setPendingMeetingsEvents(pendingMeetings);
            setReunionesAceptadas(acceptedMeetings);
            setReunionesPendientes(pendingMeetings);

        } catch (error) {
            console.error("Error al cargar los meetings: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [loadInvitees]);

    // Añadir esta función auxiliar cerca de otras funciones auxiliares
    const areAllInvitationsRejected = (invitees) => {
        if (!invitees || invitees.length === 0) return false;
        return invitees.every(invitee => invitee.status.trim() === 'Rechazada');
    };

    // ! CARGAR REUNIONES ORGANIZADAS POR EL USUARIO
    const loadOrganizedMeetings = useCallback(async () => {
        try {
            console.log("Iniciando carga de reuniones organizadas...");
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/usuarios/calendarios/organized-meetings`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, response.statusText);
                throw new Error('Error al cargar reuniones organizadas');
            }

            const backendMeetings = await response.json();
            console.log("Reuniones organizadas recibidas del backend:", backendMeetings);

            const transformedMeetings = await Promise.all(backendMeetings.map(async (meeting, index) => {
                console.log(`Procesando reunión organizada ${index + 1}:`, meeting);

                const invitados = await loadInvitees(meeting.meetingId);
                console.log(`Invitados cargados para reunión ${meeting.meetingId}:`, invitados);

                const allRejected = areAllInvitationsRejected(invitados);

                const transformedMeeting = {
                    id: meeting.meetingId,
                    title: meeting.title || "Título no especificado",
                    start: `${meeting.meetingDate}T${meeting.startTime}`,
                    end: `${meeting.meetingDate}T${meeting.endTime}`,
                    allDay: meeting.allDay,
                    backgroundColor: allRejected ? '#ffcccc' : '#ce93d8',
                    allRejected: allRejected,
                    className: allRejected ? 'rejected-meeting' : 'normal-meeting',
                    extendedProps: {
                        locationName: meeting.locationName,
                        observations: meeting.observations,
                        organizerName: meeting.organizerName,
                        invitees: invitados
                    }
                };

                console.log(`Reunión ${index + 1} transformada:`, transformedMeeting);
                return transformedMeeting;
            }));

            console.log("Total de reuniones organizadas transformadas:", transformedMeetings.length);
            console.log("Reuniones organizadas transformadas:", transformedMeetings);

            setOrganizedEvents(transformedMeetings);
            setReunionesOrganizadas(transformedMeetings);

        } catch (error) {
            console.error("Error detallado al cargar reuniones organizadas:", error);
        }
    }, [loadInvitees]);

    // ! OBTENER ASISTENCIAS
    const checkAttendanceStatus = async (meetingId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/invitations/${meetingId}/attendance`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get attendance status');
            }

            const attendance = await response.json();
            return attendance === 1;
        } catch (error) {
            console.error('Error checking attendance status:', error);
            return false;
        }
    };

    // Modify the handleEventClick function
    const handleEventClick = async (clickInfo) => {
        const transformedEvent = {
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr,
            allDay: clickInfo.event.allDay,
            extendedProps: {
                locationName: clickInfo.event.extendedProps.locationName,
                observations: clickInfo.event.extendedProps.observations,
                organizerName: clickInfo.event.extendedProps.organizerName,
            }
        };

        // Cargar invitados al hacer click
        const invitados = await loadInvitees(clickInfo.event.id);

        // Check attendance status if it's an accepted meeting
        if (regularEvents.find(event => event.id === clickInfo.event.id)) {
            const hasConfirmedAttendance = await checkAttendanceStatus(clickInfo.event.id);
            transformedEvent.extendedProps.hasConfirmedAttendance = hasConfirmedAttendance;
        }

        setInvitees(invitados);
        setSelectedEvent(transformedEvent);
        setIsEventDetailPopupOpen(true);
    };

    const handleConfirmAction = async () => {
        try {
            console.log('Iniciando actualización de estado para evento:', selectedEvent);
            console.log('Acción seleccionada:', confirmationAction);

            const token = await AsyncStorage.getItem('authToken');
            const url = `${config.BACKEND_URL}/invitations/${selectedEvent.id}/status`;
            console.log('URL de la petición:', url);

            const requestBody = {
                newStatus: confirmationAction === 'accept' ? 'Aceptada' : 'Rechazada',
                comment: ''
            };
            console.log('Cuerpo de la petición:', requestBody);

            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            console.log('Respuesta del servidor:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error al actualizar el estado de la invitación: ${errorText}`);
            }

            await loadMeetings(); // Recargar reuniones después de la actualización
            console.log('Actualización completada con éxito');
        } catch (error) {
            console.error('Error detallado:', error);
        } finally {
            setShowConfirmation(false);
        }
    };

    // ! FUNCIONES PARA CREAR REUNIONES
    const handleAddTimeClick = () => {
        setEventLocation("");
        setIsEditing(false);
        loadLocations();
        setPopupStartingHour('');
        setPopupStartingMinutes('');
        setPopupEndingHour('');
        setPopupEndingMinutes('');
        setEventName('');
        setPopupSelectedDate('');
        setEventFrequency('Una vez');
        setIsAllDay(false);
        setIsPopupOpen(true);
    };

	// ! VALIDACIONES Y COMPROBACION TRAMO LABORAL
    const handleNextStep = () => {
        if (!eventName || !popupSelectedDate || !eventLocation.length) {
            alert("Por favor, completa todos los campos obligatorios antes de continuar.");
            return;
        }
        if(!isAllDay){
            if(parseInt(popupStartingMinutes)+parseInt(popupStartingHour)*60>parseInt(popupEndingHour)*60+parseInt(popupEndingMinutes)){
                alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
                return;
            }
            if(parseInt(popupStartingMinutes)>59||parseInt(popupStartingHour)>23||parseInt(popupEndingHour)>23||parseInt(popupEndingMinutes)>59){
                alert("El formato de horas que se ha establecido es incorrecto. Revíselo por favor.");
                return;
            }
            if (!popupEndingHour || !popupEndingMinutes || !popupStartingHour || !popupStartingMinutes) {
                alert("Por favor, completa todos los campos antes de continuar.");
                return;
            }

            // Añadir validación de horario laboral
            const startTimeValid = isTimeWithinWorkSchedule(parseInt(popupStartingHour), parseInt(popupStartingMinutes));
            const endTimeValid = isTimeWithinWorkSchedule(parseInt(popupEndingHour), parseInt(popupEndingMinutes));
            
            if (!startTimeValid || !endTimeValid) {
                const errorMsg = 'Las horas seleccionadas deben estar dentro del horario laboral establecido:' +
                    workSchedules.map(schedule => 
                        `\n${schedule.startingTime.slice(0, -3)} - ${schedule.endingTime.slice(0, -3)}`
                    ).join('');
                alert(errorMsg);
                return;
            }
        }

        setErrorEvent('');
        setSelectedUsers([]);
        loadUsers();
        loadAbsences();
        setCurrentStep(2);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setCurrentStep(1);
        setIsEditingEvent(false);
    };

    const [workSchedules, setWorkSchedules] = useState([]);

	// * NO SE ESTÁ USANDO
    const loadWorkSchedules = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/administrador/horarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar los horarios laborales');
            }
            const schedules = await response.json();
            console.log('Horarios laborales cargados:', schedules);
            setWorkSchedules(schedules);
        } catch (error) {
            console.error('Error cargando horarios:', error);
        }
    };

	// ! COMPRUEBA SI LAS REUNIONES ESTÁN DENTRO DE LOS HORARIOS LABORALES
	const isTimeWithinWorkSchedule = (hour, minute) => {
        if (!workSchedules.length) {
            console.log('No hay horarios laborales definidos, permitiendo cualquier hora');
            return true;
        }

        const timeInMinutes = hour * 60 + parseInt(minute);
        console.log(`\nValidando tiempo: ${hour}:${minute} (${timeInMinutes} minutos)`);
        
        for (const schedule of workSchedules) {
            console.log(`\nComprobando bloque horario: ${schedule.startingTime} - ${schedule.endingTime}`);
            
            const startTime = schedule.startingTime.split(':').slice(0, 2).join(':');
            const endTime = schedule.endingTime.split(':').slice(0, 2).join(':');
            
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            const scheduleStartMinutes = startHour * 60 + startMinute;
            const scheduleEndMinutes = endHour * 60 + endMinute;
            
            console.log(`Bloque en minutos: ${scheduleStartMinutes} - ${scheduleEndMinutes}`);
            console.log(`Tiempo a validar en minutos: ${timeInMinutes}`);
            
            if (timeInMinutes >= scheduleStartMinutes && timeInMinutes <= scheduleEndMinutes) {
                console.log('¡Tiempo válido! Está dentro de este bloque horario');
                return true;
            }
        }

        console.log('Tiempo no válido: No está dentro de ningún bloque horario');
        return false;
    };

    

    // ! COMPRUEBA SI HAY ASISTENTES AL CREAR LA REUNIÓN
    const handleSaveEvent = async () => {
        setErrorEvent('');

        // Validación de usuarios ausentes solo si hay usuarios seleccionados
        if (selectedUsers?.length > 0) {
            const ausentes = selectedUsers.filter((user) => user.enAusencia === true);
            if (ausentes.length > 0) {
                setErrorEvent("Error al crear la reunión. Se está intentando crear una reunión con participantes ausentes.");
                return;
            }
        }

        
        if (selectedUsers.length === 0) {
            setErrorEvent('Debes invitar al menos a un participante');
            return;
        }

        const startingTime = `${popupStartingHour.padStart(2, '0')}:${popupStartingMinutes.padStart(2, '0')}:00`;
        const endingTime = `${popupEndingHour.padStart(2, '0')}:${popupEndingMinutes.padStart(2, '0')}:00`;

        try {
            setIsLoading(true);
            const currentUserId = await getUserId();
            const newEvent = {
                organizerId: currentUserId,
                meetingTitle: eventName,
                meetingDate: popupSelectedDate,
                meetingAllDay: isAllDay ? 1 : 0,
                meetingStartTime: isAllDay ? '00:00:00' : startingTime,
                meetingEndTime: isAllDay ? '23:59:59' : endingTime,
                locationId: eventLocation,
                meetingObservations: popupDescription,
            };

            let response;
            let meetingId;

			// ! AQUI SE MODIFICA LA REUNIÓN
            if (isEditing) {
                 // Validación inicial de campos obligatorios para todos los casos
                if (!eventName || !popupSelectedDate || !eventLocation.length) {
                    alert("Por favor, completa todos los campos obligatorios antes de continuar.");
                    return;
                }

                if (!isAllDay) {
                    // Validación de formato de hora existente
                    if (!validateTimeInput(popupStartingHour, popupStartingMinutes, setPopupHourError, setPopupMinuteError) ||
                        !validateTimeInput(popupEndingHour, popupEndingMinutes, setPopupHourError, setPopupMinuteError)) {
                        alert("Por favor, corrige los campos de hora antes de guardar el evento.");
                        return;
                    }

                    // Validación de campos de hora vacíos
                    if (!popupEndingHour || !popupEndingMinutes || !popupStartingHour || !popupStartingMinutes) {
                        alert("Por favor, completa todos los campos antes de continuar.");
                        return;
                    }

                    // Validación de hora inicio > fin
                    if(parseInt(popupStartingMinutes)+parseInt(popupStartingHour)*60 > parseInt(popupEndingHour)*60+parseInt(popupEndingMinutes)){
                        alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
                        return;
                    }

                    // Validación de formato de horas
                    if(parseInt(popupStartingMinutes)>59 || parseInt(popupStartingHour)>23 || 
                    parseInt(popupEndingHour)>23 || parseInt(popupEndingMinutes)>59){
                        alert("El formato de horas que se ha establecido es incorrecto. Revíselo por favor.");
                        return;
                    }

                    // Añadir validación de horario laboral
                    const startTimeValid = isTimeWithinWorkSchedule(parseInt(popupStartingHour), parseInt(popupStartingMinutes));
                    const endTimeValid = isTimeWithinWorkSchedule(parseInt(popupEndingHour), parseInt(popupEndingMinutes));
                    
                    if (!startTimeValid || !endTimeValid) {
                        const errorMsg = 'Las horas seleccionadas deben estar dentro del horario laboral establecido:' +
                            workSchedules.map(schedule => 
                                `\n${schedule.startingTime.slice(0, -3)} - ${schedule.endingTime.slice(0, -3)}`
                            ).join('');
                        alert(errorMsg);
                        return;
                    }
                }
                const token = await AsyncStorage.getItem('authToken');
                response = await fetch(`${config.BACKEND_URL}/api/meetings/${eventIdToEdit}/modify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newEvent),
                });
                meetingId = eventIdToEdit;

                if (!response.ok){
                    alert('Error al guardar el evento');
                    return;
                }

                alert("Se ha modificado el evento de manera exitosa.");
            } else { // ! AQUI SE CREA LA REUNIÓN
                const token = await AsyncStorage.getItem('authToken');
                response = await fetch(`${config.BACKEND_URL}/api/meetings/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newEvent),
                    
                });
                const meetingData = await response.json();
                meetingId = meetingData.meetingId; // Assuming your backend returns the created meeting ID

                if (!response.ok) throw new Error('Error al guardar el evento');

                // ! ENVIAR INVITACIONES
                const userIds = selectedUsers.map(user => user.id);
                const inviteResponse = await fetch(`${config.BACKEND_URL}/invitations/${meetingId}/invite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userIds),
                });

                if (!inviteResponse.ok) {
                    alert('Error al enviar las invitaciones');
                    return;
                }
                alert("Se ha creado el evento de manera exitosa.");

            }
            await loadMeetings();
            await loadOrganizedMeetings();
            setIsPopupOpen(false);
            setCurrentStep(1);
            setIsEditing(false);
            setEventIdToEdit(null);
        } catch (error) {
            console.error('Error:', error);
            setErrorEvent('Error al crear la reunión o enviar las invitaciones. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // Función para validar el formato de tiempo
    const validateTimeInput = (hour, minute, setHourError, setMinuteError) => {
        const hourValid = hour >= 0 && hour <= 23;
        const minuteValid = minute >= 0 && minute <= 59;
        setHourError(!hourValid);
        setMinuteError(!minuteValid);
        return hourValid && minuteValid;
    };

    // Función para manejar cambios en los campos de tiempo
    const handlePopupTimeChange = (e, type) => {
        const value = e.target.value;
        if (type === 'popupStartingHour') {
            setPopupStartingHour(value);
            validateTimeInput(value, popupStartingMinutes, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupStartingMinutes') {
            setPopupStartingMinutes(value);
            validateTimeInput(popupStartingHour, value, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupEndingHour') {
            setPopupEndingHour(value);
            validateTimeInput(value, popupEndingMinutes, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupEndingMinutes') {
            setPopupEndingMinutes(value);
            validateTimeInput(popupEndingHour, value, setPopupHourError, setPopupMinuteError);
        }
    };

    // Función para cargar usuarios disponibles
    const loadUsers = async () => {
        try {
            // Obtener el ID del usuario actual
            const currentUserId = await getUserId();
            console.log('ID del usuario actual:', currentUserId);
            
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/api/meetings/available-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            
            const backendUsers = await response.json();
            console.log('Usuarios recibidos del backend:', backendUsers);
            const userId=await getUserId();

            // Filtrar excluyendo al usuario actual
            const transformedUsers = backendUsers
                .filter(user => {
                    const isCurrentUser = user.id === currentUserId;
                    console.log(`Comparando usuario ${user.name} (${user.id}) con usuario actual (${currentUserId}): ${isCurrentUser ? 'Es el mismo' : 'Es diferente'}`);
                    return user.id !== userId;
                })
                .map(user => ({
                    id: user.id,
                    nombre: `${user.name} ${user.lastName}`
                }));
                
            console.log('Usuarios transformados (sin usuario actual):', transformedUsers);
            
            // Actualizar estados
            setAvailableUsers(transformedUsers);
            setFilteredParticipants(transformedUsers);
            
        } catch (error) {
            console.error('Error en loadUsers:', error);
        }
    };

	// Función para cargar localizaciones
	// ? VAYA MIERDA DE MÉTODO
    const loadLocations = (async() => {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${config.BACKEND_URL}/api/meetings/locations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            console.log('Error al cargar las localizaciones');
            return;
        }
        const backendLocations = await response.json();
        const transformedLocations= backendLocations.map(location => ({
            locationId: location.locationId,
            locationName: location.locationName
        }));
        setLocations(transformedLocations);
    })

	// ! CARGAR AUSENCIAS
    const loadAbsences = (async () => {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${config.BACKEND_URL}/administrador/ausencias/loadAbsences`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            console.log('Error al cargar las ausencias');
            return;
        }

        const backendAbsences = await response.json();
        const transformedAbsences = backendAbsences.map(ausencia => ({
            absenceId: ausencia.absenceId,
            userId: ausencia.userId,
            absenceStartDate: ausencia.absenceStartDate,
            absenceEndDate: ausencia.absenceEndDate,
            absenceAllDay: ausencia.absenceAllDay,
            absenceStartTime: ausencia.absenceStartTime,
            absenceEndTime: ausencia.absenceEndTime,
            absenceReason: ausencia.absenceReason
        }));
        setAusencias(transformedAbsences);
        console.log(transformedAbsences);
    })

	// ! COMPROBAR AUSENCIAS
    const checkUserAbsence = (participant) => {
        return ausencias.some((ausencia) => {
            // Para la ausencia
            const startTime = ausencia.absenceAllDay === true ? '00:00:00' : ausencia.absenceStartTime;
            const endTime = ausencia.absenceAllDay === true ? '23:59:00' : ausencia.absenceEndTime;

            const ausenciaFechaInicio = createDateWithDayAndTime(ausencia.absenceStartDate, startTime);
            const ausenciaFechaFin = createDateWithDayAndTime(ausencia.absenceEndDate, endTime);

            // Para la fecha seleccionada
            const selectedStartTime = isAllDay === true ? '00:00:00' : (popupStartingHour + ":" + popupStartingMinutes + ":00");
            const selectedEndTime = isAllDay === true ? '23:59:00' : (popupEndingHour + ":" + popupEndingMinutes + ":00");

            const selectedFechaInicio = createDateWithDayAndTime(popupSelectedDate, selectedStartTime);
            const selectedFechaFin = createDateWithDayAndTime(popupSelectedDate, selectedEndTime);
            return (
                ausencia.userId === participant.id &&
                ((ausenciaFechaInicio > selectedFechaInicio && ausenciaFechaInicio < selectedFechaFin) ||
                    (ausenciaFechaFin > selectedFechaInicio && ausenciaFechaFin < selectedFechaFin) ||
                    (ausenciaFechaFin > selectedFechaFin && ausenciaFechaInicio < selectedFechaInicio))
            );
        });
    };

    const createDateWithDayAndTime = (fecha, horaMinuto) => {
        // Dividimos la fecha en partes (año, mes, día)
        const [year, month, day] = fecha.split('-').map(Number);

        // Dividimos el tiempo en partes
        const [hour, minute, second] = horaMinuto.split(':').map(Number);

        // Crear el objeto Date
        const date = new Date(year, month - 1, day, hour, minute, second);

        return date;
    };

	// * NO SE ESTÁ USANDO
    const createDateWithDayHourAndMinutes = (fecha, hora, minuto) => {
        // Dividimos la fecha en partes (año, mes, día)
        const [year, month, day] = fecha.split('-').map(Number);
        const hour = parseInt(hora, 10);  // Convertir hora a entero
        const minute = parseInt(minuto, 10);  // Convertir minuto a entero

        // Crear el objeto Date (el mes es 0-indexado)
        const date = new Date(year, month - 1, day, hour, minute);

        return date;
    };


    // Función para seleccionar participantes
    const handleSelectParticipant = (participant) => {
        if (!selectedUsers.some(user => user.id === participant.id)) {
            const enAusencia = checkUserAbsence(participant);
            setSelectedUsers(prev => [...prev, { ...participant, enAusencia }]);
            setAvailableUsers(prev => prev.filter(user => user.id !== participant.id));
            setFilteredParticipants(prev => prev.filter(user => user.id !== participant.id));
        }
    };

    // Función para remover participantes
    const handleRemoveUser = (user) => {
        setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.id !== user.id));
        setAvailableUsers(prev => {
            if (!prev.some(u => u.id === user.id)) {
                return [...prev, user];
            }
            return prev;
        });
        setFilteredParticipants(prev => {
            if (!prev.some(u => u.id === user.id)) {
                return [...prev, user];
            }
            return prev;
        });
    };

    // Add this new function near other handler functions
    const handleAttendanceUpdate = async (meetingId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/invitations/${meetingId}/attendance`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update attendance');
            }

            // Update both regularEvents and reunionesAceptadas
            const updateEvents = (events) =>
                events.map(event =>
                    event.id === meetingId
                        ? { ...event, extendedProps: { ...event.extendedProps, hasConfirmedAttendance: true } }
                        : event
                );

            setRegularEvents(prevEvents => updateEvents(prevEvents));
            setReunionesAceptadas(prevEvents => updateEvents(prevEvents));

            // Force re-render by updating the selectedEvent
            setSelectedEvent(prev => ({
                ...prev,
                extendedProps: { ...prev.extendedProps, hasConfirmedAttendance: true }
            }));

        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [eventIdToEdit, setEventIdToEdit] = useState(null);
    const [isEditingEvent, setIsEditingEvent] = useState(false);


    const handleModifyEvent = (event) => {
        loadLocations();
        setIsEditing(true);  // Indicamos que estamos editando un eventos
        setEventIdToEdit(event.id);
        setIsEditingEvent(true);
        setEventName(event.title);
        setEventLocation(event.extendedProps.locationId);
        setPopupDescription(event.extendedProps.observations);
        setPopupSelectedDate(event.start.split('T')[0]);
        if (event.allDay) {
            setIsAllDay(true);
        } else {
            setIsAllDay(false);
            const [startHour, startMinutes] = event.start.split('T')[1].split(':');
            setPopupStartingHour(startHour);
            setPopupStartingMinutes(startMinutes);

            const [endHour, endMinutes] = event.end.split('T')[1].split(':');
            setPopupEndingHour(endHour);
            setPopupEndingMinutes(endMinutes);
        }
        setIsPopupOpen(true);
        setCurrentStep(1);
    };

    const handleDeleteEvent = async (reunion) => {
        try {
            // Mostrar un mensaje de confirmación antes de eliminar la reunión
            if (!window.confirm(`¿Estás seguro de que quieres eliminar la reunión "${reunion.title}"?`)) {
                return;
            }
    
            // Hacer una petición DELETE al backend para eliminar la reunión
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${config.BACKEND_URL}/api/meetings/${reunion.id}/cancel`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al eliminar la reunión');
            }
    
            // Actualizar las reuniones organizadas para eliminar la reunión eliminada
            setOrganizedEvents(prevEvents => prevEvents.filter(event => event.id !== reunion.id));
            setReunionesOrganizadas(prevMeetings => prevMeetings.filter(meeting => meeting.id !== reunion.id));
    
            alert('La reunión se ha eliminado correctamente.');
        } catch (error) {
            console.error('Error al eliminar la reunión:', error);
            alert('Hubo un error al intentar eliminar la reunión. Por favor, inténtalo de nuevo.');
        }
    };


    /* Efectos
    useEffect(() => {
        loadMeetings();
        loadOrganizedMeetings();
        loadWorkSchedules();
    }, [loadMeetings, loadOrganizedMeetings]);*/
    //Quietar esto
    useEffect(() => {
        const mockEvents = [
            {
                id: "mock-event-1",
                title: "Reunión de Prueba 1",
                start: "2024-12-08T10:00:00",
                end: "2024-12-08T11:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Juntas 1",
                    observations: "Primera reunión de prueba.",
                    organizerName: "Luis Fernández",
                },
            },
            {
                id: "mock-event-2",
                title: "Reunión de Prueba 2",
                start: "2024-12-09T15:00:00",
                end: "2024-12-09T16:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Conferencias",
                    observations: "Segunda reunión de prueba.",
                    organizerName: "María Domínguez",
                },
            },
            {
                id: "mock-event-3",
                title: "Reunión de Prueba 2",
                start: "2024-12-09T15:00:00",
                end: "2024-12-09T16:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Conferencias",
                    observations: "Segunda reunión de prueba.",
                    organizerName: "María Domínguez",
                },
            },
            {
                id: "mock-event-4",
                title: "Reunión de Prueba 3",
                start: "2024-12-09T15:00:00",
                end: "2024-12-09T16:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Conferencias",
                    observations: "Segunda reunión de prueba.",
                    organizerName: "María Domínguez",
                },
            },
            {
                id: "mock-event-5",
                title: "Reunión de Prueba 3",
                start: "2024-12-18T15:00:00",
                end: "2024-12-18T16:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Conferencias",
                    observations: "Tercera reunión de prueba.",
                    organizerName: "María Domínguez",
                },
            },
            {
                id: "mock-event-6",
                title: "Reunión de Prueba 4",
                start: "2024-12-18T18:00:00",
                end: "2024-12-18T20:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Conferencias",
                    observations: "Tercera reunión de prueba.",
                    organizerName: "María Domínguez",
                },
            },
        
        ];

        const mocky = [
            {
                id: "mock-event-8",
                title: "Reunión de Prueba 10",
                start: "2024-12-08T8:00:00",
                end: "2024-12-08T9:00:00",
                allDay: false,
                extendedProps: {
                    locationName: "Sala de Juntas 1",
                    observations: "Primera reunión de prueba.",
                    organizerName: "Luis Fernández",
                },
            },
        
        ];
        
    
       
        setRegularEvents(mockEvents);
        setReunionesAceptadas(mockEvents);
        setReunionesOrganizadas(mocky);
        //setReunionesPendientes(mockEvents);
        //setPendingMeetingsEvents(mockEvents);
    }, []);

    // Modificar el useEffect para el filtrado de usuarios
    useEffect(() => {
        if (!searchTerm) {
            setFilteredParticipants(availableUsers);
            return;
        }

        const filtered = availableUsers.filter(user => 
            user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredParticipants(filtered);
    }, [searchTerm, availableUsers]);


    // Transformar eventos para `markedDates`
    const transformEvents = (events, color) => {
        const transformedEvents = {};
        events.forEach((event) => {
            const dateKey = event.start.split('T')[0]; // Extraer fecha en formato YYYY-MM-DD
            if (!transformedEvents[dateKey]) {
                transformedEvents[dateKey] = { marked: true, dots: [] };
            }
            transformedEvents[dateKey].dots.push({
                color, // Color personalizado por tipo de evento
                key: event.id, // Identificador único
                event, // Almacena el evento completo
            });
        });
        return transformedEvents;
    };
  
    // Generar markedDates combinando todos los eventos
    const markedDates = {   // cambiar esto a morado organizador y asistente en verde

        //organizadas, aceptadas y pendientes,   usar reunionesOrganizadas, reunionePendientes y reunionesAceptadas
        //...transformEvents(regularEvents, '#00aced'), // Azul para regularEvents
        ...transformEvents(reunionesAceptadas, '#28a745'),
        //...transformEvents(pendingMeetingsEvents, '#ffc107'), // Amarillo para pendingMeetingsEvents
        ...transformEvents(reunionesOrganizadas, '#6f42c1'),
        //...transformEvents(organizedEvents, '#28a745'), // Verde para organizedEvents
    };
    /*

  const handleDayPress = (day) => {
        alert(`Has seleccionado el día: ${day.dateString}\nEventos: ${
            markedDates[day.dateString]?.dots.map(dot => dot.key).join(', ') || 'Ninguno'
        }`);
    }; */
    const handleDayPress = (day) => {
        // Obtener los eventos únicos para el día seleccionado
        setSelectedDay(day.dateString); 
        const eventos = markedDates[day.dateString]?.dots.map((dot) => ({
            ...dot.event, 
            color: dot.color, // Asignar el color del evento
        })) || [];
        console.log(eventos);
        // Actualizar el estado asegurando que no haya duplicados
        const eventosUnicos = Array.from(new Set(eventos.map((event) => event.id))) // Filtrar por ID único
          .map((id) => eventos.find((event) => event.id === id));
      
        setSelectedEvents(eventosUnicos);
    };

    const handleEventPress = (event) => {
        //setSelectedMeeting(event); // Establecer la reunión seleccionada
        //setModalVisible(true); // Mostrar el modal con los detalles
        const isOrganizedEvent = reunionesOrganizadas.some(reunion => reunion.id === event.id);
       
        if (isOrganizedEvent) {
            // Si es una reunión organizada, permite la edición
            handleModifyEvent(event);
        } else {
            // Si no, solo muestra la información
            setSelectedMeeting(event);
            setModalVisible(true);
        }
    };


    return (
        <>
            {/* <NavBar isAdmin={false} /> */}
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <ScrollView 
                    style={styles.scrollContainer} 
                    contentContainerStyle={styles.scrollContent}
                >
                    
                    <View style={[styles['AdminCalendarapp-container'], styles['main-content']]}>
                    <Image
                        source={require('../media/1206.png')}
                        style={styles['background-image']}
                        resizeMode="cover"
                    />
                    {activeContent === 'calendar' &&(

                        
                        // Calendario en la parte superior
                        <SafeAreaView style={styles.calendarContainer}>
                            
                        <Text style={styles.subtitleCalend}>Selecciona una fecha para ver tus eventos</Text>
                            <Calendar style={styles.calendar}
                            // Días marcados con eventos
                                markingType={'multi-dot'}
                                markedDates={markedDates}

                                // Evento cuando se selecciona un día
                                onDayPress={handleDayPress}

                                // Opciones de estilo
                                theme={{
                                    selectedDayBackgroundColor: '#00aced',
                                    todayTextColor: '#00aced',
                                    dayTextColor: '#2d4150',
                                    arrowColor: '#00aced',
                                    monthTextColor: '#00aced',
                                    textDayFontWeight: '300',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '300',
                                }}
                            />
                            {/* Lista de eventos seleccionados */}
                            {selectedEvents.length > 0 && (
                                 <>
                                <Text style={styles.headerText}>Reuniones del día {selectedDay}</Text>
                            <FlatList
                                data={selectedEvents}
                                keyExtractor={(item) =>  item.id.toString()} // Manejo seguro
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                <TouchableOpacity
                                style={[styles.eventButton, { backgroundColor: item.color || '#fffff'} ]}
                                        onPress={() => handleEventPress(item)}
                                    >
                                    <Text style={styles.eventText}>{item.title || 'Información no encontrada'}</Text>
                                </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                <Text style={styles.noEventsText}>No hay eventos para este día</Text>
                                }
                            />
                            </>
                            )}
                           

                                {/* Modal para mostrar detalles de la reunión */}
                                <Modal
                                    visible={modalVisible}
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => setModalVisible(false)}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <Text style={styles.modalTitle}>Detalles de la reunión</Text>
                                            {selectedMeeting && (
                                                <>
                                                    <Text>Título: {selectedMeeting.title}</Text>
                                                    <Text>Fecha: {selectedMeeting.start}</Text>
                                                    <Text>Descripción: {selectedMeeting.description}</Text>
                                                    {/* Agrega otros detalles según sea necesario */}
                                                </>
                                            )}
                                            <TouchableOpacity
                                                style={styles.closeButton}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Text style={styles.closeButtonText}>Cerrar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </SafeAreaView>
                    )}




                    {activeContent === 'reuniones' && (
                        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
                            <View style={styles['AdminCalendar-left-panel']}>
                                <TouchableOpacity
                                    style={styles['section-header']}
                                    onPress={() => setIsPendingOpen(!isPendingOpen)}
                                >
                                    <Text style={styles['section-header-text']}>
                                        Reuniones Pendientes {isPendingOpen ? '-' : '+'}
                                    </Text>
                                </TouchableOpacity>
                                    {isPendingOpen && (
                                        <View style={styles['meeting-list-pending']}>
                                            {reunionesPendientes.length > 0 ? (
                                                reunionesPendientes.map((reunion) => (
                                                    <View key={reunion.meetingId} style={[styles['meeting-item'], styles['meeting-item-pending']]}>
                                                        <View style={styles['meeting-info']}>
                                                            <Text>{reunion.title}</Text>
                                                        </View>
                                                        <View style={styles['meeting-actions']}>
                                                            <TouchableOpacity
                                                                style={styles['action-button']}
                                                                onPress={() =>
                                                                    handleEventClick({
                                                                        event: {
                                                                            id: reunion.id,
                                                                            title: reunion.title,
                                                                            startStr: reunion.start,
                                                                            endStr: reunion.end,
                                                                            allDay: reunion.allDay,
                                                                            extendedProps: {
                                                                                locationName: reunion.extendedProps.locationName,
                                                                                observations: reunion.extendedProps.observations,
                                                                                organizerName: reunion.extendedProps.organizerName,
                                                                            },
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                <Image
                                                                    source={require('../media/informacion.png')}
                                                                    style={styles['info-button']}
                                                                    accessibilityLabel="Información"
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={styles['action-reunion-button']}
                                                                onPress={() => {
                                                                    setSelectedEvent(reunion);
                                                                    setConfirmationAction('accept');
                                                                    setShowConfirmation(true);
                                                                }}
                                                            >
                                                                <Image
                                                                    source={require('../media/garrapata.png')}
                                                                    style={styles['accept-button']}
                                                                    accessibilityLabel="Aceptar"
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={styles['action-reunion-button']}
                                                                onPress={() => {
                                                                    setSelectedEvent(reunion);
                                                                    setConfirmationAction('reject');
                                                                    setShowConfirmation(true);
                                                                }}
                                                            >
                                                                <Image
                                                                    source={require('../media/cancelar.png')}
                                                                    style={styles['reject-button']}
                                                                    accessibilityLabel="Rechazar"
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles['no-participants-message']}>No hay reuniones pendientes</Text>
                                            )}
                                        </View> 
                                    )}

                                    <TouchableOpacity
                                        style={styles['section-header']}
                                        onPress={() => setIsAcceptedOpen(!isAcceptedOpen)}
                                    >
                                        <Text style={styles['section-header-text']}>
                                            Reuniones Aceptadas {isAcceptedOpen ? '-' : '+'}
                                        </Text>
                                    </TouchableOpacity> 
                                    {isAcceptedOpen && (
                                        <View style={styles['meeting-list-accepted']}>
                                            {reunionesAceptadas.map((reunion) => (
                                                <View key={reunion.meetingId} style={[styles['meeting-item'], styles['meeting-item-accepted']]}>
                                                    <View style={styles['meeting-item-content']}>
                                                        <View style={styles['meeting-info']}>
                                                            <Text>{reunion.title}</Text>
                                                        </View>
                                                        <View style={styles['meeting-buttons']}>
                                                            <TouchableOpacity
                                                                style={styles['info-button']}
                                                                onPress={() =>
                                                                    handleEventClick({
                                                                        event: {
                                                                            id: reunion.id,
                                                                            title: reunion.title,
                                                                            startStr: reunion.start,
                                                                            endStr: reunion.end,
                                                                            allDay: reunion.allDay,
                                                                            extendedProps: {
                                                                                locationName: reunion.extendedProps.locationName,
                                                                                observations: reunion.extendedProps.observations,
                                                                                organizerName: reunion.extendedProps.organizerName,
                                                                            },
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                <Image
                                                                    source={require('../media/informacion.png')}
                                                                    style={styles['info-button-img']}
                                                                    accessibilityLabel="Info"
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={styles['section-header']}
                                        onPress={() => setIsOrganizedOpen(!isOrganizedOpen)}
                                    >
                                        <Text style={styles['section-header-text']}>
                                            Reuniones Organizadas {isOrganizedOpen ? '-' : '+'}
                                        </Text>
                                    </TouchableOpacity>
                                    {isOrganizedOpen && (
                                        <View style={styles['meeting-list-organized']}>
                                            <Text style={styles['AdminCalendar-left-panel-h3']}>Reuniones Organizadas</Text>
                                            {reunionesOrganizadas.map((reunion) => (
                                                <View
                                                    key={reunion.id}
                                                    style={[
                                                        styles['meeting-item'],
                                                        styles['meeting-item-organized'],
                                                        reunion.allRejected
                                                            ? styles['meeting-item-rejected-meeting']
                                                            : styles['meeting-item-normal-meeting'],
                                                    ]}
                                                >
                                                    <View style={styles['meeting-item-content']}>
                                                        <View style={styles['meeting-info']}>
                                                            <Text>{reunion.title}</Text>
                                                        </View>
                                                        <View style={styles['meeting-buttons']}>
                                                            <TouchableOpacity
                                                                style={styles['info-button']}
                                                                onPress={() =>
                                                                    handleEventClick({
                                                                        event: {
                                                                            id: reunion.id,
                                                                            title: reunion.title,
                                                                            startStr: reunion.start,
                                                                            endStr: reunion.end,
                                                                            allDay: reunion.allDay,
                                                                            extendedProps: reunion.extendedProps,
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                <Image
                                                                    source={require('../media/informacion.png')}
                                                                    style={styles['info-button-img']}
                                                                    accessibilityLabel="Info"
                                                                />
                                                            </TouchableOpacity>
                                                            {!reunion.allRejected && (
                                                                <TouchableOpacity
                                                                    style={styles['modify-event-button']}
                                                                    onPress={() => handleModifyEvent(reunion)}
                                                                >
                                                                    <Image
                                                                        source={require('../media/mano.png')}
                                                                        style={styles['modify-event-button-img']}
                                                                        accessibilityLabel="Editar"
                                                                    />
                                                                </TouchableOpacity>
                                                            )}
                                                            <TouchableOpacity
                                                                style={styles['delete-event-button']}
                                                                onPress={() => handleDeleteEvent(reunion)}
                                                            >
                                                                <Image
                                                                    source={require('../media/papelera.png')}
                                                                    style={styles['delete-event-button-img']}
                                                                    accessibilityLabel="Eliminar"
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                <View style={styles['AdminCalendar-add-time']}>
                                    <Text style={styles['AdminCalendar-add-time-text']}>Crear nueva reunión</Text>
                                    <TouchableOpacity style={styles['add-button']} onPress={handleAddTimeClick}>
                                        <Text style={styles['add-button-text']}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>











                            {/* <div className="AdminCalendar-calendar-container">
                                <h2>Calendario de Trabajo</h2>
                                <div className="calendar-wrapper">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        eventSources={[
                                            {
                                                events: regularEvents,
                                                color: '#28a745',
                                                textColor: 'white'
                                            },
                                            {
                                                events: pendingMeetingsEvents,
                                                color: '#ffc107',
                                                textColor: 'black'
                                            },
                                            {
                                                events: organizedEvents.map(event => ({
                                                    ...event,
                                                    color: event.backgroundColor // Usar el color definido en el evento
                                                }))
                                            }
                                        ]}
                                        eventDidMount={(info) => {
                                            console.log("Evento montado en el calendario:", {
                                                id: info.event.id,
                                                title: info.event.title,
                                                start: info.event.start,
                                                end: info.event.end,
                                                source: info.event.source?.id
                                            });
                                        }}
                                        eventClick={handleEventClick}
                                        selectable={true}
                                    />
                                </div>
                            </div> */}
                            {/* Pop-up de detalles del evento */}
                            {isEventDetailPopupOpen && selectedEvent && (
                            <Modal
                                visible={isEventDetailPopupOpen}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setIsEventDetailPopupOpen(false)}
                            >
                                <View style={styles['popup-overlay']}>
                                    <View style={styles['popup-container']}>
                                        <Text style={styles['popup-title']}>Detalles de la Reunión</Text>

                                        {/* Nombre de la Reunión */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Nombre de la Reunión:</Text>
                                            <Text style={styles['value']}>{selectedEvent.title}</Text>
                                        </View>

                                        {/* Fecha */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Fecha:</Text>
                                            <Text style={styles['value']}>
                                                {selectedEvent.start.split('T')[0]}
                                            </Text>
                                        </View>

                                        {/* Hora de Inicio y Fin */}
                                        {!selectedEvent.allDay && (
                                            <>
                                                <View style={styles['AdminCalendar-input-group']}>
                                                    <Text style={styles['label']}>Hora de Inicio:</Text>
                                                    <Text style={styles['value']}>
                                                        {selectedEvent.start.split('T')[1]}
                                                    </Text>
                                                </View>

                                                <View style={styles['AdminCalendar-input-group']}>
                                                    <Text style={styles['label']}>Hora de Fin:</Text>
                                                    <Text style={styles['value']}>
                                                        {selectedEvent.end.split('T')[1]}
                                                    </Text>
                                                </View>
                                            </>
                                        )}

                                        {/* Organizador */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Organizador:</Text>
                                            <Text style={styles['value']}>
                                                {selectedEvent.extendedProps.organizerName}
                                            </Text>
                                        </View>

                                        {/* Ubicación */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Ubicación:</Text>
                                            <Text style={styles['value']}>
                                                {selectedEvent.extendedProps.locationName}
                                            </Text>
                                        </View>

                                        {/* Observaciones */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Observaciones:</Text>
                                            <Text style={styles['value']}>
                                                {selectedEvent.extendedProps.observations}
                                            </Text>
                                        </View>

                                        {/* Lista de Invitados */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Lista de Invitados:</Text>
                                            <View>
                                                {invitees.map((invitee, index) => (
                                                    <Text key={index} style={styles['value']}>
                                                        {invitee.userName} - {invitee.status}
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Botones */}
                                        <View style={styles['popup-button-container']}>

                                            {/* Botón Modificar */}
                                            {organizedEvents.find((event) => event.id === selectedEvent.id) &&
                                                !areAllInvitationsRejected(invitees) && (
                                                    <TouchableOpacity
                                                        style={styles['modify-event-button']}
                                                        onPress={() => handleModifyEvent(selectedEvent)}
                                                    >
                                                        <Text style={styles['modify-button-text']}>Modificar</Text>
                                                    </TouchableOpacity>
                                                )}

                                            {/* Botón Asistencia */}
                                            {regularEvents.find((event) => event.id === selectedEvent.id) && (
                                                <View style={styles['attendance-button-container']}>
                                                    {selectedEvent.extendedProps.hasConfirmedAttendance ? (
                                                        <TouchableOpacity
                                                            style={styles['attendance-confirmed-button']}
                                                        >
                                                            <Text style={styles['attendance-confirmed-text']}>
                                                                Asistencia Confirmada
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity
                                                            style={styles['attendance-button']}
                                                            onPress={() =>
                                                                handleAttendanceUpdate(selectedEvent.id)
                                                            }
                                                        >
                                                            <Text style={styles['attendance-button-text']}>
                                                                Confirmar Asistencia
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                            {/* Botón Cerrar */}
                                            <TouchableOpacity
                                                style={styles['close-button']}
                                                onPress={() => setIsEventDetailPopupOpen(false)}
                                            >
                                                <Text style={styles['close-button-text']}>Cerrar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        )}


                            {/* Ventana de confirmación */}
                            {showConfirmation && (
                                <VentanaConfirm
                                    onConfirm={handleConfirmAction}
                                    onCancel={() => setShowConfirmation(false)}
                                    action={confirmationAction}
                                />
                            )}

                            {isPopupOpen && currentStep === 1 && (
                                <Modal
                                    visible={isPopupOpen}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={handleClosePopup}
                                >
                                    <View style={styles['popup-overlay']}>
                                        <View style={styles['popup-container']}>
                                        <ScrollView
                                                contentContainerStyle={styles['popup-scroll-content']}
                                                keyboardShouldPersistTaps="handled" // Permite cerrar el teclado al hacer tap fuera
                                            >
                                            <Text style={styles['popup-title']}>
                                                {isEditingEvent ? 'Modificar Reunión' : 'Crear Nueva Reunión'}
                                            </Text>

                                            {/* Campo: Nombre de la Reunión */}
                                            <View style={styles['AdminCalendar-input-group']}>
                                                <Text style={styles['label']}>Nombre de la Reunión:</Text>
                                                <TextInput
                                                    style={styles['text-input']}
                                                    placeholder="Nombre de la Reunión"
                                                    value={eventName}
                                                    onChangeText={(text) => setEventName(text)}
                                                />
                                            </View>

                                            {/* Campo: Fecha */}
                                            <View style={styles['AdminCalendar-input-group']}>
                                                <Text style={styles['label']}>Fecha:</Text>
                                                <TextInput
                                                    style={styles['text-input']}
                                                    placeholder="YYYY-MM-DD"
                                                    value={popupSelectedDate}
                                                    onChangeText={(text) => setPopupSelectedDate(text)}
                                                />
                                            </View>

                                            {/* Campo: ¿Es una reunión de el día? */}
                                            <View style={styles['AdminCalendar-input-group']}>
                                                <Text style={styles['label']}>¿Es una reunión de todo el día?</Text>
                                                <Switch
                                                    value={isAllDay}
                                                    onValueChange={(value) => setIsAllDay(value)}
                                                />
                                            </View>
                                        
                                            {!isAllDay && (
                                            <>
                                                <View style={styles['AdminCalendar-input-group']}>
                                                    <Text style={styles['label']}>Horarios laborales disponibles:</Text>
                                                    <View style={styles['work-schedules']}>
                                                        {workSchedules.length > 0 ? (
                                                            workSchedules.map((schedule, index) => (
                                                                <View key={index} style={styles['work-schedule-item']}>
                                                                    <Text>
                                                                        Bloque {index + 1}: {schedule.startingTime.slice(0, -3)} - {schedule.endingTime.slice(0, -3)}
                                                                    </Text>
                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text>No hay horarios laborales definidos</Text>
                                                        )}
                                                    </View>
                                                </View>

                                                {/* Hora de Inicio */}
                                                <View style={styles['AdminCalendar-input-group']}>
                                                    <Text style={styles['label']}>Hora de inicio:</Text>
                                                    <View style={styles['time-input-container']}>
                                                        <TextInput
                                                            style={styles['time-input']}
                                                            placeholder="HH"
                                                            keyboardType="numeric"
                                                            value={popupStartingHour}
                                                            onChangeText={(text) => handlePopupTimeChange({ target: { value: text } }, 'popupStartingHour')}
                                                            maxLength={2}
                                                        />
                                                        <Text style={styles['time-separator']}>:</Text>
                                                        <TextInput
                                                            style={styles['time-input']}
                                                            placeholder="MM"
                                                            keyboardType="numeric"
                                                            value={popupStartingMinutes}
                                                            onChangeText={(text) => handlePopupTimeChange({ target: { value: text } }, 'popupStartingMinutes')}
                                                            maxLength={2}
                                                        />
                                                    </View>
                                                </View>

                                                {/* Hora de Fin */}
                                                <View style={styles['AdminCalendar-input-group']}>
                                                    <Text style={styles['label']}>Hora de fin:</Text>
                                                    <View style={styles['time-input-container']}>
                                                        <TextInput
                                                            style={styles['time-input']}
                                                            placeholder="HH"
                                                            keyboardType="numeric"
                                                            value={popupEndingHour}
                                                            onChangeText={(text) => handlePopupTimeChange({ target: { value: text } }, 'popupEndingHour')}
                                                            maxLength={2}
                                                        />
                                                        <Text style={styles['time-separator']}>:</Text>
                                                        <TextInput
                                                            style={styles['time-input']}
                                                            placeholder="MM"
                                                            keyboardType="numeric"
                                                            value={popupEndingMinutes}
                                                            onChangeText={(text) => handlePopupTimeChange({ target: { value: text } }, 'popupEndingMinutes')}
                                                            maxLength={2}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )}

                                        {/* Ubicación */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Ubicación:</Text>
                                            <View style={styles['select-container']}>
                                                <Picker
                                                    selectedValue={eventLocation}
                                                    onValueChange={(itemValue) => setEventLocation(itemValue)}
                                                    style={styles['select']}
                                                >
                                                    <Picker.Item label="Seleccione..." value="" />
                                                    {locations.map((location) => (
                                                        <Picker.Item
                                                            key={location.locationId}
                                                            label={location.locationName}
                                                            value={location.locationId}
                                                        />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </View>

                                        {/* Observaciones */}
                                        <View style={styles['AdminCalendar-input-group']}>
                                            <Text style={styles['label']}>Observaciones:</Text>
                                            <TextInput
                                                style={styles['textarea']}
                                                placeholder="Añadir observaciones"
                                                value={popupDescription}
                                                onChangeText={(text) => setPopupDescription(text)}
                                                multiline
                                                numberOfLines={4}
                                            />
                                        </View>

                                        {/* Botones */}
                                        <View style={styles['AdminCalendar-button-group']}>
                                            <TouchableOpacity style={styles['save-button']} onPress={isEditing ? handleSaveEvent : handleNextStep}>
                                                <Text style={styles['save-button-text']}>{isEditing ? 'Guardar' : 'Siguiente'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles['cancel-button']} onPress={handleClosePopup}>
                                                <Text style={styles['cancel-button-text']}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>
                                        </ScrollView>
                                        </View> 
                                    </View>
                                </Modal>
                            )}
                            {isPopupOpen && currentStep === 2 && (
                                <Modal
                                    visible={isPopupOpen}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={handleClosePopup}
                                >
                                    <View style={styles['popup-overlay']}>
                                        <View style={styles['popup-container']}>
                                            <Text style={styles['popup-title']}>Invitar Participantes</Text>

                                            {/* Campo de búsqueda */}
                                            <View style={styles['search-participants-container']}>
                                                <TextInput
                                                    style={styles['text-input']}
                                                    placeholder="Buscar participantes..."
                                                    value={searchTerm}
                                                    onChangeText={(text) => setSearchTerm(text)}
                                                />
                                            </View>

                                            {/* Lista de participantes disponibles */}
                                            <View style={styles['participant-list-available']}>
                                                {filteredParticipants.map((participant) => (
                                                    <TouchableOpacity
                                                        key={participant.id}
                                                        style={styles['participant-item']}
                                                        onPress={() => handleSelectParticipant(participant)}
                                                    >
                                                        <Text style={styles['participant-text']}>{participant.nombre}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>

                                            {/* Lista de participantes seleccionados */}
                                            <View style={styles['selected-participants']}>
                                                <Text style={styles['selected-participants-title']}>Participantes Seleccionados:</Text>
                                                {selectedUsers.map((user) => (
                                                    <View
                                                        key={user.id}
                                                        style={[
                                                            styles['selected-participant'],
                                                            user.enAusencia && styles['selected-participant-absent']
                                                        ]}
                                                    >
                                                        <Text>{user.nombre}</Text>
                                                        <TouchableOpacity onPress={() => handleRemoveUser(user)}>
                                                            <Text style={styles['remove-button']}>X</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>

                                            {/* Botones */}
                                            <View style={styles['AdminCalendar-button-group']}>
                                                <TouchableOpacity style={styles['save-button']} onPress={handleSaveEvent}>
                                                    <Text style={styles['save-button-text']}>Guardar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles['cancel-button']} onPress={handleClosePopup}>
                                                    <Text style={styles['cancel-button-text']}>Cancelar</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Mensaje de error */}
                                            {errorEvent && <Text style={styles['error-message']}>{errorEvent}</Text>}
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </SafeAreaView>
                    )}
                    </View>
                </ScrollView>
            )}
            {/* Menú flotante */}
            <View style={styles.floatingMenu}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setActiveContent('calendar')}
                >
                    <Image
                        source={require('../media/calendar_management_btn.png')}
                        style={styles.menuButtonIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setActiveContent('reuniones')}
                >
                    <Image
                        source={require('../media/schedule_management_btn.png')}
                        style={styles.menuButtonIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image
                        source={require('../media/user_icon.png')}
                        style={styles.menuButtonIcon}
                    />
                </TouchableOpacity>
            </View>


        </>
    );
};

export default CalendarComponent;

const styles = StyleSheet.create({
    'background-image': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 60,
        right: -30,
        opacity: 0.3,
        zIndex: -1,
    },
    'meeting-list-pending': {
        marginTop: 5,
        padding: 5,
        maxHeight: 175,
        overflow: 'hidden',
    },
    'AdminCalendar-left-panel-h3': {
        marginTop: 20,
        marginBottom: 3,
        fontSize: 16,
        fontWeight: 'bold',
    },
    'meeting-item': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        borderRadius: 4,
        fontSize: 14,
        lineHeight: 18,
        backgroundColor: '#f9f9f9',
    },
    'meeting-item-pending': {
        backgroundColor: '#fff8b5',
        borderLeftWidth: 4,
        borderLeftColor: '#f7d154',
    },
    'meeting-info': {
        flexGrow: 1,
    },
    'meeting-actions': {
        flexDirection: 'row',
        gap: 10,
    },
    'action-button': {
        width: 40,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    'info-button': {
        width: 24,
        height: 24,
    },
    'accept-button': {
        width: 24,
        height: 24,
        backgroundColor: '#28a745',
    },
    'reject-button': {
        width: 24,
        height: 24,
        backgroundColor: '#dc3545',
    },
    'action-reunion-button': {
        width: 22,
        height: 22,
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    'no-participants-message': {
        textAlign: 'center',
        color: '#6b7280',
    },
	'meeting-list-accepted': {
        marginTop: 5,
        padding: 5,
        maxHeight: 175,
        overflow: 'hidden',
    },
    'meeting-item-accepted': {
        backgroundColor: '#90e689',
        borderLeftWidth: 4,
        borderLeftColor: '#0ee00e',
    },
    'meeting-item-content': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    'meeting-buttons': {
        marginLeft: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    'info-button-img': {
        width: '100%',
        height: '100%',
    },
	'meeting-list-organized': {
        marginTop: 5,
        padding: 5,
        maxHeight: 175,
        overflow: 'hidden',
    },
    'meeting-item-organized': {
        borderLeftWidth: 4,
        marginBottom: 8,
        padding: 8,
        borderRadius: 4,
        transition: 'background-color 0.2s',
    },
    'meeting-item-rejected-meeting': {
        backgroundColor: '#ffcccc',
        borderLeftColor: '#e57373',
    },
    'meeting-item-normal-meeting': {
        backgroundColor: '#ce93d8',
        borderLeftColor: '#9c27b0',
    },
    'modify-event-button': {
        backgroundColor: '#e4e734',
        borderRadius: 4,
        cursor: 'pointer',
        width: 34,
        height: 30,
        padding: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'modify-event-button-img': {
        width: '100%',
        height: '100%',
    },
    'delete-event-button': {
        backgroundColor: '#eb5151',
        borderRadius: 4,
        cursor: 'pointer',
        width: 34,
        height: 30,
        padding: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'delete-event-button-img': {
        width: '100%',
        height: '100%',
    },
	'AdminCalendar-add-time': {
        display: 'fixed',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        marginLeft: '25%',
    },
    'add-button': {
        backgroundColor: '#1e3a8a',
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    'add-button-text': {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    'AdminCalendar-add-time-text': {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#1e3a8a',
        textAlign: 'center',
    },
	'AdminCalendar-left-panel': {
        width: 275,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
	'AdminCalendarapp-container': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 20,
        gap: 20,
        maxWidth: 1200,
        marginBottom: 70,
    },
    'main-content': {
        marginTop: 120,
    },
    'popup-overlay': {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    'popup-container': {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        maxWidth: 400,
        maxHeight: '80%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    'popup-title': {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    'popup-scroll-content': {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    'AdminCalendar-input-group': {
        marginBottom: 15,
    },
    'label': {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    'value': {
        fontSize: 14,
        color: '#333',
    },
    'text-input': {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        color: '#333',
    },
    'AdminCalendar-button-group': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    'save-button': {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    'save-button-text': {
        color: 'white',
        fontWeight: 'bold',
    },
    'cancel-button': {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    'cancel-button-text': {
        color: 'white',
        fontWeight: 'bold',
    },
    'work-schedules': {
        marginBottom: 10,
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    },
    'work-schedule-item': {
        padding: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        marginBottom: 5,
    },
    'time-input-container': {
        flexDirection: 'row',
        alignItems: 'center',
    },
    'time-input': {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        width: 60,
        textAlign: 'center',
    },
    'time-separator': {
        marginHorizontal: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    'select-container': {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 5,
    },
    'select': {
        fontSize: 14,
        color: '#333',
    },
    'textarea': {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    'search-participants-container': {
        marginBottom: 15,
    },
    'participant-list-available': {
        maxHeight: 150,
        marginBottom: 15,
    },
    'participant-item': {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    'participant-text': {
        fontSize: 14,
        color: '#333',
    },
    'selected-participants': {
        marginBottom: 15,
    },
    'selected-participants-title': {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    'selected-participant': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        marginBottom: 5,
    },
    'selected-participant-absent': {
        backgroundColor: '#ffe5e5',
    },
    'remove-button': {
        color: '#dc3545',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    'error-message': {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    'popup-button-container': {
        justifyContent: 'space-between',
        marginTop: 10,
    },
    'close-button': {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 8,
    },
    'close-button-text': {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    'modify-button-text': {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    'attendance-button-container': {
        marginTop: 1,
        marginBottom: 10,
    },
    'attendance-button': {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
    },
    'attendance-button-text': {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    'attendance-confirmed-button': {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 8,
    },
    'attendance-confirmed-text': {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 20,
        minHeight: '100%',
    },
    'section-header': {
        backgroundColor: '#1e3a8a',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    'section-header-text': {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },   
    floatingMenu: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1e3a8a',
        paddingVertical: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    menuButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 5,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    menuButtonIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    
    menuButtonText: {
        color: '#1e3a8a',
        fontWeight: 'bold',
    }, 
    'calendarContainer': {
        flex: 1, // Asegura que el contenedor ocupe todo el espacio disponible
        backgroundColor: 'white', // Fondo blanco para claridad
        width: '100%', // Usa todo el ancho disponible
        //height: '40%', // Ajusta la altura del calendario (puedes personalizar este valor)
        top: -100,
    },
    'item': {
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    'itemText': {
        color: 'bold',
        fontSize: 16,
    },
    'itemSubText': {
        fontSize: 14,
        color: 'white',
    },

    calendarContainer: {
        flex: 0, // Ajusta el tamaño según el contenido
        backgroundColor: 'white', // Fondo blanco para claridad
        width: '120%', // Ajusta el ancho para que no ocupe todo el espacio
        marginTop: -520, // Ajusta el margen superior para separarlo del encabezado
        padding: 10, // Añade espaciado interno
        alignSelf: 'center', // Centra el contenedor horizontalmente
        borderRadius: 15, // Bordes redondeados para un diseño más moderno
        shadowColor: '#000', // Sombra para darle profundidad
        shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 5, // Difuminado de la sombra
        elevation: 3, // Elevación para dispositivos Android
    },
    calendar: {
        borderWidth: 1, // Borde del calendario
        borderColor: '#ddd', // Color del borde
        borderRadius: 10, // Bordes redondeados
        padding: 10, // Espaciado interno
        fontSize: 16, // Tamaño del texto
        height: 350, // Ajusta la altura del calendario
    },
    subtitleCalend: {
        //fontSize: 16,
        color: '#555',
        //marginBottom: 10,
        //top: 55,
        fontWeight: 'bold',
        left: '10%',
    },



    eventButton: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    eventText: {
        color: '#000000',
        fontWeight: 'bold',
    },
    noEventsText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#00aced',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: '#00aced',
      },
});