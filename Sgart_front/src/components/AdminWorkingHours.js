import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import '../App.css';

const AdminWorkingHours = () => {

    const [selectedDate, setSelectedDate] = useState('');  // Estado para modificar día
    const [startingHour, setStartingHour] = useState('');  // Estado para modificar el horario de trabajo
    const [endingHour, setEndingHour] = useState('');      // Estado para modificar el horario de trabajo
    const [eventName, setEventName] = useState('');
    const [popupSelectedDate, setPopupSelectedDate] = useState('');  // Nuevo estado para la fecha en el pop-up
    const [eventFrequency, setEventFrequency] = useState('Una vez');  // Estado para la recurrencia
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Nuevos estados para las horas del pop-up de añadir evento
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupEndingHour, setPopupEndingHour] = useState('');

    const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false); // Pop-up de detalles
    const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado para mostrar detalles

    /* Los eventos se cargarán de la base de datos de eventos */
    const [events, setEvents] = useState([
        { title: 'Evento 1', start: '2024-10-15T10:00:00', end: '2024-10-15T12:00:00', eventFrequency: 'Una vez' },
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
        setPopupStartingHour('');  // Limpiar los campos de hora del pop-up de añadir evento
        setPopupEndingHour('');
        setEventName('');
        setPopupSelectedDate('');  // Limpiar la fecha del pop-up
        setEventFrequency('Una vez');  // Restablecer la frecuencia por defecto
        setIsPopupOpen(true); // Abrir el pop-up para añadir un nuevo evento
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // Cerrar el pop-up para añadir eventos
    };

    const handleSaveEvent = () => {
        const newEvent = {
            title: eventName,
            start: popupSelectedDate + 'T' + popupStartingHour,
            end: popupSelectedDate + 'T' + popupEndingHour,
            eventFrequency,  // Añadimos la frecuencia seleccionada
        };
        setEvents([...events, newEvent]);
        setIsPopupOpen(false); // Cierra el pop-up después de guardar
    };

    // Maneja el click en un evento del calendario para mostrar el pop-up de detalles
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event); // Guarda la información del evento
        setIsEventDetailPopupOpen(true); // Abre el pop-up de detalles
    };

    const handleCloseEventDetailPopup = () => {
        setIsEventDetailPopupOpen(false);
        setSelectedEvent(null); // Limpia la información del evento
    };

    return (
        <div className='AdminCalendarapp-container'>
            <div className="AdminCalendar-left-panel">
                <h2>Horario de Trabajo</h2>
                <div className="AdminCalendar-input-group">
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={selectedDate}  // Campo de fecha independiente para modificar el día
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de inicio:</label>
                    <input
                        type="text"
                        placeholder="Hora de inicio"
                        value={startingHour}  // Este campo ahora es independiente
                        onChange={(e) => setStartingHour(e.target.value)}
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de fin:</label>
                    <input
                        type="text"
                        placeholder="Hora de fin"
                        value={endingHour}  // Este campo ahora es independiente
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
                        eventClick={handleEventClick} // Agrega el handler de click en evento
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
                                value={popupSelectedDate}  // Campo de fecha independiente para el pop-up
                                onChange={(e) => setPopupSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label>Hora de inicio:</label>
                            <input
                                type="text"
                                placeholder="Hora de inicio"
                                value={popupStartingHour}  // Campo independiente para el pop-up
                                onChange={(e) => setPopupStartingHour(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label>Hora de fin:</label>
                            <input
                                type="text"
                                placeholder="Hora de fin"
                                value={popupEndingHour}  // Campo independiente para el pop-up
                                onChange={(e) => setPopupEndingHour(e.target.value)}
                            />
                        </div>
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
                        <div className="AdminCalendar-input-group">
                            <label>Fecha de Fin:</label>
                            {selectedEvent.end ? (
                                <p>{selectedEvent.end.toLocaleString()}</p>
                            ) : (
                                <p>No definida</p>
                            )}
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label>Frecuencia del Evento:</label>
                            <p>{selectedEvent.extendedProps.eventFrequency}</p> {/* Mostrar la frecuencia */}
                        </div>
                        <button className="close-button" onClick={handleCloseEventDetailPopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminWorkingHours;
