import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


import '../App.css';

const AdminWorkingHours = () => {

    const [selectedDate, setSelectedDate] = useState('');
    const [startingHour, setStartingHour] = useState('');
    const [endingHour, setEndingHour] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    /* Los eventos se cargarán de la base de datos de eventos */
    const [events, setEvents] = useState([
        { title: 'Evento 1', start: '2024-10-15T10:00:00', end: '2024-10-15T12:00:00' },
        { title: 'Evento 2', start: '2024-10-20', allDay: true },
    ]);

    /* Horarios de trabajo por defecto */
    const defaultStartTime = '08:00';
    const defaultEndTime = '15:00';

    const handleDateClick = (arg) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);
        /* TODO: Añadir comprobación para saber si hay algún evento ese día que modifique el horario de trabajo. */
        setStartingHour(defaultStartTime);
        setEndingHour(defaultEndTime);
    };

    const handleAddTimeClick = () => {
        setIsPopupOpen(true);
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleSaveEvent = () => {
        const newEvent = {
            title: 'Nuevo evento', // Puedes personalizar el título si quieres
            start: selectedDate + 'T' + startingHour,
            end: selectedDate + 'T' + endingHour,
        };
        setEvents([...events, newEvent]);
        setIsPopupOpen(false); // Cierra el pop-up después de guardar
    };


    return (
        <div className='AdminCalendarapp-container'>
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
                        value={startingHour} // Vincular el valor del input de hora de inicio
                        onChange={(e) => setStartingHour(e.target.value)} // Permitir cambios manuales
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de fin:</label>
                    <input
                        type="text"
                        placeholder="Hora de fin"
                        value={endingHour} // Vincular el valor del input de hora de fin
                        onChange={(e) => setEndingHour(e.target.value)} // Permitir cambios manuales
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
                        initialView="dayGridMonth" // Vista inicial del calendario
                        events={events} // Aquí defines los eventos
                        dateClick={handleDateClick} // Callback para cuando haces clic en una fecha
                        selectable={true} // Permitir seleccionar días o bloques de tiempo
                        businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
                            startTime: '08:00', // Horas laborables
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
                        <button className="save-button" onClick={handleSaveEvent}>Guardar</button>
                        <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminWorkingHours;