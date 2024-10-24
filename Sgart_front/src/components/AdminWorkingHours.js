import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';

const AdminWorkingHours = () => {
    // Variables para modificar día laborable
    const [selectedDate, setSelectedDate] = useState('');
    const [startingHour, setStartingHour] = useState('');
    const [startingMinutes, setStartingMinutes] = useState(''); // Nuevos minutos para el inicio
    const [endingHour, setEndingHour] = useState('');
    const [endingMinutes, setEndingMinutes] = useState(''); // Nuevos minutos para el fin
    const [eventName, setEventName] = useState('');

    // Variables del pop-up de creación de eventos
    const [popupSelectedDate, setPopupSelectedDate] = useState('');
    const [eventFrequency, setEventFrequency] = useState('Una vez');
    const [isAllDay, setIsAllDay] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupStartingMinutes, setPopupStartingMinutes] = useState(''); // Nuevos minutos para el pop-up
    const [popupEndingHour, setPopupEndingHour] = useState('');
    const [popupEndingMinutes, setPopupEndingMinutes] = useState(''); // Nuevos minutos para el pop-up

    // Nueva variable para abrir el pop-up de personalización
    const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);
    const [customFrequency, setCustomFrequency] = useState('Diario'); // Frecuencia de repetición personalizada
    const [repeatCount, setRepeatCount] = useState(''); // Cantidad de repeticiones si es personalizado

    // Variables para el pop-up de detalles de los eventos
    const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    //Cargar los eventos de la base de datos
    const loadEvents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:9000/administrador/eventos/loadEvents');
            if (!response.ok) {
                throw new Error('Error al cargar los eventos');
            }
    
            const backendEvents = await response.json();
            const transformedEvents = transformEvents(backendEvents);
            setEvents(transformedEvents);
        } catch (error) {
            console.error("Error al cargar los eventos: ", error);
        }
    }, []);

    const transformEvents = (backendEvents) => {
        return backendEvents.map(event => ({
            title: event.event_title,
            start: `${event.event_start_date}T${event.event_time_start}`,
            end: `${event.event_start_date}T${event.event_time_end}`,
            allDay: event.event_all_day === 1, // convertir el valor del backend en un booleano
            eventFrequency: event.event_frequency
        }));
    };

    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Hacer la solicitud para obtener los eventos guardados en la base de datos
        loadEvents();
    }, [loadEvents]);

    /* Horarios de trabajo por defecto - Debe cargarse de la base de datos de Working Hours */
    const defaultStartTime = '08:00';
    const defaultEndTime = '15:00';

    // Manejar click en fecha del calendario
    const handleDateClick = (arg) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);
        setStartingHour(defaultStartTime.split(":")[0]);
        setStartingMinutes(defaultStartTime.split(":")[1]);
        setEndingHour(defaultEndTime.split(":")[0]);
        setEndingMinutes(defaultEndTime.split(":")[1]);
    };

    // Añadir un nuevo evento
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

    // Cerrar pop-up de creación
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // Cerrar pop-up de personalización
    const handleCloseCustomPopup = () => {
        setIsCustomPopupOpen(false);
    };

    // Guardar el nuevo evento
    // Guardar el nuevo evento
    const handleSaveEvent = async () => {
        // Combina las horas y minutos en el formato HH:mm para la base de datos SQL
        const startingTime = `${popupStartingHour.padStart(2, '0')}:${popupStartingMinutes.padStart(2, '0')}:00`;
        const endingTime = `${popupEndingHour.padStart(2, '0')}:${popupEndingMinutes.padStart(2, '0')}:00`;

        // Crear el objeto del evento
        const newEvent = {
            event_title: eventName,
            event_start_date: popupSelectedDate,  // Solo la fecha, sin la hora
            event_all_day: isAllDay ? 1 : 0,  // Convertimos el booleano a 0 o 1
            event_time_start: isAllDay ? '00:00:00' : startingTime,
            event_time_end: isAllDay ? '23:59:59' : endingTime,
            event_frequency: eventFrequency === 'Personalizado' ? customFrequency : eventFrequency, // Frecuencia
            event_repetitions_count: eventFrequency === 'Personalizado' ? parseInt(repeatCount, 10) : (eventFrequency === 'Una vez' ? 1 : -1),// Repeticiones o null
        };

        // Log para comprobar lo que estás enviando
        console.log("Evento que se enviará al backend:", newEvent);

        try {
            // Envía el evento al backend usando fetch
            const response = await fetch('http://localhost:9000/administrador/eventos/saveEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el evento');
            }

            const savedEvent = await response.json();
            setEvents([...events, savedEvent]);  // Actualiza el estado de los eventos
            await loadEvents();
            setIsPopupOpen(false);  // Cierra el pop-up
            alert("[!] Se ha guardado el evento de manera exitosa.")
        } catch (error) {
            console.error('Error al guardar el evento:', error);
        }
    };


    // Manejar la selección de repetición personalizada
    const handleCustomFrequency = () => {
        setIsCustomPopupOpen(true);
    };

    // Guardar las opciones de repetición personalizada
    const handleSaveCustomFrequency = () => {
        setIsCustomPopupOpen(false); // Cierra el pop-up de personalizado
    };

    // Manejar el click en un evento del calendario
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
                    <img src={require('../media/user_management_btn.png')} width={60} />
                </button>
                <button class="admin-btn">
                    <img src={require('../media/admin_management_btn.png')} width={60} />
                </button>
                <button class="admin-btn">
                    <img src={require('../media/calendar_management_btn.png')} width={60} />
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
                    <div>
                        <input
                            type="number"
                            placeholder="HH"
                            value={startingHour}
                            onChange={(e) => setStartingHour(e.target.value)}
                            min="0"
                            max="23"
                        />
                        :
                        <input
                            type="number"
                            placeholder="MM"
                            value={startingMinutes}
                            onChange={(e) => setStartingMinutes(e.target.value)}
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
                            value={endingHour}
                            onChange={(e) => setEndingHour(e.target.value)}
                            min="0"
                            max="23"
                        />
                        :
                        <input
                            type="number"
                            placeholder="MM"
                            value={endingMinutes}
                            onChange={(e) => setEndingMinutes(e.target.value)}
                            min="0"
                            max="59"
                        />
                    </div>
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
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="HH"
                                            value={popupStartingHour}
                                            onChange={(e) => setPopupStartingHour(e.target.value)}
                                            min="0"
                                            max="23"
                                        />
                                        :
                                        <input
                                            type="number"
                                            placeholder="MM"
                                            value={popupStartingMinutes}
                                            onChange={(e) => setPopupStartingMinutes(e.target.value)}
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
                                            onChange={(e) => setPopupEndingHour(e.target.value)}
                                            min="0"
                                            max="23"
                                        />
                                        :
                                        <input
                                            type="number"
                                            placeholder="MM"
                                            value={popupEndingMinutes}
                                            onChange={(e) => setPopupEndingMinutes(e.target.value)}
                                            min="0"
                                            max="59"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="AdminCalendar-input-group">
                            <label>Frecuencia del Evento:</label>
                            <select
                                value={eventFrequency}
                                onChange={(e) => {
                                    setEventFrequency(e.target.value);
                                    if (e.target.value === 'Personalizado') handleCustomFrequency();
                                }}
                            >
                                <option value="Una vez">Una vez</option>
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                                <option value="Personalizado">Personalizado...</option>
                            </select>
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-button" onClick={handleSaveEvent}>Guardar</button>
                            <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up para personalizar la repetición */}
            {isCustomPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container small">
                        <h2>Personalizar repetición</h2>
                        <div className="AdminCalendar-input-group">
                            <label>Frecuencia de repetición:</label>
                            <select
                                value={customFrequency}
                                onChange={(e) => setCustomFrequency(e.target.value)}
                            >
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label>Número de repeticiones:</label>
                            <input
                                type="number"
                                min="1"
                                value={repeatCount}
                                onChange={(e) => setRepeatCount(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-button" onClick={handleSaveCustomFrequency}>Guardar</button>
                            <button className="close-button" onClick={handleCloseCustomPopup}>Cancelar</button>
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
