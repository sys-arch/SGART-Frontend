import React from 'react';

const MeetingDetails = ({ isOpen, meeting, onClose }) => {
    if (!isOpen || !meeting) return null;

    const { 
        title, 
        start, 
        end, 
        allDay, 
        extendedProps: { locationName, observations, organizerName, invitees } 
    } = meeting;

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>Detalles de la Reunión</h2>
                <div className="meeting-detail-group">
                    <label>Nombre:</label>
                    <p>{title || "Sin título"}</p>
                </div>
                <div className="meeting-detail-group">
                    <label>Fecha:</label>
                    <p>{start.split('T')[0]}</p>
                </div>
                {allDay ? (
                    <div className="meeting-detail-group">
                        <label>Duración:</label>
                        <p>Todo el día</p>
                    </div>
                ) : (
                    <>
                        <div className="meeting-detail-group">
                            <label>Hora de Inicio:</label>
                            <p>{start.split('T')[1]}</p>
                        </div>
                        <div className="meeting-detail-group">
                            <label>Hora de Fin:</label>
                            <p>{end.split('T')[1]}</p>
                        </div>
                    </>
                )}
                <div className="meeting-detail-group">
                    <label>Organizador:</label>
                    <p>{organizerName || "Desconocido"}</p>
                </div>
                <div className="meeting-detail-group">
                    <label>Ubicación:</label>
                    <p>{locationName || "No especificada"}</p>
                </div>
                <div className="meeting-detail-group">
                    <label>Observaciones:</label>
                    <p>{observations || "Sin observaciones"}</p>
                </div>
                <div className="meeting-detail-group">
                    <label>Invitados:</label>
                    <ul>
                        {invitees && invitees.length > 0 ? (
                            invitees.map((invitee, index) => (
                                <li key={index}>
                                    {invitee.userName} - {invitee.status}
                                </li>
                            ))
                        ) : (
                            <p>No hay invitados.</p>
                        )}
                    </ul>
                </div>
                <div className="popup-button-group">
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default MeetingDetails;
