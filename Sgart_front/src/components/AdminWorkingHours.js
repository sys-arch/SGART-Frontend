import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


import '../App.css';

const AdminWorkingHours = () => {
    /* Los eventos se cargarán de la base de datos de eventos */
    const [events, setEvents] = useState([
        { title: 'Evento 1', start: '2024-10-15T10:00:00', end: '2024-10-15T12:00:00' },
        { title: 'Evento 2', start: '2024-10-20', allDay: true },
    ]);

    const handleDateClick = (arg) => {
        alert('Clic en la fecha: ' + arg.dateStr);
        // Aquí podrías abrir un modal para crear un nuevo evento, por ejemplo.
    };

    return (
        <div className='AdminCalendarapp-container'>
            <div className="AdminCalendar-left-panel">
                <h2>Horario de Trabajo</h2>
                <div className="AdminCalendar-input-group">
                    <label>Fecha:</label>
                    <input type="date" placeholder="Fecha" />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de inicio:</label>
                    <input type="text" placeholder="Hora de inicio" />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de fin:</label>
                    <input type="text" placeholder="Hora de fin" />
                </div>
                <div className="AdminCalendar-button-group">
                    <button>Editar día</button>
                    <button>Guardar día</button>
                </div>
                <div className="AdminCalendar-add-time">
                    <button className="add-button">+</button>
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
                            startTime: '09:00', // Horas laborables
                            endTime: '17:00',
                        }}
                    />
                </div>
            </div>
        </div>

    );
}

export default AdminWorkingHours;