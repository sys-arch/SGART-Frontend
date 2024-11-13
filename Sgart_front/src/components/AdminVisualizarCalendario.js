import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';

const AdminCalendar = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isMeetingDetailPopupOpen, setIsMeetingDetailPopupOpen] = useState(false);

    // Función para cargar las reuniones desde el backend con depuración
    const loadMeetings = useCallback(async () => {
        try {
            console.log("Intentando cargar meetings desde el backend...");
    
            const response = await fetch('http://localhost:9000/administrador/calendarios/loadMeetings');
            if (!response.ok) {
                throw new Error(`Error al cargar los meetings: ${response.statusText}`);
            }
    
            const backendMeetings = await response.json();
            const transformedMeetings = backendMeetings.map(meeting => {
                const transformed = {
                    id: meeting.meetingId,
                    title: meeting.title,
                    start: `${meeting.meetingDate}T${meeting.startTime}`,
                    end: `${meeting.meetingDate}T${meeting.endTime}`,
                    allDay: meeting.allDay,
                };
                console.log("Meeting transformado:", transformed);
                return transformed;
            });
            setMeetings(transformedMeetings);
    
        } catch (error) {
            console.error("Error al cargar los meetings: ", error);
        }
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const handleEventClick = (clickInfo) => {
        console.log("Evento seleccionado:", clickInfo.event);
        setSelectedMeeting(clickInfo.event);
        setIsMeetingDetailPopupOpen(true);
    };

    return (
        <div className='admin-calendar-view'>
            <div className="admin-calendar-container">
                <h2>Calendario de Reuniones de la Empresa</h2>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={meetings}
                        eventClick={handleEventClick}
                        height="100%"
                    />
                </div>
            </div>

            {/* Pop-up para Detalles del Meeting */}
            {isMeetingDetailPopupOpen && selectedMeeting && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Detalles de la Reunión</h2>
                        <div className="admin-calendar-input-group">
                            <label>Nombre de la Reunión:</label>
                            <p>{selectedMeeting.title}</p>
                        </div>
                        <div className="admin-calendar-input-group">
                            <label>Fecha de la Reunión:</label>
                            <p>{new Date(selectedMeeting.start).toLocaleDateString()}</p>
                        </div>
                        <div className="admin-calendar-input-group">
                            <label>Hora de Inicio:</label>
                            <p>{new Date(selectedMeeting.start).toLocaleTimeString()}</p>
                        </div>
                        <div className="admin-calendar-input-group">
                            <label>Hora de Fin:</label>
                            <p>{new Date(selectedMeeting.end).toLocaleTimeString()}</p>
                        </div>
                        <button className="close-button" onClick={() => setIsMeetingDetailPopupOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCalendar;
