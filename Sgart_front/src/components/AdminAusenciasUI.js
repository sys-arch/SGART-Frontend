import React, { useState } from 'react';
import VentanaConfirm from './VentanaConfirm';
import VerAusenciasModal from './VerAusenciasModal';
import { useNavigate } from 'react-router-dom';

const AdminAusenciasUI = () => {
    const navigate = useNavigate();
    // Estados
    const [showModal, setShowModal] = useState(false); // Para controlar la visibilidad del modal
    const [empleados] = useState([
        { id: 1, nombre: 'Juan', apellidos: 'Pérez', email: 'juan.perez@example.com', perfil: 'Desarrollador', centro: 'Ciudad Real' },
        { id: 2, nombre: 'María', apellidos: 'López', email: 'maria.lopez@example.com', perfil: 'Desarrollador', centro: 'Ciudad Real' },
        { id: 3, nombre: 'Carlos', apellidos: 'García', email: 'carlos.garcia@example.com', perfil: 'Product Owner', centro: 'Madrid' },
        { id: 4, nombre: 'Ana', apellidos: 'Martínez', email: 'ana.martinez@example.com', perfil: 'Stakeholder', centro: 'Ciudad Real' },
        { id: 5, nombre: 'Luis', apellidos: 'Ramírez', email: 'luis.ramirez@example.com', perfil: 'Desarrollador', centro: 'Toledo' },
    ]);

    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState('');

    const [showAbsencesPopup, setShowAbsencesPopup] = useState(false);
    const [empleadoAusencias, setEmpleadoAusencias] = useState(null);

    const handleOpenAusenciasPopup = (empleado) => {
        setEmpleadoAusencias(empleado);
        setShowAbsencesPopup(true);
    };
    
    const handleCloseAusenciasPopup = () => {
        setShowAbsencesPopup(false);
    };    

    // Manejar la apertura del modal
    const handleOpenModal = (empleado) => {
        setEmpleadoSeleccionado(empleado);
        setShowModal(true);
    };

    // Manejar el cierre del modal
    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    // Guardar la ausencia (con confirmación)
    const handleAddAbsence = () => {
        if (!tipoAusencia || !fechaInicio || !fechaFin || (mostrarHoras && (!horaInicio || !horaFin))) {
            alert('Por favor, complete todos los campos.');
        return;
    }
    setConfirmationAction('add'); // Establece la acción como 'añadir'
    setShowConfirmation(true);    // Muestra la ventana de confirmación
    };

    
    const handleConfirmSave = () => {

        const nuevaAusencia = {
            tipoAusencia,
            fechaInicio,
            fechaFin,
            horaInicio: mostrarHoras ? horaInicio : null,
            horaFin: mostrarHoras ? horaFin : null,
        };
        console.log(`Ausencia guardada para ${empleadoSeleccionado.nombre} ${empleadoSeleccionado.apellidos}:`, nuevaAusencia);
        setShowConfirmation(false);
        resetForm();
        setShowModal(false);
    };
    
    const handleCancelSave = () => {
        setShowConfirmation(false);
        resetForm();
    };

    // Estados del formulario de ausencia
    const [tipoAusencia, setTipoAusencia] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mostrarHoras, setMostrarHoras] = useState(false);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [showDateError, setShowDateError] = useState(false);

    // Cambiar el valor de los campos del formulario de ausencia
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'tipoAusencia':
                setTipoAusencia(value);
                if (value === 'vacaciones') {
                    setMostrarHoras(false);
                    setShowDateError(false); 
                }
                break;
            case 'fechaInicio':
                setFechaInicio(value);
                // Si se selecciona la fecha de inicio, comprobar que coincida con la fecha de fin si las horas están activadas
                if (value === fechaFin) {
                    setShowDateError(false);
                }
                break;
            case 'fechaFin':
                setFechaFin(value);
                // Si se selecciona la fecha de fin, comprobar que coincida con la fecha de inicio si las horas están activadas
                if (value === fechaInicio) {
                    setShowDateError(false); // No se permite personalizar si las fechas no coinciden
                }
                break;
            case 'horaInicio':
                setHoraInicio(value);
                break;
            case 'horaFin':
                setHoraFin(value);
                break;
            default:
                break;
        }
    };
    
    const resetForm = () => {
        setTipoAusencia('');
        setFechaInicio('');
        setFechaFin('');
        setHoraInicio('');
        setHoraFin('');
        setShowConfirmation(false);
        setMostrarHoras(false);
    };    

    return (
        <div className="user-validation-container">
            <div className="admin-buttons">
                <button className="admin-btn" onClick={() => navigate('/user-options')}>
                    <img src={require('../media/user_management_btn.png')} width={60} alt="Mant. Usuarios" title="Mant. Usuarios"/>
                </button>
                <button className="admin-btn">
                    <img src={require('../media/admin_management_btn.png')} width={60} alt="Mant. Administradores" title="Mant. Administradores"/>
                </button>
                <button className="admin-btn" onClick={() => navigate('/admin-working-hours')}>
                    <img src={require('../media/calendar_management_btn.png')} width={60} alt="Mant. Calendario" title="Mant. Calendario"/>
                </button>
            </div>
            <div className="login-box">
                <body>
                    <h2>Lista de Trabajadores</h2>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Email</th>
                                <th>Centro</th>
                                <th>Perfil</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado) => (
                                <tr key={empleado.id}>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.apellidos}</td>
                                    <td>{empleado.email}</td>
                                    <td>{empleado.centro}</td>
                                    <td>{empleado.perfil}</td>
                                    <td>
                                        <button className="action-button add-button" onClick={() => handleOpenModal(empleado)} title="Añadir Ausencia">
                                            +
                                        </button>
                                        <button className="action-button details-button" onClick={() => handleOpenAusenciasPopup(empleado)} title="Ver Ausencias">
                                            &#8942;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </body>

                {showModal && (
                    <div className="user-edit-container">
                        <div className="popup-container">
                            <h2>Agregar Ausencia</h2>
                            <form>
                                <div className="input-group-register">
                                    <select name="tipoAusencia" id="ausencia" value={tipoAusencia} onChange={handleChange} required>
                                        <option value="" disabled hidden></option>
                                        <option value="vacaciones">Vacaciones</option>
                                        <option value="baja">Baja</option>
                                        <option value="asuntos_personales">Asuntos Personales</option>
                                    </select>
                                    <label htmlFor='ausencia'>Tipo de Ausencia</label>
                                </div>
                                {(tipoAusencia === 'vacaciones' || tipoAusencia === 'baja' || tipoAusencia === 'asuntos_personales') && (
                                <>
                                <div className="input-group-register">
                                    <input  type={fechaInicio ? "date" : "text"} id="fechaInicio" name="fechaInicio" value={fechaInicio} onFocus={(e) => (e.target.type = "date")} 
                                        onBlur={(e) => {
                                            if (!fechaInicio) {
                                                e.target.type = "text";
                                            }
                                        }} onChange={handleChange} placeholder="" required/>
                                    <label htmlFor='fechaInicio'>Fecha de Inicio</label>
                                </div>
                                <div className="input-group-register">
                                    <input type={fechaFin ? "date" : "text"} id="fechaFin" name="fechaFin" value={fechaFin} onFocus={(e) => (e.target.type = "date")} 
                                        onBlur={(e) => {
                                            if (!fechaFin) {
                                                e.target.type = "text";
                                            }
                                        }} onChange={handleChange} placeholder="" required/>
                                    <label htmlFor='fechaFin'>Fecha de Fin</label>
                                </div>
                                </>
                                )}
                                {(tipoAusencia === 'baja' || tipoAusencia === 'asuntos_personales') && (
                                <div className="input-group-register">
                                    <button type="button" onClick={() => {
                                        if (fechaInicio === fechaFin && fechaInicio) {
                                            setMostrarHoras((prevMostrarHoras) => !prevMostrarHoras);
                                            setShowDateError(false); // Si las fechas coinciden, no mostramos el error
                                        } else {
                                            setShowDateError(true); // Mostramos el error si las fechas no coinciden
                                        }
                                        }} className="personalizar-btn"> {mostrarHoras ? 'Ocultar Personalización' : 'Personalizar'}
                                    </button>
                                {showDateError && (
                                    <p className="error-fecha">Las fechas de inicio y fin deben ser iguales para personalizar las horas.</p>
                                )}
                                </div>
                                )}
                                {mostrarHoras && (
                                <>
                                <div className="input-group-register">
                                    <input type="text" id="horaInicio" name="horaInicio" value={horaInicio} onFocus={(e) => (e.target.type = "time")} 
                                        onBlur={(e) => (e.target.type = "text")} onChange={handleChange} placeholder="" required/>
                                    <label htmlFor='horaInicio'>Hora de Inicio</label>
                                </div>
                                <div className="input-group-register">
                                    <input type="text" id="horaFin" name="horaFin" value={horaFin} onFocus={(e) => (e.target.type = "time")} 
                                        onBlur={(e) => (e.target.type = "text")} onChange={handleChange} placeholder="" required/>
                                    <label htmlFor='horaFin'>Hora de Fin</label>
                                </div>
                                </>
                                )}
                                <div className="confirmation-buttons">
                                    <button type="button" className="guardar-btn" onClick={handleAddAbsence}>Añadir</button>
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Ventana de confirmación */}
                {showConfirmation && (
                    <VentanaConfirm
                        onConfirm={handleConfirmSave}
                        onCancel={handleCancelSave}
                        action={confirmationAction}
                    />
                )}
                {showAbsencesPopup && empleadoAusencias && (
                    <VerAusenciasModal empleado={empleadoAusencias} onClose={handleCloseAusenciasPopup} />
                )}
            </div>
        </div>
    );
};

export default AdminAusenciasUI;
