import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import '../App.css';

const AdminWorkingHours = () => {
    // Variables de la sección de modificar día laborable
    const [selectedDate, setSelectedDate] = useState('');
    const [startingHour, setStartingHour] = useState('');
    const [endingHour, setEndingHour] = useState('');
    const [eventName, setEventName] = useState('');

    // Variables de la sección del pop-up de creación de un evento
    const [popupSelectedDate, setPopupSelectedDate] = useState('');
    const [eventFrequency, setEventFrequency] = useState('Una vez');
    const [isAllDay, setIsAllDay] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupEndingHour, setPopupEndingHour] = useState('');

    // Variables para el pop-up de detalles de los eventos
    const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    /* Los eventos se cargarán de la base de datos de eventos */
    const [events, setEvents] = useState([
        { title: 'Evento 1', start: '2024-10-15T10:00:00', end: '2024-10-15T12:00:00', allDay: false, eventFrequency: 'Una vez' },
        { title: 'Evento 2', start: '2024-10-20', allDay: true, eventFrequency: 'Semanal' },
    ]);

    /* Horarios de trabajo por defecto */
    const defaultStartTime = '08:00';
    const defaultEndTime = '15:00';

    const handleDateClick = (arg) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);  // Se utiliza para modificar el día
        setStartingHour(defaultStartTime);
        setEndingHour(defaultEndTime);
    };

    const handleAddTimeClick = () => {
        setPopupStartingHour('');
        setPopupEndingHour('');
        setEventName('');
        setPopupSelectedDate('');
        setEventFrequency('Una vez');
        setIsAllDay(false);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleSaveEvent = () => {
        const newEvent = {
            title: eventName,
            start: popupSelectedDate + (isAllDay ? '' : 'T' + popupStartingHour),
            end: isAllDay ? null : popupSelectedDate + 'T' + popupEndingHour,
            allDay: isAllDay,
            eventFrequency,
        };
        setEvents([...events, newEvent]);
        setIsPopupOpen(false);
    };

    // Maneja el click en un evento del calendario para mostrar el pop-up de detalles
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsEventDetailPopupOpen(true);
    };

    const handleCloseEventDetailPopup = () => {
        setIsEventDetailPopupOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div className='AdminCalendarapp-container'>
            <div class="admin-buttons">
                <button class="admin-btn">
                    <img src={require('../media/user_management_btn.png')} width={60}/>
                </button>
                <button class="admin-btn">
                    <img src={require('../media/admin_management_btn.png')} width={60}/>
                </button>
                <button class="admin-btn">
                    <img src={require('../media/calendar_management_btn.png')} width={60}/>
                </button>
            </div>
            <div className="AdminCalendar-left-panel">
                <h2>Horario de Trabajo</h2>
                <div className="AdminCalendar-input-group">
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de inicio:</label>
                    <input
                        type="text"
                        placeholder="Hora de inicio"
                        value={startingHour}
                        onChange={(e) => setStartingHour(e.target.value)}
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de fin:</label>
                    <input
                        type="text"
                        placeholder="Hora de fin"
                        value={endingHour}
                        onChange={(e) => setEndingHour(e.target.value)}
                    />
                </div>
                <div className="AdminCalendar-button-group">
                    <button>Editar día</button>
                    <button>Guardar día</button>
                </div>
                <div className="AdminCalendar-add-time">
                    <button className="add-button" onClick={handleAddTimeClick}>+</button>
                    <p>Añadir nuevo evento</p>
                </div>
            </div>
    
            <div className="AdminCalendar-calendar-container">
                <h2>Calendario de Trabajo</h2>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        selectable={true}
                        businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: '08:00',
                            endTime: '15:00',
                        }}
                    />
                </div>
            </div>
    
            {/* Pop-up para añadir nuevo evento */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Añadir nuevo evento</h2>
                        <div className="AdminCalendar-input-group">
                            <label>Nombre del Evento:</label>
                            <input
                                type="text"
                                placeholder="Nombre del Evento"
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
                            <label>¿Es un evento de todo el día?</label>
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
                                    <input
                                        type="text"
                                        placeholder="Hora de inicio"
                                        value={popupStartingHour}
                                        onChange={(e) => setPopupStartingHour(e.target.value)}
                                    />
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Hora de fin:</label>
                                    <input
                                        type="text"
                                        placeholder="Hora de fin"
                                        value={popupEndingHour}
                                        onChange={(e) => setPopupEndingHour(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div className="AdminCalendar-input-group">
                            <label>Frecuencia del Evento:</label>
                            <select
                                value={eventFrequency}
                                onChange={(e) => setEventFrequency(e.target.value)}
                            >
                                <option value="Una vez">Una vez</option>
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-button" onClick={handleSaveEvent}>Guardar</button>
                            <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up para mostrar detalles del evento */}
            {isEventDetailPopupOpen && selectedEvent && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Detalles del Evento</h2>
                        <div className="AdminCalendar-input-group">
                            <label>Nombre del Evento:</label>
                            <p>{selectedEvent.title}</p>
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label>Fecha de Inicio:</label>
                            <p>{selectedEvent.start.toLocaleString()}</p>
                        </div>
                        {selectedEvent.allDay ? (
                            <div className="AdminCalendar-input-group">
                                <label>Este evento es de todo el día</label>
                            </div>
                        ) : (
                            <>
                                <div className="AdminCalendar-input-group">
                                    <label>Hora de inicio:</label>
                                    <p>{selectedEvent.start.toLocaleTimeString()}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Hora de fin:</label>
                                    {selectedEvent.end ? (
                                        <p>{selectedEvent.end.toLocaleTimeString()}</p>
                                    ) : (
                                        <p>No definida</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="AdminCalendar-input-group">
                            <label>Frecuencia del Evento:</label>
                            <p>{selectedEvent.extendedProps.eventFrequency}</p>
                        </div>
                        <button className="close-button" onClick={handleCloseEventDetailPopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminWorkingHours;
