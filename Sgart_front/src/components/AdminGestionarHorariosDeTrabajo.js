import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const AdminGestionarHorariosDeTrabajo = () => {
    const navigate = useNavigate();
    const [blockCount, setBlockCount] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [timeBlocks, setTimeBlocks] = useState([
        { startHour: '', startMinute: '', endHour: '', endMinute: '', startError: false, endError: false },
        { startHour: '', startMinute: '', endHour: '', endMinute: '', startError: false, endError: false },
        { startHour: '', startMinute: '', endHour: '', endMinute: '', startError: false, endError: false }
    ]);

    // Manejador para actualizar el número de bloques
    const handleBlockCountChange = (e) => {
        setBlockCount(e.target.value);
        if (e.target.value) {
            setIsPopupOpen(true);
        }
    };

    // Manejador para actualizar los campos de tiempo
    const handleTimeChange = (index, field, value) => {
        const updatedBlocks = [...timeBlocks];
        updatedBlocks[index][field] = value;
        setTimeBlocks(updatedBlocks);
    };

    // Método para validar la hora y los minutos
    const validateTimeInput = (hour, minute) => {
        const isValidHour = hour >= 0 && hour <= 23;
        const isValidMinute = minute >= 0 && minute <= 59;
        return isValidHour && isValidMinute;
    };

    // Función para guardar los horarios en el formato deseado
    const handleSave = () => {
        let isValid = true;
        const updatedBlocks = timeBlocks.map((block, index) => {
            const startHour = parseInt(block.startHour, 10);
            const startMinute = parseInt(block.startMinute, 10);
            const endHour = parseInt(block.endHour, 10);
            const endMinute = parseInt(block.endMinute, 10);

            const isStartValid = validateTimeInput(startHour, startMinute);
            const isEndValid = validateTimeInput(endHour, endMinute);

            if (!isStartValid || !isEndValid) {
                isValid = false;
                alert(`Error en el Bloque ${index + 1}: Introduce una hora y minuto válidos.`);
            }

            return {
                ...block,
                startError: !isStartValid,
                endError: !isEndValid
            };
        });

        setTimeBlocks(updatedBlocks);

        if (!isValid) return; // Detiene la ejecución si hay un error

        const formattedTimes = updatedBlocks.slice(0, blockCount).map(block => {
            const startTime = `${block.startHour.padStart(2, '0')}:${block.startMinute.padStart(2, '0')}`;
            const endTime = `${block.endHour.padStart(2, '0')}:${block.endMinute.padStart(2, '0')}`;
            return { startTime, endTime };
        });

        // Aquí es donde enviarías los datos al backend
        console.log('Datos a enviar al backend:', formattedTimes);
        setIsPopupOpen(false);
    };

    // Función para manejar el cierre del pop-up y reiniciar la selección
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setBlockCount(''); // Reinicia la selección al cerrar el pop-up
    };

    return (
        <div className="container">
            <div className="admin-buttons">
                <button className="admin-btn" onClick={() => navigate('/user-options')}>
                    <img src={require('../media/user_management_btn.png')} width={60} alt="Mant. Usuarios" title="Mant. Usuarios" />
                </button>
                <button className="admin-btn">
                    <img src={require('../media/admin_management_btn.png')} width={60} alt="Mant. Administradores" title="Mant. Administradores" />
                </button>
                <button className="admin-btn" onClick={() => navigate('/admin-working-hours')}>
                    <img src={require('../media/calendar_management_btn.png')} width={60} alt="Mant. Calendario" title="Mant. Calendario" />
                </button>
            </div>
            <h2>Gestión de Horarios de Trabajo</h2>
            <div className="work-hours-selector-group">
                <select
                    id="blockCount"
                    className="work-hours-selector"
                    value={blockCount}
                    onChange={handleBlockCountChange}
                    required
                >
                    <option value="" disabled></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <label htmlFor="blockCount" className="work-hours-floating-label">Número de bloques de trabajo</label>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Configurar Bloques de Trabajo</h2>
                        {Array.from({ length: blockCount }).map((_, index) => (
                            <div key={index} className="work-hours-block-container">
                                <label className="work-hours-block-label">Hora de inicio del bloque {index + 1}:</label>
                                <div className="work-hours-input-group">
                                    <input
                                        type="number"
                                        placeholder="HH"
                                        value={timeBlocks[index].startHour}
                                        onChange={(e) => handleTimeChange(index, 'startHour', e.target.value)}
                                        min="0"
                                        max="23"
                                        className={`work-hours-input ${timeBlocks[index].startError ? 'error' : ''}`}
                                    />
                                    :
                                    <input
                                        type="number"
                                        placeholder="MM"
                                        value={timeBlocks[index].startMinute}
                                        onChange={(e) => handleTimeChange(index, 'startMinute', e.target.value)}
                                        min="0"
                                        max="59"
                                        className={`work-hours-input ${timeBlocks[index].startError ? 'error' : ''}`}
                                    />
                                </div>
                                <label className="work-hours-block-label">Hora de fin del bloque {index + 1}:</label>
                                <div className="work-hours-input-group">
                                    <input
                                        type="number"
                                        placeholder="HH"
                                        value={timeBlocks[index].endHour}
                                        onChange={(e) => handleTimeChange(index, 'endHour', e.target.value)}
                                        min="0"
                                        max="23"
                                        className={`work-hours-input ${timeBlocks[index].endError ? 'error' : ''}`}
                                    />
                                    :
                                    <input
                                        type="number"
                                        placeholder="MM"
                                        value={timeBlocks[index].endMinute}
                                        onChange={(e) => handleTimeChange(index, 'endMinute', e.target.value)}
                                        min="0"
                                        max="59"
                                        className={`work-hours-input ${timeBlocks[index].endError ? 'error' : ''}`}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="work-hours-save-button" onClick={handleSave}>Guardar</button>
                        <button className="work-hours-close-button" onClick={handleClosePopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGestionarHorariosDeTrabajo;
