import React from 'react';

const VerAusenciasModal = ({ empleado, onClose }) => {
    // Datos de ejemplo para las ausencias
    const ausenciasDeEjemplo = [
        { tipoAusencia: 'Vacaciones', fechaInicio: '2024-11-10', fechaFin: '2024-11-15', horaInicio: null, horaFin: null },
        { tipoAusencia: 'Baja', fechaInicio: '2024-11-20', fechaFin: '2024-11-20', horaInicio: '11:00', horaFin: '15:00' },
    ];

    return (
        <div className="popup-overlay-ausencias">
            <div className="popup-container-ausencias">
                <h2>Ausencias de {empleado.nombre} {empleado.apellidos}</h2>
                <ul className="ausencias-list">
                    {ausenciasDeEjemplo.map((ausencia, index) => (
                        <li key={index} className="ausencia-item">
                            <p><strong>Tipo de Ausencia:</strong> {ausencia.tipoAusencia}</p>
                            <p><strong>Fecha de Inicio:</strong> {ausencia.fechaInicio}</p>
                            <p><strong>Fecha de Fin:</strong> {ausencia.fechaFin}</p>
                            {ausencia.horaInicio && ausencia.horaFin && (
                                <>
                                    <p><strong>Hora de Inicio:</strong> {ausencia.horaInicio}</p>
                                    <p><strong>Hora de Fin:</strong> {ausencia.horaFin}</p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <button className="cancel-btn-ausencias" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default VerAusenciasModal;
