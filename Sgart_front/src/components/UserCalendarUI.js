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

    // Efectos
    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);
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
                                    }
                                ]}
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
                </div>
            )}
        </>
    );
};

export default UserCalendarUI;