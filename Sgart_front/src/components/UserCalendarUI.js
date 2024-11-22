import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';
import VentanaConfirm from './VentanaConfirm';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';

const UserCalendarUI = () => {
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

    // Añadir estos estados adicionales junto a los otros estados
    const [popupHourError, setPopupHourError] = useState(false);
    const [popupMinuteError, setPopupMinuteError] = useState(false);

    // Añadir nuevo estado para reuniones organizadas
    const [organizedEvents, setOrganizedEvents] = useState([]);
    const [reunionesOrganizadas, setReunionesOrganizadas] = useState([]);

    // Cargar invitados de una reunión
    const loadInvitees = useCallback(async (meetingId) => {
        try {
            console.log(`Cargando invitados para la reunión ID: ${meetingId}`);
            const response = await fetch(`http://localhost:9000/administrador/calendarios/invitados`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    // Función para obtener el userId del usuario actual
    const getUserId = async () => {
        try {
            const response = await fetch('http://localhost:9000/users/current/userId', {
                credentials: 'include'
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

    // Cargar reuniones y clasificarlas según los invitados
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

            const response = await fetch('http://localhost:9000/administrador/calendarios/loadMeetings');
            if (!response.ok) {
                throw new Error(`Error al cargar los meetings: ${response.statusText}`);
            }

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

    // Añadir función para cargar reuniones organizadas
    const loadOrganizedMeetings = useCallback(async () => {
        try {
            console.log("Iniciando carga de reuniones organizadas...");
            const response = await fetch('http://localhost:9000/usuarios/calendarios/organized-meetings', {
                credentials: 'include'
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

    // El handleEventClick ahora puede usar los invitados ya cargados
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

        // Cargar invitados frescos al hacer click
        const invitados = await loadInvitees(clickInfo.event.id);
        setInvitees(invitados);
        setSelectedEvent(transformedEvent);
        setIsEventDetailPopupOpen(true);
    };

    const handleConfirmAction = async () => {
        try {
            console.log('Iniciando actualización de estado para evento:', selectedEvent);
            console.log('Acción seleccionada:', confirmationAction);
            
            const url = `http://localhost:9000/invitations/${selectedEvent.id}/status`;
            console.log('URL de la petición:', url);
    
            const requestBody = {
                newStatus: confirmationAction === 'accept' ? 'Aceptada' : 'Rechazada',
                comment: ''
            };
            console.log('Cuerpo de la petición:', requestBody);
    
            const response = await fetch(url, {
                method: 'PUT', // Cambiado de PATCH a PUT
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
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

    // Añadir estas funciones para manejar la creación de reuniones
    const handleAddTimeClick = () => {
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

    const handleNextStep = () => {
        if (!eventName || !popupSelectedDate) {
            alert("Por favor, completa todos los campos obligatorios antes de continuar.");
            return;
        }
        loadUsers();
        loadAbsences();
        setCurrentStep(2);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setCurrentStep(1);
    };

    const handleSaveEvent = async () => {
        setErrorEvent('');
        if (!validateTimeInput(popupStartingHour, popupStartingMinutes, setPopupHourError, setPopupMinuteError) ||
            !validateTimeInput(popupEndingHour, popupEndingMinutes, setPopupHourError, setPopupMinuteError)) {
            alert("Por favor, corrige los campos de hora antes de guardar el evento.");
            return;
        }

        if (selectedUsers.filter((user) => user.enAusencia === true).length > 0) {
            setErrorEvent("ERROR: se está intentando crear una reunión con participantes ausentes.");
            return;
        }

        const startingTime = `${popupStartingHour.padStart(2, '0')}:${popupStartingMinutes.padStart(2, '0')}:00`;
        const endingTime = `${popupEndingHour.padStart(2, '0')}:${popupEndingMinutes.padStart(2, '0')}:00`;

        const newEvent = {
            event_title: eventName,
            event_start_date: popupSelectedDate,
            event_all_day: isAllDay ? 1 : 0,
            event_time_start: isAllDay ? '00:00:00' : startingTime,
            event_time_end: isAllDay ? '23:59:59' : endingTime,
            location_name: eventLocation,
            observations: popupDescription,
            invitees: selectedUsers
        };

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:9000/meetings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) throw new Error('Error al guardar el evento');

            await loadMeetings();
            setIsPopupOpen(false);
            setCurrentStep(1);
            alert("Se ha guardado el evento de manera exitosa.");
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            setErrorEvent('Error al crear la reunión. Por favor, inténtalo de nuevo.');
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
            const response = await fetch('http://localhost:9000/users/available', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error al cargar los usuarios');

            const users = await response.json();
            setAvailableUsers(users);
            setFilteredParticipants(users);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    };

    // Función para cargar ausencias
    const loadAbsences = async () => {
        try {
            const response = await fetch('http://localhost:9000/absences', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error al cargar las ausencias');

            const absences = await response.json();
            // Aquí puedes procesar las ausencias como necesites
            console.log('Ausencias cargadas:', absences);
        } catch (error) {
            console.error('Error cargando ausencias:', error);
        }
    };

    // Función para seleccionar participantes
    const handleSelectParticipant = (participant) => {
        if (!selectedUsers.some(user => user.id === participant.id)) {
            setSelectedUsers([...selectedUsers, participant]);
            setAvailableUsers(availableUsers.filter(user => user.id !== participant.id));
        }
    };

    // Función para remover participantes
    const handleRemoveUser = (user) => {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        setAvailableUsers([...availableUsers, user]);
    };

    // Efectos
    useEffect(() => {
        loadMeetings();
        loadOrganizedMeetings();
    }, [loadMeetings, loadOrganizedMeetings]);
    return (
        <>
            <NavBar isAdmin={false} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='AdminCalendarapp-container main-content'>
                    <div className="AdminCalendar-left-panel">
                        <h3>Reuniones Pendientes</h3>
                        <div className="meeting-list-pending">
                            {reunionesPendientes.length > 0 && (
                                <>
                                    {reunionesPendientes.map((reunion) => (
                                        <div key={reunion.meetingId} className="meeting-item pending">
                                            <div className='meeting-info'>
                                                <p>{reunion.title}</p>
                                            </div>
                                            <div className="meeting-actions">
                                                <button className="action-button info-button" onClick={() => handleEventClick({
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
                                                        }
                                                    }
                                                })}>
                                                    <img src={require('../media/informacion.png')} alt="Información" title='Información del Evento' />
                                                </button>

                                                <button className="action-reunion-button accept-button" onClick={() => {
                                                    setSelectedEvent(reunion);
                                                    setConfirmationAction('accept');
                                                    setShowConfirmation(true);
                                                }}>
                                                    <img src={require('../media/garrapata.png')} alt="Aceptar" title='Aceptar' />
                                                </button>
                                                <button className="action-reunion-button reject-button" onClick={() => {
                                                    setSelectedEvent(reunion);
                                                    setConfirmationAction('reject');
                                                    setShowConfirmation(true);
                                                }}>
                                                    <img src={require('../media/cancelar.png')} alt="Rechazar" title='Rechazar' />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        <h3>Reuniones Aceptadas</h3>
                        <div className="meeting-list-accepted">
                            {reunionesAceptadas.map((reunion) => (
                                <div key={reunion.meetingId} className="meeting-item accepted">
                                    <div className="meeting-item-content">
                                        <div className="meeting-info">
                                            <p>{reunion.title}</p>
                                        </div>
                                        <div className="meeting-buttons">
                                            <button className="info-button" onClick={() => handleEventClick({
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
                                                    }
                                                }
                                            })}>
                                                <img src={require('../media/informacion.png')} alt="Info" />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h3>Reuniones Organizadas</h3>
                        <div className="meeting-list-organized">
                            {reunionesOrganizadas.map((reunion) => (
                                <div key={reunion.id} className="meeting-item organized">
                                    <div className="meeting-item-content">
                                        <div className="meeting-info">
                                            <p>{reunion.title}</p>
                                        </div>
                                        <div className="meeting-buttons">
                                            <button className="info-button" onClick={() => handleEventClick({
                                                event: {
                                                    id: reunion.id,
                                                    title: reunion.title,
                                                    startStr: reunion.start,
                                                    endStr: reunion.end,
                                                    allDay: reunion.allDay,
                                                    extendedProps: reunion.extendedProps
                                                }
                                            })}>
                                                <img src={require('../media/informacion.png')} alt="Info" />
                                            </button>
                                            <button className="modify-event-button" /*onClick={}*/>
                                                <img src={require('../media/mano.png')} alt="Editar" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="AdminCalendar-add-time">
                            <button className="add-button" onClick={handleAddTimeClick}>+</button>
                            <p>Crear nueva reunión</p>
                        </div>
                    </div>

                    <div className="AdminCalendar-calendar-container">
                        <h2>Calendario de Trabajo</h2>
                        <div className="calendar-wrapper">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                eventSources={[
                                    {
                                        events: regularEvents,
                                        color: '#28a745',  // Verde para reuniones aceptadas
                                        textColor: 'white'
                                    },
                                    {
                                        events: pendingMeetingsEvents,
                                        color: '#ffc107',  // Amarillo para reuniones pendientes
                                        textColor: 'black'
                                    },
                                    {
                                        events: organizedEvents,
                                        color: '#9c27b0',  // Morado para reuniones organizadas
                                        textColor: 'white'
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
                    </div>

                    {/* Pop-up de detalles del evento */}
                    {isEventDetailPopupOpen && selectedEvent && (
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Detalles de la Reunión</h2>
                                <div className="AdminCalendar-input-group">
                                    <label>Nombre de la Reunión:</label>
                                    <p>{selectedEvent.title}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Fecha:</label>
                                    <p>{selectedEvent.start.split('T')[0]}</p>
                                </div>
                                {selectedEvent.allDay ? (
                                    <div className="AdminCalendar-input-group">
                                        <label>Esta reunión es de todo el día</label>
                                    </div>
                                ) : (
                                    <>
                                        <div className="AdminCalendar-input-group">
                                            <label>Hora de inicio:</label>
                                            <p>{selectedEvent.start.split('T')[1]}</p>
                                        </div>
                                        <div className="AdminCalendar-input-group">
                                            <label>Hora de fin:</label>
                                            <p>{selectedEvent.end.split('T')[1]}</p>
                                        </div>
                                    </>
                                )}
                                <div className="AdminCalendar-input-group">
                                    <label>Organizador:</label>
                                    <p>{selectedEvent.extendedProps.organizerName}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Ubicación:</label>
                                    <p>{selectedEvent.extendedProps.locationName}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Observaciones:</label>
                                    <p>{selectedEvent.extendedProps.observations}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Lista de Invitados:</label>
                                    <ul>
                                        {invitees.map((invitee, index) => (
                                            <li key={index}>
                                                {invitee.userName} - {invitee.status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="close-button" onClick={() => setIsEventDetailPopupOpen(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
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
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Crear nueva Reunión</h2>
                                <div className="AdminCalendar-input-group">
                                    <label>Nombre de la Reunión:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de la Reunión"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Fecha:</label>
                                    <input
                                        type="date"
                                        value={popupSelectedDate}
                                        onChange={(e) => setPopupSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>¿Es una reunión de todo el día?</label>
                                    <input
                                        type="checkbox"
                                        checked={isAllDay}
                                        onChange={(e) => setIsAllDay(e.target.checked)}
                                    />
                                </div>
                                {!isAllDay && (
                                    <>
                                        <div className="AdminCalendar-input-group">
                                            <label>Hora de inicio:</label>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="HH"
                                                    value={popupStartingHour}
                                                    onChange={(e) => handlePopupTimeChange(e, 'popupStartingHour')}
                                                    min="0"
                                                    max="23"
                                                />
                                                :
                                                <input
                                                    type="number"
                                                    placeholder="MM"
                                                    value={popupStartingMinutes}
                                                    onChange={(e) => handlePopupTimeChange(e, 'popupStartingMinutes')}
                                                    min="0"
                                                    max="59"
                                                />
                                            </div>
                                        </div>
                                        <div className="AdminCalendar-input-group">
                                            <label>Hora de fin:</label>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="HH"
                                                    value={popupEndingHour}
                                                    onChange={(e) => handlePopupTimeChange(e, 'popupEndingHour')}
                                                    min="0"
                                                    max="23"
                                                />
                                                :
                                                <input
                                                    type="number"
                                                    placeholder="MM"
                                                    value={popupEndingMinutes}
                                                    onChange={(e) => handlePopupTimeChange(e, 'popupEndingMinutes')}
                                                    min="0"
                                                    max="59"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="AdminCalendar-input-group">
                                    <label>Ubicación:</label>
                                    <select
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                    >
                                        <option value="Ciudad Real">Ciudad Real</option>
                                        <option value="Toledo">Toledo</option>
                                        <option value="Madrid">Madrid</option>
                                        <option value="Málaga">Málaga</option>
                                        <option value="Barcelona">Barcelona</option>
                                    </select>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Observaciones:</label>
                                    <textarea
                                        value={popupDescription}
                                        onChange={(e) => setPopupDescription(e.target.value)}
                                    />
                                </div>
                                <div className="AdminCalendar-button-group">
                                    <button onClick={handleNextStep}>Siguiente</button>
                                    <button onClick={handleClosePopup}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPopupOpen && currentStep === 2 && (
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Invitar Participantes</h2>
                                <div className="search-participants-container">
                                    <input
                                        type="text"
                                        placeholder="Buscar participantes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="participant-list-available">
                                    {filteredParticipants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="participant-item"
                                            onClick={() => handleSelectParticipant(participant)}
                                        >
                                            {participant.nombre}
                                        </div>
                                    ))}
                                </div>
                                <div className="selected-participants">
                                    <h3>Participantes Seleccionados:</h3>
                                    {selectedUsers.map((user) => (
                                        <div key={user.id} className="selected-participant">
                                            {user.nombre}
                                            <button onClick={() => handleRemoveUser(user)}>X</button>
                                        </div>
                                    ))}
                                </div>
                                {errorEvent && <p className="error-message">{errorEvent}</p>}
                                <div className="AdminCalendar-button-group">
                                    <button onClick={handleSaveEvent}>Guardar</button>
                                    <button onClick={handleClosePopup}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default UserCalendarUI;