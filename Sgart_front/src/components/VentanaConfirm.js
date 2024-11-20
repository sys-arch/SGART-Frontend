import React from 'react';
import PropTypes from 'prop-types';

const VentanaConfirm = ({ onConfirm, onCancel, action }) => {
    const getTitle = () => {
        switch (action) {
            case 'save':
                return 'Confirmar Cambios';
            case 'edit':
                return 'Confirmar Cambios';
            case 'delete':
                return 'Confirmar Eliminación';
            case 'add':
                return 'Confirmar Ausencia';
            case 'logout':
                return 'Cerrar Sesión';
            default:
                return '';
        }
    };

    const getMessage = () => {
        switch (action) {
            case 'save':
                return '¿Está seguro de que desea guardar los cambios?';
            case 'edit':
                return '¿Está seguro de que desea guardar los cambios?';
            case 'delete':
                return '¿Está seguro de que desea eliminar este usuario?';
            case 'add':
                return '¿Está seguro de que desea añadir esta ausencia?';
            case 'accept':
                return '¿Está seguro de que desea asistir?';
            case 'reject':
                return '¿Está seguro de que desea rechazar esta reunión?';
            case 'logout':
                return '¿Está seguro de que desea cerrar sesión?';
            default:
                return '';
        }
    };

    return (
        <div className="ventana-confirm">
            <div className="confirmation-content">
                <h3>{getTitle()}</h3>
                <p>{getMessage()}</p>
                <div className="confirmation-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

VentanaConfirm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
};

export default VentanaConfirm;
